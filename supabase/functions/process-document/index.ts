import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const MEDICAL_SIMPLIFICATION_PROMPT = `אתה עוזר רפואי מומחה המתמחה בהסברת מסמכים רפואיים לאנשים שאינם אנשי מקצוע בתחום הרפואה.

## כללי זהב — חובה לעמוד בהם בכל עת:
1. **אל תוסיף שום מידע** שאינו מופיע במסמך המקורי
2. **אל תמחק שום מידע** המשמעותי מהמסמך המקורי
3. **אל תמליץ על טיפולים** שאינם כתובים במסמך
4. **אל תפרש** ממצאים — רק הסבר את פשרם בשפה פשוטה
5. **אל תשנה** מינונים, תאריכים, או ערכים מספריים
6. כאשר יש מונח רפואי באנגלית — הסבר אותו בעברית ושמור את המונח המקורי בסוגריים

## פורמט הפלט — JSON בלבד:
החזר אך ורק מבנה JSON תקין בפורמט הבא (ללא שום טקסט מחוצה לו):

{
  "document_type": "סוג המסמך (לדוגמה: תוצאות בדיקות דם, מכתב שחרור, מרשם)",
  "summary": "תקציר קצר וברור של המסמך כולו ב-2-3 משפטים",
  "sections": [
    {
      "heading": "כותרת הקטע בעברית",
      "original_text": "הטקסט המקורי מהמסמך (מילה במילה)",
      "simplified_text": "הסבר פשוט ומובן לאדם ממוצע, כתוב בשפה יומיומית",
      "confidence": "high"
    }
  ],
  "disclaimer": "פישוט זה נוצר על ידי בינה מלאכותית. הוא אינו מהווה ייעוץ רפואי. יש להתייעץ תמיד עם הרופא המטפל לגבי כל החלטה רפואית."
}

## רמות ביטחון (confidence):
- "high" — המידע ברור וחד-משמעי
- "medium" — המידע ברור אך מכיל מונחים טכניים
- "low" — המידע מורכב, מומלץ להתייעץ עם הרופא

המסמך הרפואי המצורף הוא מטופל ישראלי. דף PDF. נתח אותו לפי ההנחיות.`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let currentTranslationId: string | null = null;

  try {
    const { translationId, filePath } = await req.json();
    currentTranslationId = translationId;

    if (!translationId || !filePath) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update status to processing
    await supabase.from('translations').update({ status: 'processing' }).eq('id', translationId);

    // Download file
    const { data: fileData, error: downloadError } = await supabase.storage.from('documents').download(filePath);
    
    if (downloadError || !fileData) {
      throw new Error(`Failed to download file: ${downloadError?.message}`);
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: MEDICAL_SIMPLIFICATION_PROMPT },
            {
              inline_data: {
                mime_type: 'application/pdf',
                data: base64Pdf
              }
            }
          ]
        }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      })
    });

    const geminiData = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', geminiData);
      throw new Error(`Gemini API Error: ${geminiData.error?.message || 'Unknown error'}`);
    }

    let simplifiedContent;
    try {
      const textResponse = geminiData.candidates[0].content.parts[0].text;
      simplifiedContent = JSON.parse(textResponse);
    } catch {
      throw new Error('Failed to parse Gemini response as JSON');
    }

    // Update the database with the result
    await supabase.from('translations').update({
      status: 'completed',
      simplified_content: simplifiedContent,
      processing_time_ms: 0 // Optional: calculate actual time
    }).eq('id', translationId);

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error processing document:', err);
    // Try to update the DB with the error if we have the payload translationId
    if (currentTranslationId) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase.from('translations').update({
          status: 'error',
          error_message: errorMsg
        }).eq('id', currentTranslationId);
      } catch {
        // Ignore inner errors
      }
    }

    return new Response(JSON.stringify({ error: errorMsg }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
