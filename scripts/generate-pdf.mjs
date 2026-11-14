import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPath = path.join(publicDir, 'Space-Ready-NASA-Space-Apps-2026-Submission.pdf');

const doc = new PDFDocument({
  size: 'LETTER', // 612 x 792 pt
  margins: { top: 56, bottom: 56, left: 54, right: 54 },
  bufferPages: true,
  info: {
    Title: 'Space-Ready — NASA Space Apps Challenge 2026 Project Submission',
    Author: 'Team DreamLabs',
    Subject: 'Continuous Ground-Based Preflight Astronaut Health Monitoring',
    Keywords: 'NASA Space Apps 2026, OCHMO-STD-100.1A, OCHMO-TB-031, Astronaut Health, Readiness Drift',
  },
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Register crisp TrueType fonts with full Unicode & mathematical glyph support
doc.registerFont('Sans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf');
doc.registerFont('SansBold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf');
doc.registerFont('Mono', '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf');
doc.registerFont('MonoBold', '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf');

const COLORS = {
  ink: '#111827',
  body: '#374151',
  muted: '#6B7280',
  accent: '#5B21B6',
  accentSoft: '#F5F3FF',
  accentBorder: '#DDD6FE',
  cyan: '#0E7490',
  border: '#E5E7EB',
  cardBg: '#F9FAFB',
  white: '#FFFFFF',
  darkBanner: '#0F172A',
};

const PAGE_WIDTH = 612;
const MARGIN_L = 54;
const CONTENT_W = PAGE_WIDTH - MARGIN_L * 2; // 504 pt
const PAGE_BOTTOM = 792 - 58; // 734 pt

function ensureSpace(neededHeight) {
  if (doc.y + neededHeight > PAGE_BOTTOM) {
    doc.addPage();
  }
}

function drawSectionHeading(numberStr, titleStr, minFollowSpace = 55) {
  ensureSpace(42 + minFollowSpace);
  doc.moveDown(0.35);
  const startY = doc.y;

  doc
    .font('MonoBold')
    .fontSize(8.2)
    .fillColor(COLORS.accent)
    .text(numberStr.toUpperCase(), MARGIN_L, startY, { characterSpacing: 1.1 });

  doc
    .font('SansBold')
    .fontSize(13.5)
    .fillColor(COLORS.ink)
    .text(titleStr, MARGIN_L, startY + 13);

  const lineY = doc.y + 4;
  doc
    .moveTo(MARGIN_L, lineY)
    .lineTo(MARGIN_L + CONTENT_W, lineY)
    .lineWidth(1)
    .strokeColor(COLORS.accentBorder)
    .stroke();

  doc.y = lineY + 10;
}

function drawSubheading(titleStr) {
  ensureSpace(34);
  doc.moveDown(0.2);
  doc
    .font('SansBold')
    .fontSize(10.2)
    .fillColor(COLORS.ink)
    .text(titleStr, MARGIN_L, doc.y);
  doc.moveDown(0.2);
}

function drawParagraph(text, options = {}) {
  const { fontSize = 9.3, color = COLORS.body, lineGap = 3.2, indent = 0, spaceAfter = 6 } = options;
  doc.font('Sans').fontSize(fontSize);
  const h = doc.heightOfString(text, { width: CONTENT_W - indent, lineGap });
  ensureSpace(Math.min(h, 45));
  doc
    .font('Sans')
    .fontSize(fontSize)
    .fillColor(color)
    .text(text, MARGIN_L + indent, doc.y, {
      width: CONTENT_W - indent,
      lineGap,
      align: 'left',
    });
  if (spaceAfter > 0) {
    doc.y += spaceAfter;
  }
}

function drawBullet(leadBold, text) {
  const bulletX = MARGIN_L + 6;
  const textX = MARGIN_L + 18;
  const textW = CONTENT_W - 18;

  doc.font('Sans').fontSize(9.1);
  const fullText = leadBold ? `${leadBold} ${text}` : text;
  const estH = doc.heightOfString(fullText, { width: textW, lineGap: 3 }) + 6;
  ensureSpace(estH);

  const y = doc.y;
  doc
    .circle(bulletX + 2, y + 5.2, 1.8)
    .fillColor(COLORS.accent)
    .fill();

  if (leadBold) {
    doc
      .font('SansBold')
      .fontSize(9.1)
      .fillColor(COLORS.ink)
      .text(leadBold + ' ', textX, y, {
        width: textW,
        lineGap: 3,
        continued: true,
      })
      .font('Sans')
      .fillColor(COLORS.body)
      .text(text, {
        width: textW,
        lineGap: 3,
      });
  } else {
    doc
      .font('Sans')
      .fontSize(9.1)
      .fillColor(COLORS.body)
      .text(text, textX, y, {
        width: textW,
        lineGap: 3,
      });
  }
  doc.y += 4.5;
}

function drawCalloutBox(title, bodyText, options = {}) {
  const { bg = COLORS.cardBg, border = COLORS.border, titleColor = COLORS.accent } = options;
  const padX = 14;
  const padY = 11;
  const innerW = CONTENT_W - padX * 2;

  doc.font('SansBold').fontSize(9.3);
  const titleH = title ? doc.heightOfString(title, { width: innerW }) + 4 : 0;
  doc.font('Sans').fontSize(8.9);
  const bodyH = doc.heightOfString(bodyText, { width: innerW, lineGap: 3 });
  const totalH = padY * 2 + titleH + bodyH;

  ensureSpace(totalH + 8);
  const boxY = doc.y;

  doc
    .roundedRect(MARGIN_L, boxY, CONTENT_W, totalH, 6)
    .fillAndStroke(bg, border);

  doc
    .rect(MARGIN_L, boxY + 6, 3, totalH - 12)
    .fillColor(titleColor)
    .fill();

  let curY = boxY + padY;
  if (title) {
    doc
      .font('SansBold')
      .fontSize(9.3)
      .fillColor(titleColor)
      .text(title, MARGIN_L + padX, curY, { width: innerW });
    curY = doc.y + 3;
  }

  doc
    .font('Sans')
    .fontSize(8.9)
    .fillColor(COLORS.ink)
    .text(bodyText, MARGIN_L + padX, curY, { width: innerW, lineGap: 3 });

  doc.y = boxY + totalH + 10;
}

// ============================================================================
// HEADER BANNER (Page 1)
// ============================================================================
const bannerH = 98;
doc
  .roundedRect(MARGIN_L, 48, CONTENT_W, bannerH, 8)
  .fillColor(COLORS.darkBanner)
  .fill();

doc
  .font('MonoBold')
  .fontSize(8)
  .fillColor('#C4B5FD')
  .text('NASA SPACE APPS CHALLENGE 2026  ·  PROJECT SUBMISSION BRIEF', MARGIN_L + 18, 63, {
    characterSpacing: 0.9,
  });

doc
  .font('SansBold')
  .fontSize(21)
  .fillColor(COLORS.white)
  .text('Space-Ready', MARGIN_L + 18, 79);

doc
  .font('Sans')
  .fontSize(10)
  .fillColor('#E2E8F0')
  .text('Continuous Ground-Based Preflight Astronaut Health & Readiness Drift Monitoring', MARGIN_L + 18, 107);

doc
  .font('Mono')
  .fontSize(8)
  .fillColor('#94A3B8')
  .text('Submitted by Team DreamLabs  ·  Preflight Human-System Risk Countermeasure Protocol', MARGIN_L + 18, 125);

doc.y = 48 + bannerH + 16;

// ============================================================================
// 1. PROJECT NAME & HIGH-LEVEL SUMMARY
// ============================================================================
drawSectionHeading('Section 01', 'Project Name & High-Level Summary');

drawParagraph(
  'Space-Ready is a web-based continuous ground health monitoring and readiness drift-detection tool I built for the NASA Space Apps Challenge 2026 (Team DreamLabs). Designed around the 2-to-4-year pre-mission astronaut training window, the application translates NASA Office of the Chief Health and Medical Officer (OCHMO) standards into a structured weekly checkup across six core spaceflight pillars: Sleep, Nutrition, Exercise, Stress, Social Connection, and Recovery.'
);

drawParagraph(
  'During Weeks 1–4, Space-Ready establishes and permanently locks an astronaut’s personalized baseline composite score. Every subsequent week, it evaluates lifestyle drift relative to that baseline, applies 3-week temporal smoothing to filter transient noise in sleep and stress, triggers tiered early-warning alerts before performance reaches NASA’s critical −20% decrement threshold, and aggregates 52-week cycles into Annual Rollups that verify L-60 flight readiness certification.'
);

// Quick Key Metrics Row
ensureSpace(60);
const kpiY = doc.y;
const kpiGap = 10;
const kpiW = (CONTENT_W - kpiGap * 3) / 4;
const kpis = [
  { val: '6 Pillars', lbl: '30 Calibrated Questions' },
  { val: 'Weeks 1–4', lbl: 'Locked Personal Baseline' },
  { val: '4 Tiers', lbl: 'Green → Red Drift Alerts' },
  { val: '≤ 5 pts', lbl: 'L-60 Annual Sign-Off Rule' },
];
kpis.forEach((k, idx) => {
  const x = MARGIN_L + idx * (kpiW + kpiGap);
  doc.roundedRect(x, kpiY, kpiW, 46, 5).fillAndStroke(COLORS.cardBg, COLORS.border);
  doc.font('SansBold').fontSize(11.5).fillColor(COLORS.accent).text(k.val, x + 8, kpiY + 9, { width: kpiW - 16, align: 'center' });
  doc.font('Sans').fontSize(7.5).fillColor(COLORS.muted).text(k.lbl, x + 6, kpiY + 27, { width: kpiW - 12, align: 'center' });
});
doc.y = kpiY + 56;

// ============================================================================
// 2. DETAILED PROJECT DESCRIPTION
// ============================================================================
drawSectionHeading('Section 02', 'Detailed Project Description');

drawSubheading('The Astronaut Health & Monitoring Problem It Solves');
drawParagraph(
  'Over a typical 2-to-4-year pre-mission assignment, NASA formally evaluates an astronaut’s clinical fitness only 3 to 4 times—annual physical exams, ASCR training start, and two preflight fitness checks at L-90/L-30 and L-9/L-6 before locking the L-60 preflight baseline. Between those discrete snapshots, over 99.7% of training days carry no standardized lifestyle readiness signal. Astronauts naturally prepare in the weeks leading up to scheduled physicals, masking silent lifestyle erosion—cortisol accumulation, circadian fragmentation, inadequate recovery, or missed strength loading.'
);
drawParagraph(
  'Today, this blind spot carries unprecedented operational risk. According to NASA’s Office of Inspector General (IG-22-007), NASA’s active astronaut corps has contracted to 44 astronauts—the smallest cadre in 20 years—shrinking the operational safety buffer from 50% down to 15%. With virtually zero crew redundancy across Artemis, ISS Commercial Crew, and Starliner schedules, a single medical event or late L-60 disqualification causes months of mission disruption. Moreover, as demonstrated by the January 2026 ISS emergency crew evacuation following Astronaut Mike Fincke’s neurological episode—the first in 25 years—in-mission medical telemetry is fundamentally flawed without continuous ground-based baselines. Without unbroken preflight data, flight surgeons cannot tell whether an in-orbit anomaly stems from microgravity or pre-existing ground decay.'
);

drawSubheading('How Space-Ready Works');
drawBullet(
  '1. Weekly 6-Pillar Checkup:',
  'Each week, I structured a focused 30-question assessment (5 questions per pillar) scored on a 0–4 risk gradient (0 = optimal baseline behavior; 4 = severe acute deficit). Raw points per pillar (0–20) are inverted onto an intuitive 0–100% readiness scale via Score = Math.round(((20 − Raw) / 20) × 100).'
);
drawBullet(
  '2. Temporal Smoothing & Weighted Composite Engine:',
  'Because sleep debt and psychological stress exhibit biological hysteresis, Space-Ready computes a 3-week trailing rolling average for Sleep and Stress before calculating the overall Composite Score. Sleep, Stress, Nutrition, Exercise, and Social Connection carry a 1.0× weight, while Recovery carries a 0.8× damping weight (total divisor = 5.8).'
);
drawBullet(
  '3. Locked Baseline & Drift Detection:',
  'During Weeks 1–4, the user calibrates their personal standard. At the completion of Week 4, Space-Ready permanently locks the baseline (the rounded average of Weeks 1–4). Every week thereafter calculates Drift = Baseline − Composite and classifies status into four tiers: Green / On Track (≤ 5 pts), Yellow / Early Warning (6–15 pts), Orange / Action Needed (16–20 pts), and Red / Significant Decrement (> 20 pts).'
);
drawBullet(
  '4. Automated Countermeasures, Annual Rollups & Exports:',
  'Whenever readiness enters Yellow, Orange, or Red, the alert engine automatically isolates the lowest-scoring pillar and prescribes a targeted NASA-aligned countermeasure. Multi-year 52-week rollups audit whether annual average drift stays within ≤ 5 points to earn L-60 Preflight Certification, and users can export complete JSON or CSV telemetry logs.'
);

drawSubheading('Benefits & Operational Impact');
drawBullet(
  'High-Cadence Visibility:',
  'Replaces 3–4 isolated clinical checkpoints with 104 to 208 weekly longitudinal data points across a 2–4 year window.'
);
drawBullet(
  'Proactive Early Intervention:',
  'Detects subtle downward drift at just 5 points (Yellow), giving trainers and flight surgeons months of runway to adjust sleep hygiene, nutrition, or training load before crossing the critical −20% mission pause line.'
);
drawBullet(
  'Clean In-Flight Diagnostic Baselines:',
  'Gives flight medical officers standardized pre-departure ground baselines so in-mission health monitoring can accurately distinguish microgravity effects from prior ground habits.'
);

drawSubheading('Technical Architecture & Tech Stack');
drawCalloutBox(
  'Full-Stack Web & Telemetry Implementation',
  '• Frontend UI & State: React 19, TypeScript, Vite 8, and Tailwind CSS v4 paired with Chakra Petch, Inter, and JetBrains Mono typography. Application state, weekly scoring history, baseline locking, and alerts are managed deterministically via Zustand with localStorage persistence.\n' +
    '• Data Visualization & UX: Recharts powers interactive longitudinal composite trends, drift thresholds, and pillar breakdowns; Lucide React and Motion handle aerospace UI iconography and transitions; pre-decoded WebP/JPG assets ensure instant rendering of the 3D Mission Readiness badge.\n' +
    '• Backend Runtime: Node.js + Express (server.ts) serves the application and exposes server-side endpoints using the @google/genai SDK (gemini-3.1-flash-lite-image) with dotenv environment management.',
  { bg: COLORS.cardBg, border: COLORS.border, titleColor: COLORS.accent }
);

// ============================================================================
// 3. SPACE AGENCY DATA USAGE
// ============================================================================
drawSectionHeading('Section 03', 'Space Agency Data Usage');

drawParagraph(
  'Rather than simply quoting NASA documents on a static page, I embedded NASA’s published standards, workforce statistics, and human-system risk frameworks directly into Space-Ready’s scoring thresholds, timeline logic, and countermeasure engine:'
);

drawBullet(
  'NASA OCHMO-STD-100.1A (Sept 2024 — Spaceflight Human-System Standard):',
  'I used OCHMO-STD-100.1A to map the real preflight clinical checkpoint cadence (12-month annual physicals plus L-90/L-30 and L-9/L-6 fitness certifications) into our Risk Analysis views, and to calibrate our 4-tier Drift Classification boundaries around NASA’s −20% readiness decrement risk threshold (Red Alert).'
);
drawBullet(
  'NASA OCHMO-TB-031 (Exercise Overview & L-60 Preflight Baseline Standards):',
  'I anchored our Weeks 1–4 locked baseline logic and the Exercise pillar’s aerobic (60+ min) and axial resistance-loading questions directly to OCHMO-TB-031 L-60 standards (VO2max, strength, and musculoskeletal defense). Our Annual Rollup sign-off rule ("Ready for L-60") mathematically enforces keeping annual drift within 5 points of that standard.'
);
drawBullet(
  'NASA Office of Inspector General Report IG-22-007 (Jan 2022):',
  'I integrated the OIG audit’s verified workforce metrics—an active corps of 44 astronauts (down ~70% from ~150 in 2000) and a 15% safety margin (down from 50%)—into the dashboard and operational risk analysis to contextualize why even small preflight fitness drops create Single-Point-of-Failure schedule risk.'
);
drawBullet(
  'NASA Human Research Program (HRP) & Frontiers in Physiology (Oct 2026):',
  'The HRP risk framework and the October 2026 Frontiers in Physiology study on Spaceflight Human Optimization directly shaped our 6-pillar architecture (Sleep, Nutrition, Exercise, Stress, Social Connection, and Recovery) and our requirement for continuous, ground-to-orbit longitudinal monitoring.'
);

// ============================================================================
// 4. AI DISCLOSURE
// ============================================================================
drawSectionHeading('Section 04', 'AI Disclosure (Generative AI Usage)');

drawParagraph(
  'In full transparency and alignment with NASA Space Apps Challenge guidelines, I utilized Generative AI tools during the creation of Space-Ready as follows:'
);

drawBullet(
  'Code & Engineering Assistance:',
  'I used Google Gemini-powered coding assistance within Google AI Studio to help scaffold modular React/TypeScript components, construct responsive Tailwind CSS v4 layouts, wire Recharts longitudinal charts, set up Zustand persistence, optimize image preloading, and configure the Node/Express server routes. I personally reviewed, tested, and verified all scoring formulas, 3-week rolling average calculations, baseline locking rules, and TypeScript builds.'
);
drawBullet(
  'Text & Technical Editing:',
  'I used Generative AI to help draft and refine UI microcopy, question descriptions, countermeasure tips, and formatting of this submission brief. All NASA statistics, checkpoint schedules, document citations, and operational facts were independently cross-checked against the primary NASA OIG, OCHMO, HRP, and Frontiers in Physiology sources.'
);
drawBullet(
  'Graphics & Visual Media:',
  'The Space-Ready hero spaceflight monitor background artwork and the 3D astronaut Mission Readiness medallion were generated using Google Gemini image generation models and optimized locally (resized/compressed to WebP and JPG) for fast performance. The server also integrates the @google/genai SDK (gemini-3.1-flash-lite-image) for optional dynamic astronaut portrait generation.'
);

// ============================================================================
// 5. REFERENCES / CITATIONS BOX
// ============================================================================
const citations = [
  {
    cat: 'NASA DATA & SCIENTIFIC SOURCES',
    items: [
      { label: '[1] NASA OIG IG-22-007 (Jan 2022) — Management of Its Astronaut Corps:', url: 'https://oig.nasa.gov/docs/IG-22-007.pdf' },
      { label: '[2] NASA OCHMO-STD-100.1A & OCHMO-TB-031 — Human-System & Exercise Standards:', url: 'https://www.nasa.gov/ochmo-standards/' },
      { label: '[3] NASA Human Health & Performance — Human-System Risks & Cadence:', url: 'https://www.nasa.gov/hhp/human-system-risks/' },
      { label: '[4] NASA Human Research Program (HRP) — Exploration Health Risk Reduction:', url: 'https://www.nasa.gov/hrp/' },
      { label: '[5] Frontiers in Physiology (Oct 2026) — Spaceflight Human Optimization:', url: 'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2026.1950155/full' },
    ],
  },
  {
    cat: 'LIBRARIES, FRAMEWORKS, ICONS & TOOLS',
    items: [
      { label: 'React 19 & TypeScript — UI runtime & static typing:', url: 'https://react.dev  |  https://www.typescriptlang.org' },
      { label: 'Vite 8 & Tailwind CSS v4 — Build pipeline & utility styling:', url: 'https://vite.dev  |  https://tailwindcss.com' },
      { label: 'Zustand & Recharts — State persistence & telemetry data visualization:', url: 'https://zustand-demo.pmnd.rs  |  https://recharts.org' },
      { label: 'Lucide React & Motion — Open-source vector icons & animations:', url: 'https://lucide.dev  |  https://motion.dev' },
      { label: 'Express, Node.js, Google GenAI SDK & PDFKit — Server & PDF generation:', url: 'https://expressjs.com  |  https://ai.google.dev  |  https://pdfkit.org' },
      { label: 'Google Fonts (Chakra Petch, Inter, JetBrains Mono) — Aerospace typography:', url: 'https://fonts.google.com' },
    ],
  },
];

// Measure References box height first so heading + box always stay together cleanly
let refBoxH = 22;
citations.forEach((group, gIdx) => {
  refBoxH += 18;
  group.items.forEach((item) => {
    doc.font('SansBold').fontSize(8.4);
    const h1 = doc.heightOfString(item.label, { width: CONTENT_W - 28 });
    doc.font('Mono').fontSize(7.8);
    const h2 = doc.heightOfString(item.url, { width: CONTENT_W - 36 });
    refBoxH += h1 + h2 + 6.5;
  });
  if (gIdx === 0) refBoxH += 6;
});

drawSectionHeading('Section 05', 'References & Citations Box', refBoxH + 8);

const refBoxY = doc.y;
doc.roundedRect(MARGIN_L, refBoxY, CONTENT_W, refBoxH, 7).fillAndStroke(COLORS.cardBg, COLORS.accentBorder);

let ry = refBoxY + 14;
citations.forEach((group, gIdx) => {
  doc
    .font('MonoBold')
    .fontSize(8.2)
    .fillColor(COLORS.accent)
    .text(group.cat, MARGIN_L + 14, ry, { width: CONTENT_W - 28, characterSpacing: 0.6 });
  ry = doc.y + 5;

  group.items.forEach((item) => {
    doc
      .font('SansBold')
      .fontSize(8.4)
      .fillColor(COLORS.ink)
      .text(item.label, MARGIN_L + 14, ry, { width: CONTENT_W - 28 });
    ry = doc.y + 1.5;

    const urlParts = item.url.split('  |  ');
    urlParts.forEach((u, uIdx) => {
      const isLast = uIdx === urlParts.length - 1;
      doc
        .font('Mono')
        .fontSize(7.8)
        .fillColor(COLORS.cyan)
        .text(u.trim(), uIdx === 0 ? MARGIN_L + 22 : undefined, uIdx === 0 ? ry : undefined, {
          width: CONTENT_W - 36,
          link: u.trim(),
          underline: true,
          continued: !isLast,
        });
      if (!isLast) {
        doc
          .font('Mono')
          .fontSize(7.8)
          .fillColor(COLORS.muted)
          .text('  |  ', {
            link: undefined,
            underline: false,
            continued: true,
          });
      }
    });
    ry = doc.y + 5;
  });

  if (gIdx === 0) ry += 5;
});

// ============================================================================
// PAGE HEADERS & FOOTERS ON ALL PAGES (disable bottom margin to prevent overflow)
// ============================================================================
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  const prevBottom = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;

  if (i > 0) {
    doc
      .font('Sans')
      .fontSize(7.6)
      .fillColor(COLORS.muted)
      .text('Space-Ready  ·  NASA Space Apps Challenge 2026 Project Submission', MARGIN_L, 28, {
        width: CONTENT_W,
        align: 'left',
        lineBreak: false,
      });
    doc
      .moveTo(MARGIN_L, 40)
      .lineTo(MARGIN_L + CONTENT_W, 40)
      .lineWidth(0.5)
      .strokeColor(COLORS.border)
      .stroke();
  }

  doc
    .moveTo(MARGIN_L, 752)
    .lineTo(MARGIN_L + CONTENT_W, 752)
    .lineWidth(0.5)
    .strokeColor(COLORS.border)
    .stroke();

  doc
    .font('Sans')
    .fontSize(7.8)
    .fillColor(COLORS.muted)
    .text('Team DreamLabs  ·  Space-Ready Preflight Monitoring Tool', MARGIN_L, 760, {
      width: CONTENT_W / 2,
      align: 'left',
      lineBreak: false,
    });

  doc
    .font('Sans')
    .fontSize(7.8)
    .fillColor(COLORS.muted)
    .text(`Page ${i + 1} of ${range.count}`, MARGIN_L + CONTENT_W / 2, 760, {
      width: CONTENT_W / 2,
      align: 'right',
      lineBreak: false,
    });

  doc.page.margins.bottom = prevBottom;
}

doc.end();

stream.on('finish', () => {
  console.log(`Generated PDF successfully at: ${outputPath} (${range.count} pages)`);
});
