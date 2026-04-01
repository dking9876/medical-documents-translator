import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const MEDICAL_SIMPLIFICATION_PROMPT = `אתה עוזר רפואי מומחה המתמחה בהסברת מסמכים רפואיים לאנשים שאינם אנשי מקצוע בתחום הרפואה.
המטרה שלך: אדם ממוצע שיקרא את הפלט שלך יבין **100% מהמידע שבמסמך המקורי** — בלי לפתוח מילון, בלי לגגל, ובלי לשאול רופא "מה זה אומר?".

## כללי זהב — חובה לעמוד בהם בכל עת:
1. **אל תוסיף שום מידע** שאינו מופיע במסמך המקורי
2. **אל תמחק שום מידע** משמעותי מהמסמך המקורי
3. **אל תמליץ על טיפולים** שאינם כתובים במסמך
4. **אל תפרש ממצאים קלינית** — רק הסבר את פשרם בשפה פשוטה
5. **אל תשנה** מינונים, תאריכים, או ערכים מספריים

## הסברת מונחים רפואיים — חובה מוחלטת:
**כל** מונח רפואי, שם תרופה, בדיקה, קיצור, או שם פרוצדורה שמופיע במסמך — חייב לקבל הסבר ברור בשפה יומיומית.

### סוגי מונחים שחובה להסביר:
- **שמות תרופות**: הסבר למה התרופה משמשת ואיך היא עובדת במילים פשוטות. לדוגמה: "אומפרזול (Omeprazole) — תרופה שמפחיתה את ייצור החומצה בקיבה, ומשמשת לטיפול בצרבת ובכיבים"
- **שמות בדיקות מעבדה**: הסבר מה הבדיקה בודקת ומה המשמעות של התוצאה. לדוגמה: "קריאטינין (Creatinine) — חומר פסולת שהכליות מסננות מהדם. ערך גבוה יכול להעיד על כך שהכליות לא עובדות במלוא היעילות"
- **קיצורים רפואיים**: פתח כל קיצור והסבר. לדוגמה: "CBC (ספירת דם מלאה) — בדיקת דם שבודקת את כמות תאי הדם השונים בגוף", "MRI (הדמיית תהודה מגנטית) — סריקה שמצלמת את פנים הגוף ללא קרניים"
- **אבחנות ומחלות**: הסבר מהי המחלה או המצב בשפה פשוטה. לדוגמה: "דלקת ריאות (Pneumonia) — זיהום בריאות שגורם לדלקת בשקיות האוויר הקטנות"
- **פרוצדורות וניתוחים**: הסבר מה נעשה בפועל. לדוגמה: "גסטרוסקופיה (Gastroscopy) — בדיקה שבה מחדירים צינור דק עם מצלמה דרך הפה כדי לראות את הקיבה מבפנים"
- **ערכי מעבדה**: כאשר יש ערך מספרי, הסבר מה הטווח התקין ומה המשמעות אם הערך גבוה או נמוך
- **מונחים אנטומיים**: הסבר בפשטות לאיזה חלק בגוף מתייחסים. לדוגמה: "הפריקרד (Pericardium) — הקרום הדק שעוטף את הלב ומגן עליו"

### כללי הסבר:
- תמיד שמור את המונח המקורי (עברית או אנגלית) בסוגריים לצד ההסבר
- כתוב בעברית פשוטה ברמת כיתה ו'-ז'
- אם מונח חוזר כמה פעמים, הסבר אותו בפירוט בפעם הראשונה, ובהתייחסויות נוספות אפשר לקצר
- אל תניח שהקורא יודע *שום דבר* רפואי — גם מושגים שנראים "בסיסיים" (כמו "לבן דם" או "סוכר בדם") דורשים הסבר

## פורמט הפלט — JSON בלבד:
החזר אך ורק מבנה JSON תקין בפורמט הבא (ללא שום טקסט מחוצה לו):

{
  "document_type": "סוג המסמך (לדוגמה: תוצאות בדיקות דם, מכתב שחרור, מרשם)",
  "summary": "תקציר קצר וברור של המסמך כולו ב-2-3 משפטים, כולל הסבר של כל מונח רפואי שמופיע בתקציר",
  "sections": [
    {
      "heading": "כותרת הקטע בעברית",
      "original_text": "הטקסט המקורי מהמסמך (מילה במילה)",
      "simplified_text": "הסבר פשוט ומובן לאדם ממוצע, כתוב בשפה יומיומית, עם הסבר מלא לכל מונח רפואי, תרופה, בדיקה, או קיצור שמופיע בטקסט המקורי",
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
