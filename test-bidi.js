const lines = [
  ')Recommendations( 5. המלצות להמשך טיפול',
  '.)ברונכיטיס חריפה( Main Diagnosis: Acute Bronchitis',
  '1. מנוחה: 5 ימי מנוחה בבית מיום השחרור.',
  'Diagnoses (אבחנות)'
];

const LRM = '\u200E'; // Left-to-Right Mark
const RLM = '\u200F'; // Right-to-Left Mark

lines.forEach(line => {
  // Regex: Find English words
  const regex = /([a-zA-Z][a-zA-Z0-9]*)/g;
  const parts = line.split(regex);
  
  const firstStrong = line.match(/[a-zA-Zא-ת]/);
  const isRtl = firstStrong ? /[א-ת]/.test(firstStrong[0]) : true;

  console.log('--- Original ---');
  console.log(line);
  console.log('Base Dir:', isRtl ? 'RTL' : 'LTR');
  
  let result = '';
  parts.forEach(p => {
    if (!p) return;
    if (/[a-zA-Z]/.test(p)) {
      // Wrap English word in LRM to isolate it and its neighbors
      result += `${LRM}${p}${LRM}`;
    } else {
      result += p;
    }
  });
  console.log('Processed:', result);
});
