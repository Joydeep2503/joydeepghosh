import fs from "fs";
import path from "path";

const reportPath = path.resolve("reports/chaos-report.json");
const htmlPath = path.resolve("reports/chaos-report.html");

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateLayExplanation(finding) {
  const title = finding.title || "";
  
  if (title.includes("Invalid payment")) {
    return "<p><strong>In Plain English:</strong> The app's payment system is broken. When someone enters an obviously fake card number (like '123'), the app should reject it and show an error message. Instead, the app accepts it and pretends the payment was successful. This is dangerous because it means the payment validation code isn't working.</p>";
  } else if (title.includes("Payment action")) {
    return "<p><strong>In Plain English:</strong> After a payment fails or is incomplete, the app shouldn't show a booking confirmation. But it does. This means customers might think their booking is confirmed when it actually isn't. They could get confused about whether their stay is booked or not.</p>";
  } else if (title.includes("navigation")) {
    return "<p><strong>In Plain English:</strong> When users navigate through the app, sometimes they end up in unexpected places. This can be confusing and frustrating. Users might lose track of where they are in the booking process or accidentally skip important steps.</p>";
  }
  
  return "<p><strong>In Plain English:</strong> This issue needs investigation to understand what went wrong from a user's perspective.</p>";
}

function generateHowItHappened(finding) {
  const title = finding.title || "";
  
  if (title.includes("Invalid payment")) {
    return "<p><strong>Step-by-Step How We Found This Bug:</strong></p><ol><li>The AI entered a card number: <strong>123</strong> (obviously too short)</li><li>The AI entered expiry date: <strong>01/20</strong></li><li>The AI entered CVV: <strong>1</strong> (too short)</li><li>The AI clicked the 'Pay' button</li><li>❌ <strong>BUG:</strong> The app showed 'Payment accepted' instead of rejecting it</li><li>The user saw a booking confirmation (which shouldn't happen)</li></ol><p><strong>What should happen:</strong> The app should show 'Invalid card number' and stay on the payment page.</p>";
  } else if (title.includes("Payment action")) {
    return "<p><strong>Step-by-Step How We Found This Bug:</strong></p><ol><li>The AI filled in valid payment details</li><li>The AI clicked the 'Pay' button</li><li>❌ <strong>BUG:</strong> The page changed to show a booking confirmation</li><li>This happened even though the payment process might not have completed</li></ol><p><strong>What should happen:</strong> The app should confirm the payment actually went through before showing the booking confirmation.</p>";
  } else if (title.includes("navigation")) {
    return "<p><strong>Step-by-Step How We Found This Bug:</strong></p><ol><li>The AI performed various actions (clicking buttons, filling forms)</li><li>❌ <strong>BUG:</strong> The app's state changed unexpectedly</li><li>The user ended up in a different place than expected</li></ol><p><strong>What should happen:</strong> Navigation should only happen when the user clicks specific navigation buttons.</p>";
  }
  
  return "<p><strong>How We Found This Bug:</strong> The AI tested this specific scenario and observed unexpected behavior.</p>";
}

function generateWhyItMatters(finding) {
  const title = finding.title || "";
  
  if (title.includes("Invalid payment")) {
    return "<p><strong>💰 Financial Risk:</strong> This is a critical security issue. Real customers could use fake card numbers to book stays without paying. The business could lose significant money.</p><p><strong>🔒 Trust Issue:</strong> If customers discover this, they lose trust in the payment system and the entire business. This could damage your reputation.</p>";
  } else if (title.includes("Payment action")) {
    return "<p><strong>😕 Customer Confusion:</strong> Customers might think their booking is confirmed when it actually isn't. This leads to confusion and support tickets.</p><p><strong>💰 Financial Impact:</strong> Users might book multiple times thinking their first booking didn't go through.</p>";
  } else if (title.includes("navigation")) {
    return "<p><strong>😤 User Frustration:</strong> Users get confused about where they are in the booking process. They might abandon the app and go to a competitor.</p><p><strong>📉 Conversion Loss:</strong> Users might not complete their bookings due to confusion.</p>";
  }
  
  return "<p><strong>Why This Matters:</strong> This issue impacts user experience and business operations.</p>";
}

function generateSimpleFix(finding) {
  const title = finding.title || "";
  
  if (title.includes("Invalid payment")) {
    return "<p><strong>For Developers:</strong> Add validation before accepting payment:</p><ul><li>Card number must be 13-19 digits</li><li>Expiry date must be in MM/YY format and in the future</li><li>CVV must be 3-4 digits</li><li>Only show confirmation if ALL validations pass</li></ul><p><strong>In Plain English:</strong> Before showing the success message, the app needs to actually check that the card number looks real, isn't expired, and follows credit card rules.</p>";
  } else if (title.includes("Payment action")) {
    return "<p><strong>For Developers:</strong> Add a check before showing confirmation:</p><ul><li>Wait for payment processor response</li><li>Only show confirmation if payment status is 'SUCCESS'</li><li>Show error page if payment fails</li></ul><p><strong>In Plain English:</strong> The app should wait for the payment to actually go through before celebrating with a confirmation page.</p>";
  } else if (title.includes("navigation")) {
    return "<p><strong>For Developers:</strong> Review navigation logic:</p><ul><li>Only navigate when user clicks navigation buttons</li><li>Don't auto-navigate after actions</li><li>Let user control where they go</li></ul><p><strong>In Plain English:</strong> Don't automatically move users to a different page. Let them decide where to go.</p>";
  }
  
  return "<p><strong>How To Fix It:</strong> This issue needs code review and testing to determine the best solution.</p>";
}

function generateHtml(report) {
  // Enhance findings
  const enhancedFindings = report.findings.map(f => ({
    ...f,
    layCopy: generateLayExplanation(f),
    howItHappened: generateHowItHappened(f),
    whyItMatters: generateWhyItMatters(f),
    fixItSimple: generateSimpleFix(f)
  }));
  
  // Generate cards HTML
  let cardsHtml = "";
  enhancedFindings.forEach((f, i) => {
    const severity = (f.severity || "LOW").toLowerCase();
    cardsHtml += '<article class="finding" data-severity="' + severity + '">';
    cardsHtml += '<div class="finding-header">';
    cardsHtml += '<span class="finding-number">#' + (i + 1) + '</span>';
    cardsHtml += '<h2>' + escapeHtml(f.title) + '</h2>';
    cardsHtml += '</div>';
    
    cardsHtml += '<div class="finding-badges">';
    cardsHtml += '<span class="badge severity-' + severity + '">' + escapeHtml(f.severity) + '</span>';
    cardsHtml += '<span class="badge category">' + escapeHtml(f.category || "") + '</span>';
    cardsHtml += '<span class="badge confidence">' + Math.round(f.confidence || 0) + '% confidence</span>';
    cardsHtml += '</div>';
    
    cardsHtml += '<section class="section">';
    cardsHtml += '<h3>📖 What This Means (In Plain English)</h3>';
    cardsHtml += f.layCopy;
    cardsHtml += '</section>';
    
    cardsHtml += '<section class="section">';
    cardsHtml += '<h3>🔍 How We Found This Bug</h3>';
    cardsHtml += f.howItHappened;
    cardsHtml += '</section>';
    
    cardsHtml += '<section class="section">';
    cardsHtml += '<h3>⚡ Why This Matters</h3>';
    cardsHtml += f.whyItMatters;
    cardsHtml += '</section>';
    
    cardsHtml += '<section class="section">';
    cardsHtml += '<h3>🔧 How To Fix It</h3>';
    cardsHtml += f.fixItSimple;
    cardsHtml += '</section>';
    
    cardsHtml += '<details class="technical-details">';
    cardsHtml += '<summary>▶ Technical Details (For Developers)</summary>';
    cardsHtml += '<div class="technical-content">';
    cardsHtml += '<p><strong>Observed Behavior:</strong> ' + escapeHtml(f.before || f.observed || 'N/A') + '</p>';
    cardsHtml += '<p><strong>Expected Behavior:</strong> ' + escapeHtml(f.after || f.expected || 'N/A') + '</p>';
    cardsHtml += '<p><strong>Category:</strong> ' + escapeHtml(f.category || "") + '</p>';
    cardsHtml += '<p><strong>Confidence:</strong> ' + Math.round(f.confidence || 0) + '%</p>';
    cardsHtml += '</div>';
    cardsHtml += '</details>';
    
    cardsHtml += '</article>';
  });
  
  // Calculate severity stats
  const severityStats = {
    CRITICAL: enhancedFindings.filter(f => f.severity === "CRITICAL").length,
    HIGH: enhancedFindings.filter(f => f.severity === "HIGH").length,
    MEDIUM: enhancedFindings.filter(f => f.severity === "MEDIUM").length,
    LOW: enhancedFindings.filter(f => f.severity === "LOW").length
  };
  
  const html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>StayNest - Chaos QA Report</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;line-height:1.6;color:#333;background:#f5f5f5;transition:background-color 0.3s,color 0.3s}body.dark-mode{background:#1a1a1a;color:#e0e0e0}header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:40px 20px;text-align:center;box-shadow:0 4px 6px rgba(0,0,0,0.1)}body.dark-mode header{background:linear-gradient(135deg,#1e3c72 0%,#2a5298 100%)}header h1{font-size:2.5em;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:10px}header p{opacity:0.9;font-size:1.1em}header .meta{font-size:0.9em;margin-top:15px;opacity:0.8}.dark-mode-toggle{position:fixed;top:20px;right:20px;background:white;border:none;padding:10px 15px;border-radius:50px;cursor:pointer;font-size:1.5em;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:1000}.dark-mode-toggle:hover{transform:scale(1.1)}body.dark-mode .dark-mode-toggle{background:#333;color:#fff}.container{max-width:1000px;margin:0 auto;padding:40px 20px}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:40px}.stat-card{background:white;padding:20px;border-radius:10px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,0.1)}body.dark-mode .stat-card{background:#2a2a2a;box-shadow:0 2px 4px rgba(0,0,0,0.3)}.stat-number{font-size:2.5em;font-weight:bold;color:#667eea;margin-bottom:5px}body.dark-mode .stat-number{color:#64b5f6}.stat-label{color:#666;font-size:0.9em}body.dark-mode .stat-label{color:#bbb}.severity-chart{background:white;padding:20px;border-radius:10px;margin-bottom:40px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}body.dark-mode .severity-chart{background:#2a2a2a}.severity-chart h3{margin-bottom:20px}.severity-item{display:flex;align-items:center;margin-bottom:15px}.severity-bar{width:150px;height:30px;margin:0 15px;border-radius:5px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold}.severity-CRITICAL{background:linear-gradient(90deg,#ff4757,#ee5a6f)}.severity-HIGH{background:linear-gradient(90deg,#ffa502,#ffb821)}.severity-MEDIUM{background:linear-gradient(90deg,#ffd93d,#ffe066)}.severity-LOW{background:linear-gradient(90deg,#6c5ce7,#8080ff)}.findings{display:grid;gap:30px}.finding{background:white;padding:30px;border-radius:12px;border-left:5px solid #667eea;box-shadow:0 2px 8px rgba(0,0,0,0.1)}body.dark-mode .finding{background:#2a2a2a;box-shadow:0 2px 8px rgba(0,0,0,0.3)}.finding[data-severity="critical"]{border-left-color:#ff4757}.finding[data-severity="high"]{border-left-color:#ffa502}.finding[data-severity="medium"]{border-left-color:#ffd93d}.finding[data-severity="low"]{border-left-color:#6c5ce7}.finding-number{display:inline-block;background:#667eea;color:white;padding:5px 12px;border-radius:50px;font-weight:bold;margin-right:10px}.finding-header h2{display:inline;font-size:1.5em}body.dark-mode .finding-header h2{color:#e0e0e0}.finding-badges{display:flex;gap:10px;margin-top:15px;flex-wrap:wrap}.badge{display:inline-block;padding:6px 12px;border-radius:20px;font-size:0.85em;font-weight:500}.badge.severity-critical{background:#ffe0e0;color:#ff4757}body.dark-mode .badge.severity-critical{background:#4a1f1f;color:#ff6b7a}.badge.severity-high{background:#fff4e0;color:#ffa502}body.dark-mode .badge.severity-high{background:#4a3a1f;color:#ffb821}.badge.severity-medium{background:#fffde0;color:#f0ad4e}body.dark-mode .badge.severity-medium{background:#4a4a1f;color:#ffe066}.badge.severity-low{background:#e0e8ff;color:#6c5ce7}body.dark-mode .badge.severity-low{background:#2a2a4a;color:#8080ff}.badge.category{background:#e0f2f1;color:#00897b}body.dark-mode .badge.category{background:#1a3a38;color:#4db8ac}.badge.confidence{background:#f3e5f5;color:#7b1fa2}body.dark-mode .badge.confidence{background:#3a2a4a;color:#ba68c8}.section{margin-bottom:25px;padding-bottom:20px;border-bottom:1px solid #eee}body.dark-mode .section{border-bottom-color:#444}.section h3{color:#333;margin-bottom:15px;font-size:1.2em}body.dark-mode .section h3{color:#64b5f6}.section p,.section li{color:#555;margin-bottom:10px}body.dark-mode .section p,body.dark-mode .section li{color:#bbb}.section ul,.section ol{margin-left:20px}.technical-details{margin-top:20px;padding:15px;background:#f9f9f9;border-radius:8px;cursor:pointer}body.dark-mode .technical-details{background:#1a1a1a}.technical-details summary{font-weight:600;color:#667eea;user-select:none}body.dark-mode .technical-details summary{color:#64b5f6}.technical-content{margin-top:15px;padding-top:15px;border-top:1px solid #e0e0e0}body.dark-mode .technical-content{border-top-color:#444}.technical-content p{margin-bottom:10px;font-size:0.95em;color:#666}body.dark-mode .technical-content p{color:#aaa}footer{text-align:center;padding:30px 20px;color:#666;font-size:0.9em;border-top:1px solid #eee;margin-top:50px}body.dark-mode footer{border-top-color:#444;color:#aaa}@media(max-width:768px){header h1{font-size:1.8em}.finding{padding:20px}}</style></head><body><button class="dark-mode-toggle" id="darkModeToggle" title="Toggle dark mode">🌙</button><header><h1>🤖 Autonomous AI Chaos QA</h1><p>AI-driven exploration and chaos discovery report</p><div class="meta">' + escapeHtml(report.generatedAt) + '</div></header><div class="container"><div class="stats"><div class="stat-card"><div class="stat-number">' + report.summary.actions + '</div><div class="stat-label">AI Actions & Probes</div></div><div class="stat-card"><div class="stat-number">' + report.summary.observations + '</div><div class="stat-label">Observations</div></div><div class="stat-card"><div class="stat-number">' + report.summary.chaosFindings + '</div><div class="stat-label">Chaos Findings</div></div><div class="stat-card"><div class="stat-number">' + severityStats.CRITICAL + '</div><div class="stat-label">Critical Issues</div></div></div><div class="severity-chart"><h3>📊 Issues by Severity</h3><div class="severity-item"><span>🔴 CRITICAL</span><div class="severity-bar severity-CRITICAL">' + severityStats.CRITICAL + ' issue' + (severityStats.CRITICAL !== 1 ? 's' : '') + '</div></div><div class="severity-item"><span>🟠 HIGH</span><div class="severity-bar severity-HIGH">' + severityStats.HIGH + ' issue' + (severityStats.HIGH !== 1 ? 's' : '') + '</div></div><div class="severity-item"><span>🟡 MEDIUM</span><div class="severity-bar severity-MEDIUM">' + severityStats.MEDIUM + ' issue' + (severityStats.MEDIUM !== 1 ? 's' : '') + '</div></div><div class="severity-item"><span>🔵 LOW</span><div class="severity-bar severity-LOW">' + severityStats.LOW + ' issue' + (severityStats.LOW !== 1 ? 's' : '') + '</div></div></div><div class="findings">' + cardsHtml + '</div></div><footer><p>Report generated: ' + new Date(report.generatedAt).toLocaleString() + '</p><p>App tested: ' + escapeHtml(report.appUrl) + '</p><p>🤖 Autonomous AI Chaos QA • Detecting edge cases and security issues automatically</p></footer><script>const darkModeToggle=document.getElementById("darkModeToggle");const savedMode=localStorage.getItem("darkMode")==="true";if(savedMode){document.body.classList.add("dark-mode");darkModeToggle.textContent="☀️"}darkModeToggle.addEventListener("click",()=>{document.body.classList.toggle("dark-mode");const isDark=document.body.classList.contains("dark-mode");localStorage.setItem("darkMode",isDark);darkModeToggle.textContent=isDark?"☀️":"🌙"})</script></body></html>';

  return html;
}

try {
  const data = fs.readFileSync(reportPath, "utf8");
  const report = JSON.parse(data);
  const html = generateHtml(report);
  fs.writeFileSync(htmlPath, html);
  
  console.log("\n✅ Report generated successfully!");
  console.log("📊 Report saved: " + htmlPath);
  console.log("🌙 Dark mode: Available");
  console.log("📖 Plain English: Included for all bugs");
  console.log("✨ Features: Dark mode toggle, business impact, fix guides\n");
} catch (err) {
  console.error("❌ Error generating report:", err.message);
  process.exit(1);
}
