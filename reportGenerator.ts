import fs from "node:fs/promises";
import path from "node:path";
export type ReportSeverity =
 | "LOW"
 | "MEDIUM"
 | "HIGH"
 | "CRITICAL";
export type ReportCategory =
 | "VALIDATION"
 | "CRASH"
 | "UI_STATE"
 | "NAVIGATION"
 | "DATA_HANDLING"
 | "ACCESSIBILITY"
 | "UNEXPECTED_BEHAVIOR"
 | "PERFORMANCE"
 | "NONE";
export interface ChaosReport {
 timestamp?: string;
 title: string;
 severity: ReportSeverity;
 category: ReportCategory;
 action: string;
 targetId?: string;
 value?: string;
 reason: string;
 observedBehavior: string;
 expectedBehavior: string;
 isEdgeCase: boolean;
  findingType?: "EXCEPTION" | "EDGE_CASE" | "NORMAL";
 confidence: number;
 evidence?: string[];
 url?: string;
 error?: string;
 recommendation?: string;
}
/*
* Every action performed by the AI.
*
* This is intentionally separate from ChaosReport.
*
* ActionHistory = everything the AI explored.
* ChaosReport   = only interesting/anomalous findings.
*/
export interface ExplorationAction {
 step: number;
 action: string;
 targetId?: string;
 value?: string;
 result: string;
}
/*
* ChaosObservation is deliberately kept flexible here.
*
* The actual type comes from chaosAnalyzer.ts.
* We only need a few fields for the report.
*/
export interface ExplorationObservation {
 category?: string;
 title?: string;
 severity?: string;
 isEdgeCase?: boolean;
 confidence?: number;
 reason?: string;
}
export interface ReportSummary {
 total: number;
 edgeCases: number;
 low: number;
 medium: number;
 high: number;
 critical: number;
}
function escapeHtml(value: string): string {
 return String(value)
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#039;");
}
function normalizeConfidence(value: unknown): number {
 const number = Number(value);
 if (Number.isNaN(number)) {
   return 0;
 }
 if (number < 0) {
   return 0;
 }
 if (number > 100) {
   return 100;
 }
 return Math.round(number);
}
function createSummary(
 reports: ChaosReport[]
): ReportSummary {
 return {
   total: reports.length,
   edgeCases: reports.filter(
     (report) => report.isEdgeCase
   ).length,
   low: reports.filter(
     (report) =>
       report.severity === "LOW"
   ).length,
   medium: reports.filter(
     (report) =>
       report.severity === "MEDIUM"
   ).length,
   high: reports.filter(
     (report) =>
       report.severity === "HIGH"
   ).length,
   critical: reports.filter(
     (report) =>
       report.severity === "CRITICAL"
   ).length,
 };
}
function normalizeReport(
 report: ChaosReport
): ChaosReport {
 return {
   timestamp:
     report.timestamp ||
     new Date().toISOString(),
   title:
     report.title ||
     "Unnamed AI Chaos Observation",
   severity:
     report.severity || "LOW",
   category:
     report.category || "NONE",
   action:
     report.action || "unknown",
   targetId:
     report.targetId || "",
   value:
     report.value || "",
   reason:
     report.reason ||
     "No reason provided",
   observedBehavior:
     report.observedBehavior ||
     "No observed behavior recorded.",
   expectedBehavior:
     report.expectedBehavior ||
     "Application should handle the scenario safely and predictably.",
    isEdgeCase:
     Boolean(report.isEdgeCase),
    findingType:
      report.findingType ||
      (report.error || report.category === "CRASH" || report.category === "UNEXPECTED_BEHAVIOR"
        ? "EXCEPTION"
        : report.isEdgeCase ? "EDGE_CASE" : "NORMAL"),
   confidence:
     normalizeConfidence(
       report.confidence
     ),
   evidence:
     report.evidence || [],
   url:
     report.url || "",
   error:
     report.error || "",
   recommendation:
     report.recommendation ||
     "Review the application behavior and add an automated regression test if required.",
 };
}
/* =========================================================
* JSON REPORT
* ========================================================= */
export async function saveJsonReport(
 reports: ChaosReport[],
 outputDirectory = "reports",
 actionHistory: ExplorationAction[] = [],
 explorationHistory: ExplorationObservation[] = []
): Promise<string> {
 const normalizedReports =
   reports.map(normalizeReport);
 await fs.mkdir(
   outputDirectory,
   {
     recursive: true,
   }
 );
 const outputPath = path.join(
   outputDirectory,
   "chaos-report.json"
 );
 const report = {
   generatedAt:
     new Date().toISOString(),
   summary:
     createSummary(
       normalizedReports
     ),
   exploration: {
     totalActions:
       actionHistory.length,
     totalObservations:
       explorationHistory.length,
     actions:
       actionHistory,
     observations:
       explorationHistory,
   },
   findings:
     normalizedReports,
 };
 await fs.writeFile(
   outputPath,
   JSON.stringify(
     report,
     null,
     2
   ),
   "utf-8"
 );
 return outputPath;
}
/* =========================================================
* MARKDOWN REPORT
* ========================================================= */
export async function saveMarkdownReport(
 reports: ChaosReport[],
 outputDirectory = "reports",
 actionHistory: ExplorationAction[] = [],
 explorationHistory: ExplorationObservation[] = []
): Promise<string> {
 const normalizedReports =
   reports.map(normalizeReport);
 await fs.mkdir(
   outputDirectory,
   {
     recursive: true,
   }
 );
 const summary =
   createSummary(
     normalizedReports
   );
 const outputPath = path.join(
   outputDirectory,
   "chaos-report.md"
 );
 let markdown = "";
 markdown +=
   "# 🤖 Autonomous AI Chaos QA Report\n\n";
 markdown +=
   `Generated: ${new Date().toISOString()}\n\n`;
 markdown += "---\n\n";
 /*
  * SUMMARY
  */
 markdown +=
   "## Executive Summary\n\n";
 markdown += "| Metric | Count |\n";
 markdown += "|---|---:|\n";
 markdown +=
   `| Total AI actions | ${actionHistory.length} |\n`;
 markdown +=
   `| Total observations | ${explorationHistory.length} |\n`;
 markdown +=
   `| Chaos findings | ${summary.total} |\n`;
 markdown +=
   `| Edge cases detected | ${summary.edgeCases} |\n`;
 markdown +=
   `| Low severity | ${summary.low} |\n`;
 markdown +=
   `| Medium severity | ${summary.medium} |\n`;
 markdown +=
   `| High severity | ${summary.high} |\n`;
 markdown +=
   `| Critical severity | ${summary.critical} |\n\n`;
 /*
  * EXPLORATION TIMELINE
  */
 markdown += "---\n\n";
 markdown +=
   "## 🔎 AI Exploration Timeline\n\n";
 if (
   actionHistory.length === 0
 ) {
   markdown +=
     "No AI actions were recorded.\n\n";
 } else {
   actionHistory.forEach(
     (action) => {
       markdown +=
         `### Step ${action.step}\n\n`;
       markdown +=
         `- **Action:** ${action.action}\n`;
       markdown +=
         `- **Target:** ${action.targetId || "-"}\n`;
       markdown +=
         `- **Value:** ${action.value || "-"}\n`;
       markdown +=
         `- **Result:** ${action.result}\n\n`;
     }
   );
 }
 /*
  * FINDINGS
  */
 markdown += "---\n\n";
 markdown +=
   "## 🚨 Chaos Findings\n\n";
 if (
   normalizedReports.length === 0
 ) {
   markdown +=
     "No significant chaos findings were detected.\n\n";
 } else {
   normalizedReports.forEach(
     (report, index) => {
       markdown +=
         `## ${index + 1}. ${report.title}\n\n`;
       markdown +=
         `**Severity:** ${report.severity}  \n`;
       markdown +=
         `**Category:** ${report.category}  \n`;
       markdown +=
         `**Edge Case:** ${
           report.isEdgeCase
             ? "YES"
             : "NO"
         }  \n`;
       markdown +=
         `**AI Confidence:** ${report.confidence}%  \n`;
       markdown +=
         `**Action:** ${report.action}  \n`;
       if (report.targetId) {
         markdown +=
           `**Target:** ${report.targetId}  \n`;
       }
       if (report.value) {
         markdown +=
           `**Value:** ${report.value}  \n`;
       }
       if (report.url) {
         markdown +=
           `**URL:** ${report.url}  \n`;
       }
       markdown += "\n";
       markdown +=
         "### Why AI considers this interesting\n\n";
       markdown +=
         `${report.reason}\n\n`;
       markdown +=
         "### Observed behavior\n\n";
       markdown +=
         `${report.observedBehavior}\n\n`;
       markdown +=
         "### Expected behavior\n\n";
       markdown +=
         `${report.expectedBehavior}\n\n`;
       if (report.error) {
         markdown +=
           "### Error\n\n";
         markdown +=
           "```text\n";
         markdown +=
           `${report.error}\n`;
         markdown +=
           "```\n\n";
       }
       if (
         report.evidence &&
         report.evidence.length > 0
       ) {
         markdown +=
           "### Evidence\n\n";
         report.evidence.forEach(
           (evidence) => {
             markdown +=
               `- ${evidence}\n`;
           }
         );
         markdown += "\n";
       }
       markdown +=
         "### Recommendation\n\n";
       markdown +=
         `${report.recommendation}\n\n`;
       markdown +=
         "---\n\n";
     }
   );
 }
 await fs.writeFile(
   outputPath,
   markdown,
   "utf-8"
 );
 return outputPath;
}
/* =========================================================
* HTML REPORT
* ========================================================= */
export async function saveHtmlReport(
 reports: ChaosReport[],
 outputDirectory = "reports",
 actionHistory: ExplorationAction[] = [],
 explorationHistory: ExplorationObservation[] = []
): Promise<string> {
 const normalizedReports =
   reports.map(normalizeReport);
 await fs.mkdir(
   outputDirectory,
   {
     recursive: true,
   }
 );
 /*
  * IMPORTANT:
  *
  * writeFile() overwrites chaos-report.html.
  * Therefore every run displays the latest run.
  */
 const outputPath = path.join(
   outputDirectory,
   "chaos-report.html"
 );
 const summary =
   createSummary(
     normalizedReports
   );
 /* =======================================================
  * EXPLORATION TIMELINE HTML
  * ======================================================= */
 const explorationHtml =
   actionHistory.length === 0
     ? `
<section class="panel">
<h2>🔎 AI Exploration Timeline</h2>
<div class="empty">
   No AI actions were recorded.
</div>
</section>
`
     : `
<section class="panel">
<div class="section-header">
<div>
<h2>🔎 AI Exploration Timeline</h2>
<p>
       Every action performed autonomously by the AI agent.
</p>
</div>
<div class="section-count">
     ${actionHistory.length} actions
</div>
</div>
<div class="timeline">
   ${actionHistory
     .map(
       (action) => {
         const failed =
           action.result
             .toLowerCase()
             .startsWith(
               "failed:"
             );
         return `
 <div class="timeline-item searchable" data-search="${escapeHtml(`${action.action} ${action.targetId || ""} ${action.value || ""} ${action.result}`)}">
<div class="step-number">
   ${action.step}
</div>
<div class="timeline-content">
<div class="timeline-top">
<strong>
       ${escapeHtml(
         action.action
       )}
</strong>
<span class="result ${
       failed
         ? "result-failed"
         : "result-success"
     }">
       ${
         failed
           ? "FAILED"
           : "EXECUTED"
       }
</span>
</div>
<div class="action-details">
<div>
<span class="label">
         Target
</span>
<code>
         ${escapeHtml(
           action.targetId ||
             "-"
         )}
</code>
</div>
<div>
<span class="label">
         Value
</span>
<code>
         ${escapeHtml(
           action.value ||
             "-"
         )}
</code>
</div>
</div>
<div class="action-result">
<span class="label">
       Result
</span>
     ${escapeHtml(
       action.result
     )}
</div>
</div>
</div>
`;
       }
     )
     .join("")}
</div>
</section>
`;
 /* =======================================================
  * FINDINGS HTML
  * ======================================================= */
 const findings =
   normalizedReports.length === 0
     ? `
<section class="panel">
<div class="section-header">
<div>
<h2>🚨 Chaos Findings</h2>
<p>
       AI-detected anomalies and edge cases.
</p>
</div>
<div class="section-count">
     0 findings
</div>
</div>
<div class="empty success-empty">
   ✅ No significant anomalies detected.
</div>
</section>
`
     : `
<section class="panel">
<div class="section-header">
<div>
<h2>🚨 Chaos Findings</h2>
<p>
       AI-detected anomalies and edge cases.
</p>
</div>
<div class="section-count">
     ${normalizedReports.length}
     ${
       normalizedReports.length === 1
         ? "finding"
         : "findings"
     }
</div>
</div>
 ${normalizedReports
   .map(
     (report, index) => {
        const evidence =
         report.evidence &&
         report.evidence.length > 0
           ? `
<h3>Evidence</h3>
<ul>
${report.evidence
 .map(
   (item) =>
     `<li>${escapeHtml(
       item
     )}</li>`
 )
 .join("")}
</ul>
`
           : "";
       return `
 <section class="finding searchable" data-search="${escapeHtml(`${report.title} ${report.category} ${report.findingType || ""} ${report.action} ${report.reason} ${report.observedBehavior}`)}">
<div class="finding-title">
<div>
<h2>
       ${index + 1}.
       ${escapeHtml(
         report.title
       )}
</h2>
</div>
<div class="badges">
<span class="badge severity-${report.severity.toLowerCase()}">
       ${escapeHtml(
         report.severity
       )}
</span>
 <span class="badge type-${(report.findingType || "NORMAL").toLowerCase()}">
        ${escapeHtml(report.findingType || "NORMAL")}
 </span>
 <span class="badge">
       ${escapeHtml(
         report.category
       )}
</span>
     ${
       report.isEdgeCase
         ? `
<span class="badge edge">
 EDGE CASE
</span>
`
         : ""
     }
</div>
</div>
<table>
<tr>
<th>AI Confidence</th>
<td>
       ${report.confidence}%
</td>
</tr>
<tr>
<th>Action</th>
<td>
       ${escapeHtml(
         report.action
       )}
</td>
</tr>
<tr>
<th>Target</th>
<td>
       ${escapeHtml(
         report.targetId ||
           "-"
       )}
</td>
</tr>
<tr>
<th>Value</th>
<td>
       ${escapeHtml(
         report.value ||
           "-"
       )}
</td>
</tr>
<tr>
<th>URL</th>
<td>
       ${escapeHtml(
         report.url ||
           "-"
       )}
</td>
</tr>
</table>
<h3>
   Why AI considers this interesting
</h3>
<p>
   ${escapeHtml(
     report.reason
   )}
</p>
<h3>
   Observed behavior
</h3>
<p>
   ${escapeHtml(
     report.observedBehavior
   )}
</p>
<h3>
   Expected behavior
</h3>
<p>
   ${escapeHtml(
     report.expectedBehavior
   )}
</p>
 ${
   report.error
     ? `
<h3>Error</h3>
<pre>
${escapeHtml(
 report.error
)}
</pre>
`
     : ""
 }
 ${evidence}
<h3>
   Recommendation
</h3>
<p>
   ${escapeHtml(
     report.recommendation ||
       ""
   )}
</p>
</section>
`;
     }
   )
   .join("\n")}
</section>
`;
 /* =======================================================
  * FINAL HTML
  * ======================================================= */
 const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta
 name="viewport"
 content="width=device-width, initial-scale=1.0"
>
 <title>Orchard AI Exploration — QA Findings</title>
<style>
* {
 box-sizing: border-box;
}
 body {
 font-family:
   Arial,
   Helvetica,
   sans-serif;
  background:
    #f5f7fb;
  color:
    #1f2937;
  transition: background .2s,color .2s;
 margin:
   0;
 padding:
   0;
}
 header {
  background:
    linear-gradient(135deg,#111827,#243b63);
 color:
   white;
 padding:
   35px 20px;
 text-align:
   center;
}
 header h1 {
 margin:
   0 0 10px 0;
  font-size:
    34px;
  letter-spacing: -0.02em;
}
header p {
 margin:
   0;
 color:
   #d1d5db;
}
.container {
 max-width:
   1150px;
 margin:
   30px auto;
 padding:
   0 20px;
}
.summary {
 display:
   grid;
 grid-template-columns:
   repeat(
     auto-fit,
     minmax(150px, 1fr)
   );
 gap:
   15px;
 margin-bottom:
   30px;
}
 .card {
 background:
   white;
 padding:
   20px;
 border-radius:
   10px;
  box-shadow:
    0 8px 24px
   rgba(
     0,
     0,
     0,
     0.08
   );
  text-align:
    center;
  border: 1px solid #e5eaf2;
}
.card .number {
 font-size:
   30px;
 font-weight:
   bold;
 margin-top:
   8px;
}
 .panel {
 background:
   white;
 padding:
   25px;
 border-radius:
   12px;
  box-shadow:
    0 8px 24px
   rgba(
     0,
     0,
     0,
     0.08
   );
 margin-bottom:
   30px;
}
.section-header {
 display:
   flex;
 justify-content:
   space-between;
 align-items:
   center;
 gap:
   20px;
 margin-bottom:
   20px;
}
.section-header h2 {
 margin:
   0 0 5px 0;
}
.section-header p {
 margin:
   0;
 color:
   #6b7280;
}
.section-count {
 background:
   #e5e7eb;
 padding:
   8px 14px;
 border-radius:
   20px;
 font-weight:
   bold;
 white-space:
   nowrap;
}
.timeline {
 position:
   relative;
 margin-top:
   20px;
}
.timeline-item {
 display:
   flex;
 gap:
   18px;
 position:
   relative;
 padding-bottom:
   20px;
}
.step-number {
 min-width:
   42px;
 height:
   42px;
 border-radius:
   50%;
 background:
   #111827;
 color:
   white;
 display:
   flex;
 align-items:
   center;
 justify-content:
   center;
 font-weight:
   bold;
}
.timeline-content {
 flex:
   1;
 border:
   1px solid #e5e7eb;
 border-radius:
   8px;
 padding:
   15px;
}
.timeline-top {
 display:
   flex;
 justify-content:
   space-between;
 align-items:
   center;
 gap:
   15px;
 margin-bottom:
   12px;
}
.result {
 padding:
   5px 10px;
 border-radius:
   15px;
 font-size:
   11px;
 font-weight:
   bold;
}
.result-success {
 background:
   #dcfce7;
 color:
   #166534;
}
.result-failed {
 background:
   #fecaca;
 color:
   #991b1b;
}
.action-details {
 display:
   grid;
 grid-template-columns:
   repeat(
     auto-fit,
     minmax(
       200px,
       1fr
     )
   );
 gap:
   12px;
 margin-bottom:
   12px;
}
.label {
 display:
   block;
 font-size:
   11px;
 color:
   #6b7280;
 text-transform:
   uppercase;
 font-weight:
   bold;
 margin-bottom:
   4px;
}
code {
 background:
   #f3f4f6;
 padding:
   4px 7px;
 border-radius:
   4px;
 word-break:
   break-all;
}
.action-result {
 color:
   #374151;
}
 .finding {
  border:
    1px solid #dfe5ef;
 margin-bottom:
   25px;
 padding:
   25px;
  border-radius:
    14px;
  border-left: 5px solid #64748b;
  background: #fff;
}
.finding:last-child {
 margin-bottom:
   0;
}
.finding-title {
 display:
   flex;
 justify-content:
   space-between;
 align-items:
   flex-start;
 gap:
   20px;
}
.finding-title h2 {
 margin-top:
   0;
}
.badges {
 margin-bottom:
   20px;
}
.badge {
 display:
   inline-block;
 padding:
   6px 12px;
 border-radius:
   20px;
 background:
   #e5e7eb;
 margin-right:
   8px;
 font-size:
   12px;
 font-weight:
   bold;
}
.severity-low {
 background:
   #dcfce7;
}
.severity-medium {
 background:
   #fef3c7;
}
.severity-high {
 background:
   #fed7aa;
}
.severity-critical {
 background:
   #fecaca;
}
 .edge {
  background:
    #e0e7ff;
  color: #3730a3;
}
table {
 width:
   100%;
 border-collapse:
   collapse;
 margin:
   15px 0 25px 0;
}
th,
td {
 padding:
   10px;
 border-bottom:
   1px solid #e5e7eb;
 text-align:
   left;
 vertical-align:
   top;
}
th {
 width:
   180px;
}
pre {
 background:
   #111827;
 color:
   #f9fafb;
 padding:
   15px;
 border-radius:
   6px;
 overflow:
   auto;
}
.empty {
 padding:
   25px;
 text-align:
   center;
 background:
   #f9fafb;
 border-radius:
   8px;
 color:
   #6b7280;
}
.success-empty {
 color:
   #166534;
 background:
   #f0fdf4;
}
 .finding h3 {
  color: #334155;
  font-size: 13px;
  letter-spacing: .04em;
  text-transform: uppercase;
  margin-top: 22px;
 }
 body.dark { background:#0b1020; color:#e5e7eb; }
 body.dark .card, body.dark .panel, body.dark .finding { background:#111827; border-color:#26334d; }
 body.dark .section-header p, body.dark .muted, body.dark footer { color:#9ca3af; }
 body.dark th, body.dark td, body.dark .timeline-content { border-color:#26334d; }
 body.dark code, body.dark .empty { background:#1f2937; color:#e5e7eb; }
 body.dark .number { color:#ffffff; }
 body.dark .card > div:first-child { color:#cbd5e1; }
 body.dark .section-count { background:#26334d; color:#f8fafc; }
 body.dark .label, body.dark th { color:#cbd5e1; }
 body.dark .action-result, body.dark td { color:#f8fafc; }
 body.dark .finding h3 { color:#cbd5e1; }
 body.dark .result-success { background:#14532d; color:#bbf7d0; }
 body.dark .result-failed { background:#7f1d1d; color:#fecaca; }
 body.dark .badge { background:#334155; color:#f8fafc; }
 body.dark .badge.edge, body.dark .type-edge_case { background:#312e81; color:#e0e7ff; }
 body.dark .type-exception { background:#7f1d1d; color:#fecaca; }
 body.dark .success-empty { background:#123524; color:#bbf7d0; }
 body.dark .finding p { color:#e5e7eb; }
 .toolbar { display:flex; gap:10px; justify-content:flex-end; margin:18px 0; }
 .toolbar button { border:1px solid #64748b; background:transparent; color:inherit; border-radius:999px; padding:8px 13px; cursor:pointer; }
 .finding.is-hidden { display:none; }
 .type-exception { background:#fee2e2; color:#991b1b; }
 .type-edge_case { background:#e0e7ff; color:#3730a3; }
 .report-search { display:flex; gap:12px; align-items:center; margin:0 0 22px; }
 .report-search input { flex:1; min-width:0; border:1px solid #64748b; border-radius:12px; padding:12px 15px; font:inherit; background:#fff; color:#111827; }
 body.dark .report-search input { background:#111827; color:#f8fafc; border-color:#475569; }
 .search-count { color:#64748b; font-size:13px; white-space:nowrap; }
 body.dark .search-count { color:#94a3b8; }
 .finding p {
  line-height: 1.65;
 }
 .number {
    color: #0f172a;
 }
 footer {
 text-align:
   center;
 color:
   #6b7280;
 padding:
   30px;
}
@media (
 max-width: 700px
) {
 .section-header,
 .finding-title {
   flex-direction:
     column;
   align-items:
     flex-start;
 }
}
</style>
</head>
<body>
<header>
 <h1>
    🤖 AI User Behavior Simulation and Edge Case Report
</h1>
<p>
    Autonomous Playwright exploration, behavior analysis, and edge-case intelligence
</p>
</header>
<div class="container">
 <div class="report-search">
   <input id="reportSearch" type="search" placeholder="Search actions, targets, findings, or evidence…" aria-label="Search report">
   <span id="searchCount" class="search-count"></span>
 </div>
 <div class="toolbar">
   <button id="themeToggle" type="button">☾ Dark mode</button>
   <button id="edgeFilter" type="button">Show edge cases</button>
   <button id="exceptionFilter" type="button">Show exceptions</button>
 </div>
<!-- SUMMARY -->
<div class="summary">
<div class="card">
<div>
       AI Actions
</div>
<div class="number">
       ${actionHistory.length}
</div>
</div>
<div class="card">
<div>
       Observations
</div>
<div class="number">
       ${explorationHistory.length}
</div>
</div>
<div class="card">
<div>
       Chaos Findings
</div>
<div class="number">
       ${summary.total}
</div>
</div>
<div class="card">
<div>
       Edge Cases
</div>
<div class="number">
       ${summary.edgeCases}
</div>
</div>
<div class="card">
<div>
       High
</div>
<div class="number">
       ${summary.high}
</div>
</div>
<div class="card">
<div>
       Critical
</div>
<div class="number">
       ${summary.critical}
</div>
</div>
</div>
<!-- COMPLETE EXPLORATION -->
 ${explorationHtml}
<!-- ACTUAL FINDINGS -->
 ${findings}
</div>
<footer>
 Generated by
<strong>
   Autonomous AI Chaos QA
</strong>
</footer>
 <script>
 (() => {
   const findings = [...document.querySelectorAll('.finding')];
   const searchable = [...document.querySelectorAll('.searchable')];
   const searchInput = document.getElementById('reportSearch');
   const searchCount = document.getElementById('searchCount');
   const search = () => {
     const query = (searchInput?.value || '').trim().toLowerCase();
     let visible = 0;
     searchable.forEach(el => {
       const match = !query || (el.dataset.search || '').toLowerCase().includes(query);
       el.classList.toggle('is-hidden', !match);
       if (match) visible++;
     });
     if (searchCount) searchCount.textContent = query ? visible + ' matching results' : searchable.length + ' searchable records';
   };
   searchInput?.addEventListener('input', search);
   search();
   let filter = 'all';
   const apply = () => findings.forEach(el => {
     const type = el.querySelector('.type-exception') ? 'EXCEPTION' :
       el.querySelector('.type-edge_case') ? 'EDGE_CASE' : 'NORMAL';
     el.classList.toggle('is-hidden', filter !== 'all' && type !== filter);
   });
   document.getElementById('themeToggle')?.addEventListener('click', e => {
     document.body.classList.toggle('dark');
     e.currentTarget.textContent = document.body.classList.contains('dark') ? '☀ Light mode' : '☾ Dark mode';
   });
   document.getElementById('edgeFilter')?.addEventListener('click', e => {
     filter = filter === 'EDGE_CASE' ? 'all' : 'EDGE_CASE'; apply();
     e.currentTarget.textContent = filter === 'all' ? 'Show edge cases' : 'Show all findings';
   });
   document.getElementById('exceptionFilter')?.addEventListener('click', e => {
     filter = filter === 'EXCEPTION' ? 'all' : 'EXCEPTION'; apply();
     e.currentTarget.textContent = filter === 'all' ? 'Show exceptions' : 'Show all findings';
   });
 })();
 </script>
</body>
</html>
`;
 /*
  * IMPORTANT:
  *
  * This overwrites the previous HTML report.
  */
 await fs.writeFile(
   outputPath,
   html,
   "utf-8"
 );
 return outputPath;
}
/* =========================================================
* GENERATE ALL REPORT FORMATS
* ========================================================= */
export async function generateChaosReports(
 reports: ChaosReport[],
 outputDirectory = "reports",
 actionHistory: ExplorationAction[] = [],
 explorationHistory: ExplorationObservation[] = []
): Promise<{
 json: string;
 markdown: string;
 html: string;
}> {
 const json =
   await saveJsonReport(
     reports,
     outputDirectory,
     actionHistory,
     explorationHistory
   );
 const markdown =
   await saveMarkdownReport(
     reports,
     outputDirectory,
     actionHistory,
     explorationHistory
   );
 const html =
   await saveHtmlReport(
     reports,
     outputDirectory,
     actionHistory,
     explorationHistory
   );
 return {
   json,
   markdown,
   html,
 };
}