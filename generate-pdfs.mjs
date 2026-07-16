import { readFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

const docsDir = join(process.cwd(), 'docs');
const outDir = join(process.cwd(), 'docs', 'pdf');

// Ensure output dir exists
import { mkdirSync } from 'fs';
mkdirSync(outDir, { recursive: true });

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 11px; line-height: 1.6; color: #1a1a2e; padding: 40px; max-width: 900px; margin: 0 auto; }
h1 { font-size: 22px; font-weight: 800; color: #1B3A6B; margin: 30px 0 12px; padding-bottom: 8px; border-bottom: 3px solid #1B3A6B; }
h2 { font-size: 17px; font-weight: 700; color: #1B3A6B; margin: 24px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #e0e0e0; }
h3 { font-size: 14px; font-weight: 700; color: #333; margin: 18px 0 8px; }
h4 { font-size: 12px; font-weight: 600; color: #555; margin: 14px 0 6px; }
p { margin: 6px 0; }
ul, ol { margin: 6px 0 6px 20px; }
li { margin: 3px 0; }
table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10px; }
th { background: #1B3A6B; color: white; padding: 6px 10px; text-align: left; font-weight: 600; }
td { padding: 5px 10px; border-bottom: 1px solid #e0e0e0; }
tr:nth-child(even) td { background: #f8f9fa; }
code { background: #f0f0f0; padding: 1px 4px; border-radius: 3px; font-size: 10px; font-family: 'Consolas', monospace; }
pre { background: #1a1a2e; color: #e0e0e0; padding: 12px; border-radius: 6px; overflow-x: auto; margin: 10px 0; }
pre code { background: none; color: inherit; padding: 0; }
strong { font-weight: 700; }
blockquote { border-left: 4px solid #1B3A6B; padding: 8px 12px; margin: 10px 0; background: #f0f4ff; }
hr { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
.header-cover { text-align: center; padding: 60px 20px 40px; margin-bottom: 30px; border-bottom: 3px solid #1B3A6B; }
.header-cover h1 { border: none; font-size: 28px; margin-bottom: 8px; }
.header-cover .subtitle { font-size: 14px; color: #666; margin-top: 4px; }
.header-cover .version { font-size: 11px; color: #999; margin-top: 16px; }
@media print { body { padding: 20px; } h1 { page-break-before: always; } h1:first-of-type { page-break-before: avoid; } }
`;

const files = readdirSync(docsDir).filter(f => f.endsWith('.md')).sort();

console.log(`Found ${files.length} markdown files:`);

for (const file of files) {
  const md = readFileSync(join(docsDir, file), 'utf-8');
  const html = marked.parse(md);
  const pdfName = basename(file, '.md') + '.pdf';
  
  console.log(`  Converting ${file} → ${pdfName}...`);
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><style>${CSS}</style></head>
    <body>${html}</body>
    </html>
  `);
  
  await page.pdf({
    path: join(outDir, pdfName),
    format: 'Letter',
    margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="font-size:8px;color:#999;width:100%;text-align:center;padding:0 20px">BWI TOOLROOM — Documentación &nbsp;&nbsp;|&nbsp;&nbsp; Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
  });
  
  await browser.close();
  console.log(`  ✓ ${pdfName} created`);
}

console.log(`\nAll ${files.length} PDFs generated in docs/pdf/`);
