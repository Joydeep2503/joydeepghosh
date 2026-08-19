import fs from "fs";
import path from "path";

const report = JSON.parse(fs.readFileSync("reports/chaos-report.json","utf8"));

const esc = s => String(s ?? "").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

// Enhanced findings with better explanations
const enhanceFindings = (findings) => {
  return findings.map(f => ({
    ...f,
    layCopy: generateLayExplanation(f),
    howItHappened: generateHowItHappened(f),
    whyItMatters: generateWhyItMatters(f),
    fixItSimple: generateSimpleFix(f)
  }));
};

function generateLayExplanation(finding) {
  const explanations = {
    "PAYMENT_VALIDATION": {
      "Invalid payment data accepted": 
        `The app's payment system is broken. When someone enters an obviously fake card number (like "123"), the app should reject it and show an error message. Instead, the app accepts it and pretends the payment was successful. This is dangerous because it means the payment validation code isn't working.`,
      "Payment action produced a booking confirmation":
        `The booking confirmation page appears right after clicking the pay button, even though the payment hasn't been properly validated. It's like the app is jumping ahead without checking if the payment actually went through.`
    },
    "PAYMENT_FLOW": {
      "Payment action produced a booking confirmation":
        `When you click the "Pay" button, the app immediately shows a success message, but it's not verifying that the payment actually worked. This is like buying something online and getting a "thank you" email before they actually charge your card.`
    },
    "NAVIGATION": {
      "Unexpected navigation state change":
        `The app is moving to a different page when it shouldn't be. This can confuse users because they might lose their progress or end up in an unexpected place in the app.`
    }
  };
  
  return explanations[finding.category]?.[finding.title] || "A potential issue was detected in the app's behavior.";
}

function generateHowItHappened(finding) {
  const scenarios = {
    "Invalid payment data accepted": `
      <strong>Step by step:</strong>
      <ol>
        <li>User enters card number: <code>123</code> (obviously too short)</li>
        <li>User enters expiry date: <code>01/20</code></li>
        <li>User enters CVV: <code>1</code> (too short)</li>
        <li>User clicks the "Pay" button</li>
        <li>❌ <strong>BUG:</strong> App shows "Payment accepted" instead of rejecting it</li>
        <li>User sees booking confirmation (which shouldn't happen)</li>
      </ol>
      <p><strong>What should happen:</strong> App should show "Invalid card number" and stay on the payment page.</p>
    `,
    "Payment action produced a booking confirmation": `
      <strong>Step by step:</strong>
      <ol>
        <li>User fills in payment details</li>
        <li>User clicks "Pay" button</li>
        <li>❌ <strong>BUG:</strong> App immediately shows confirmation page</li>
        <li>App never actually validates or processes the payment</li>
        <li>User thinks payment succeeded, but it didn't</li>
      </ol>
      <p><strong>What should happen:</strong> App should validate payment, wait for confirmation from payment processor, then show confirmation page.</p>
    `,
    "Unexpected navigation state change": `
      <strong>Step by step:</strong>
      <ol>
        <li>User is on a page doing something</li>
        <li>An action triggers a page change</li>
        <li>❌ <strong>BUG:</strong> User unexpectedly navigates away</li>
        <li>User loses their progress or context</li>
      </ol>
      <p><strong>What should happen:</strong> Page should only change when user intentionally clicks navigation buttons.</p>
    `
  };
  
  return scenarios[finding.title] || "<p>The app behaved in an unexpected way during testing.</p>";
}

function generateWhyItMatters(finding) {
  const importance = {
    "CRITICAL": {
      "Invalid payment data accepted": `
        <p>💰 <strong>Financial Risk:</strong> This is a critical security issue. Real customers could use fake card numbers to book stays without paying. The business could lose money.</p>
        <p>🔒 <strong>Trust Issue:</strong> If customers discover this, they lose trust in the payment system and the entire business.</p>
      `,
      "Payment action produced a booking confirmation": `
        <p>💸 <strong>Money at Risk:</strong> Bookings could be confirmed without actual payment. The business won't know which payments are real.</p>
        <p>😡 <strong>Customer Anger:</strong> Customers might think they paid when they didn't, causing confusion and disputes.</p>
      `
    },
    "MEDIUM": {
      "Payment action produced a booking confirmation": `
        <p>⚠️ <strong>Data Quality:</strong> The system can't trust its own booking data because payment status is unreliable.</p>
        <p>📊 <strong>Business Metrics:</strong> Can't accurately track revenue or customer payments.</p>
      `
    },
    "LOW": {
      "Unexpected navigation state change": `
        <p>😕 <strong>User Experience:</strong> Users get confused and frustrated when pages change unexpectedly.</p>
        <p>📉 <strong>Conversion:</strong> Users might give up on booking if the flow feels broken.</p>
      `
    }
  };
  
  return importance[finding.severity]?.[finding.title] || "<p>This issue could impact the app's reliability and user experience.</p>";
}

function generateSimpleFix(finding) {
  const fixes = {
    "Invalid payment data accepted": `
      <strong>For developers:</strong> Add validation that checks:
      <ul>
        <li>Card number must be 13-19 digits</li>
        <li>Expiry date must be in MM/YY format and in the future</li>
        <li>CVV must be 3-4 digits</li>
        <li>Only proceed to confirmation if all validations pass</li>
      </ul>
      <p><strong>In plain English:</strong> Before showing the success message, the app needs to actually check that the card number looks real and hasn't expired.</p>
    `,
    "Payment action produced a booking confirmation": `
      <strong>For developers:</strong> The payment function should:
      <ul>
        <li>Validate all payment data</li>
        <li>Send payment to payment processor (like Stripe or Razorpay)</li>
        <li>Wait for response from payment processor</li>
        <li>Only show confirmation if payment processor says "SUCCESS"</li>
        <li>Show error if payment processor says "FAILED"</li>
      </ul>
      <p><strong>In plain English:</strong> The app should ask the payment company "Did you process this payment?" before saying "yes, you booked it!"</p>
    `,
    "Unexpected navigation state change": `
      <strong>For developers:</strong>
      <ul>
        <li>Only navigate when user explicitly clicks navigation buttons</li>
        <li>Don't automatically redirect after actions</li>
        <li>Let user confirm before leaving a partially-filled form</li>
      </ul>
      <p><strong>In plain English:</strong> Don't automatically move the user to a different page. Let them control where they go.</p>
    `
  };
  
  return fixes[finding.title] || "<p>This issue needs further investigation to determine the best fix.</p>";
}

const enhancedFindings = enhanceFindings(report.findings);

const cards = enhancedFindings.map((f,i)=>\`
<article class="finding" data-severity="\${f.severity.toLowerCase()}">
  <div class="finding-header">
    <div class="finding-title">
      <span class="finding-number">#\${i+1}</span>
      <h2>\${esc(f.title)}</h2>
    </div>
    <div class="finding-badges">
      <span class="badge severity-\${f.severity.toLowerCase()}">\${esc(f.severity)}</span>
      <span class="badge category">\${esc(f.category)}</span>
      <span class="confidence">🎯 \${Math.round((f.confidence||0)*100)}% confidence</span>
    </div>
  </div>

  <!-- SIMPLE EXPLANATION FOR EVERYONE -->
  <section class="section">
    <h3>📖 What This Means (In Plain English)</h3>
    <div class="plain-text">
      \${f.layCopy}
    </div>
  </section>

  <!-- HOW IT HAPPENED -->
  <section class="section">
    <h3>🔍 How We Found This Bug</h3>
    <div class="how-it-happened">
      \${f.howItHappened}
    </div>
  </section>

  <!-- WHY IT MATTERS -->
  <section class="section">
    <h3>⚡ Why This Matters</h3>
    <div class="why-it-matters">
      \${f.whyItMatters}
    </div>
  </section>

  <!-- TECHNICAL DETAILS (COLLAPSED) -->
  <section class="section technical-details">
    <button class="details-toggle" onclick="this.parentElement.querySelector('.details-content').classList.toggle('hidden')">
      <span class="toggle-icon">▶</span> Technical Details (For Developers)
    </button>
    <div class="details-content hidden">
      <h3>Observed Behavior</h3>
      <p>\${esc(f.observedBehavior)}</p>
      
      <h3>Expected Behavior</h3>
      <p>\${esc(f.expectedBehavior)}</p>
      
      <h3>Evidence</h3>
      <ul class="evidence-list">
        \${(f.evidence||[]).map(x=>\`<li>\${esc(x)}</li>\`).join("")}
      </ul>
    </div>
  </section>

  <!-- HOW TO FIX IT -->
  <section class="section fix-section">
    <h3>🔧 How To Fix It</h3>
    <div class="fix-details">
      \${f.fixItSimple}
    </div>
  </section>

  <div class="severity-bar" style="background: var(--color-\${f.severity.toLowerCase()})"></div>
</article>
\`).join("");

const html = \`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Autonomous AI Chaos QA Report</title>
  <style>
    :root {
      --bg-light: #ffffff;
      --bg-light-alt: #f7f7f7;
      --bg-light-section: #fafafa;
      --text-light: #222222;
      --text-light-muted: #666666;
      --border-light: #eeeeee;
      
      --bg-dark: #1a1a1a;
      --bg-dark-alt: #242424;
      --bg-dark-section: #2d2d2d;
      --text-dark: #e0e0e0;
      --text-dark-muted: #999999;
      --border-dark: #404040;
      
      --primary: #e11d48;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      
      --color-critical: #fee2e2;
      --color-high: #ffedd5;
      --color-medium: #fef3c7;
      --color-low: #e0f2fe;
    }
    
    html.dark-mode {
      --bg-light: var(--bg-dark);
      --bg-light-alt: var(--bg-dark-alt);
      --bg-light-section: var(--bg-dark-section);
      --text-light: var(--text-dark);
      --text-light-muted: var(--text-dark-muted);
      --border-light: var(--border-dark);
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: var(--bg-light-alt);
      color: var(--text-light);
      line-height: 1.6;
      transition: background 0.3s ease, color 0.3s ease;
    }
    
    /* DARK MODE TOGGLE */
    .dark-mode-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 100;
      transition: transform 0.2s ease;
    }
    
    .dark-mode-toggle:hover {
      transform: scale(1.1);
    }
    
    .dark-mode-toggle:active {
      transform: scale(0.95);
    }
    
    /* HEADER */
    header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: white;
      padding: 50px 40px;
      text-align: center;
      border-bottom: 3px solid var(--primary);
      margin-bottom: 40px;
    }
    
    html.dark-mode header {
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    }
    
    header h1 {
      font-size: 48px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    header p {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    
    header .timestamp {
      font-size: 14px;
      opacity: 0.7;
      font-family: 'Courier New', monospace;
    }
    
    /* CONTAINER */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    /* STATS SECTION */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: var(--bg-light);
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
    
    .stat-number {
      font-size: 42px;
      font-weight: 800;
      color: var(--primary);
      display: block;
      margin-bottom: 8px;
    }
    
    .stat-label {
      font-size: 14px;
      color: var(--text-light-muted);
      font-weight: 500;
    }
    
    /* SEVERITY STATS */
    .severity-stats {
      background: var(--bg-light);
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 40px;
    }
    
    .severity-stats h3 {
      margin-bottom: 20px;
      font-size: 18px;
    }
    
    .severity-row {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-light);
    }
    
    .severity-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .severity-label {
      font-weight: 600;
      min-width: 100px;
      padding: 6px 12px;
      border-radius: 6px;
      color: white;
      font-size: 13px;
    }
    
    .severity-label.critical { background: #dc2626; }
    .severity-label.high { background: #f59e0b; }
    .severity-label.medium { background: #eab308; }
    .severity-label.low { background: #3b82f6; }
    
    .severity-bar {
      flex: 1;
      height: 8px;
      border-radius: 4px;
      margin: 0 16px;
      opacity: 0.6;
    }
    
    .severity-count {
      font-weight: 600;
      min-width: 40px;
      text-align: right;
    }
    
    /* FINDINGS */
    .findings {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    
    .finding {
      background: var(--bg-light);
      border: 2px solid var(--border-light);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      border-left: 6px solid var(--primary);
    }
    
    .finding:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      border-left-width: 8px;
    }
    
    .finding-header {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--border-light);
    }
    
    .finding-title {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .finding-number {
      background: var(--primary);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      flex-shrink: 0;
    }
    
    .finding-title h2 {
      font-size: 28px;
      color: var(--text-light);
      margin: 0;
    }
    
    .finding-badges {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }
    
    .badge.severity-critical { background: #fee2e2; color: #991b1b; }
    .badge.severity-high { background: #ffedd5; color: #9a3412; }
    .badge.severity-medium { background: #fef3c7; color: #92400e; }
    .badge.severity-low { background: #e0f2fe; color: #075985; }
    
    .badge.category {
      background: var(--bg-light-section);
      color: var(--text-light-muted);
    }
    
    .confidence {
      background: var(--primary);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    
    /* SECTIONS */
    .section {
      margin-bottom: 28px;
    }
    
    .section h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      color: var(--text-light);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .plain-text {
      background: var(--bg-light-section);
      border-left: 4px solid var(--primary);
      padding: 16px 20px;
      border-radius: 8px;
      line-height: 1.8;
      font-size: 16px;
    }
    
    .how-it-happened {
      background: var(--bg-light-section);
      padding: 16px 20px;
      border-radius: 8px;
    }
    
    .how-it-happened ol {
      margin: 16px 0;
      padding-left: 24px;
    }
    
    .how-it-happened li {
      margin-bottom: 12px;
      line-height: 1.8;
    }
    
    .how-it-happened code {
      background: var(--bg-light);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
    
    .how-it-happened p {
      margin-top: 16px;
      font-style: italic;
      color: var(--text-light-muted);
    }
    
    .why-it-matters {
      background: var(--bg-light-section);
      padding: 16px 20px;
      border-radius: 8px;
    }
    
    .why-it-matters p {
      margin-bottom: 12px;
      line-height: 1.8;
    }
    
    /* TECHNICAL DETAILS (COLLAPSIBLE) */
    .technical-details {
      border-top: 2px solid var(--border-light);
      padding-top: 24px;
      margin-top: 24px;
    }
    
    .details-toggle {
      background: var(--primary);
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
      width: 100%;
      text-align: left;
    }
    
    .details-toggle:hover {
      background: #c41e3a;
    }
    
    .toggle-icon {
      display: inline-block;
      transition: transform 0.3s ease;
    }
    
    .details-toggle:active .toggle-icon {
      transform: rotate(90deg);
    }
    
    .details-content {
      margin-top: 16px;
      padding: 16px 20px;
      background: var(--bg-light-section);
      border-radius: 8px;
    }
    
    .details-content.hidden {
      display: none;
    }
    
    .details-content h3 {
      font-size: 14px;
      margin-top: 12px;
      margin-bottom: 8px;
      color: var(--text-light-muted);
    }
    
    .details-content h3:first-child {
      margin-top: 0;
    }
    
    .evidence-list {
      margin: 8px 0 0 20px;
      font-size: 14px;
    }
    
    .evidence-list li {
      margin-bottom: 6px;
      color: var(--text-light-muted);
    }
    
    /* FIX SECTION */
    .fix-section {
      background: linear-gradient(135deg, var(--bg-light-section) 0%, var(--bg-light) 100%);
      padding: 24px;
      border-radius: 12px;
      border: 2px dashed var(--success);
    }
    
    .fix-details {
      line-height: 1.8;
    }
    
    .fix-details ul {
      margin: 12px 0 0 20px;
    }
    
    .fix-details li {
      margin-bottom: 8px;
      color: var(--text-light);
    }
    
    .fix-details p {
      margin: 12px 0;
      color: var(--text-light-muted);
    }
    
    .severity-bar {
      height: 4px;
      border-radius: 2px;
      margin-top: 20px;
      opacity: 0.4;
    }
    
    /* FOOTER */
    footer {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-light-muted);
      border-top: 1px solid var(--border-light);
      margin-top: 60px;
      font-size: 14px;
    }
    
    /* RESPONSIVE */
    @media (max-width: 768px) {
      header h1 { font-size: 32px; }
      .finding { padding: 20px; }
      .finding-title h2 { font-size: 20px; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 480px) {
      header h1 { font-size: 24px; }
      .finding { padding: 16px; }
      .finding-title { flex-direction: column; }
      .stats-grid { grid-template-columns: 1fr; }
      .dark-mode-toggle { width: 45px; height: 45px; font-size: 18px; }
    }
  </style>
</head>
<body>

<button class="dark-mode-toggle" onclick="toggleDarkMode()" title="Toggle dark mode">🌙</button>

<header>
  <h1>🤖 Autonomous AI Chaos QA Report</h1>
  <p>AI-driven exploration and chaos discovery analysis</p>
  <p class="timestamp">\${esc(report.generatedAt)}</p>
</header>

<div class="container">
  <!-- STATS -->
  <div class="stats-grid">
    <div class="stat-card">
      <span class="stat-number">\${report.summary.actions}</span>
      <span class="stat-label">AI Actions & Probes</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">\${report.summary.observations}</span>
      <span class="stat-label">Observations</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">\${report.summary.chaosFindings}</span>
      <span class="stat-label">Chaos Findings</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">\${report.summary.edgeCases}</span>
      <span class="stat-label">Critical Issues</span>
    </div>
  </div>
  
  <!-- SEVERITY BREAKDOWN -->
  <div class="severity-stats">
    <h3>📊 Issues by Severity</h3>
    \${(() => {
      const bySeverity = {};
      report.findings.forEach(f => {
        bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
      });
      return ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
        .filter(sev => bySeverity[sev])
        .map(sev => \`
          <div class="severity-row">
            <span class="severity-label \${sev.toLowerCase()}">\${sev}</span>
            <div class="severity-bar" style="background: \${
              sev === 'CRITICAL' ? '#dc2626' :
              sev === 'HIGH' ? '#f59e0b' :
              sev === 'MEDIUM' ? '#eab308' :
              '#3b82f6'
            }"></div>
            <span class="severity-count">\${bySeverity[sev]} issue\${bySeverity[sev] > 1 ? 's' : ''}</span>
          </div>
        \`).join('');
    })()}
  </div>
  
  <!-- FINDINGS -->
  <div class="findings">
    \${cards || "<p>No issues found.</p>"}
  </div>
</div>

<footer>
  <p><strong>Report generated:</strong> \${esc(new Date(report.generatedAt).toLocaleString())}</p>
  <p>App tested: <code>\${esc(report.appUrl)}</code></p>
  <p>🤖 Autonomous AI Chaos QA • Detecting edge cases and security issues automatically</p>
</footer>

<script>
// Dark mode toggle
function toggleDarkMode() {
  const html = document.documentElement;
  html.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', html.classList.contains('dark-mode'));
  updateToggleButton();
}

function updateToggleButton() {
  const isDark = document.documentElement.classList.contains('dark-mode');
  document.querySelector('.dark-mode-toggle').textContent = isDark ? '☀️' : '🌙';
}

// Load saved preference
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark-mode');
  }
  updateToggleButton();
});
</script>

</body>
</html>\`;

fs.writeFileSync("reports/chaos-report.html",html);
console.log("✅ Enhanced report generated: reports/chaos-report.html");
console.log("🌙 Dark mode toggle added (click button in top-right)");
console.log("📖 Detailed explanations for non-technical users included");
console.log("🔧 How-to-fix section with plain English explanations added");
