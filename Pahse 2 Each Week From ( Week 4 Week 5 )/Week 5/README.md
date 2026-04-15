Ethical Hacking & Vulnerability Assessment (Week 5)
📌 Overview

This project demonstrates practical ethical hacking techniques performed on a test web application. The assessment focuses on identifying and mitigating common web vulnerabilities such as:

SQL Injection (SQLi)
Cross-Site Request Forgery (CSRF)
Sensitive Data Exposure (.git leak)
Weak Rate Limiting (DoS risk)

The goal is to simulate real-world penetration testing and improve application security through proper controls.

🎯 Objectives
Perform reconnaissance using penetration testing tools
Identify and analyze security vulnerabilities
Exploit vulnerabilities in a controlled environment
Implement security fixes and best practices
🛠️ Tools & Technologies
Kali Linux
Nmap
curl
Gobuster
SQLMap
Burp Suite
Node.js (Express)
🔍 Reconnaissance
Findings
Port 8443 (HTTPS) marked as filtered via Nmap
Manual verification using curl confirmed service availability
Indicates presence of basic firewall or filtering mechanisms
📂 Directory Enumeration
Results
Automated scanning blocked (rate limiting & filtering)
Manual discovery revealed:
🚨 Critical
.git/HEAD
.git/config
.git/index

➡ Full source code exposure

🔥 High
package.json
package-lock.json

➡ Reveals dependencies and potential vulnerabilities

🚨 Vulnerabilities Identified
1. Exposed .git Directory (Critical)

Impact:

Source code leakage
Exposure of secrets and internal logic

Fix:

Removed .git from production
Blocked hidden files via server configuration
2. SQL Injection (SQLi)

Testing:

Manual payloads (' OR 1=1 --)
Automated scanning using SQLMap

Result:

No SQL injection vulnerability found
Input validation and protections are in place
✅ SQLi Prevention (Implemented)
const query = "SELECT * FROM users WHERE id = ?";
db.execute(query, [userInput]);

✔ Uses prepared statements to prevent injection

3. Cross-Site Request Forgery (CSRF)

Before Fix:

Requests could be replayed
No validation mechanism
Application was vulnerable
🛡️ CSRF Protection Implementation
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(csrf({ cookie: true }));
Results
Requests without token → Blocked
Valid token required → Accepted

⚠️ Note: Token replay issue still exists (needs improvement)

4. Weak Rate Limiting (DoS Risk)

Observation:

High request volume caused slowdown/crash
🚀 Rate Limiting Fix
const rateLimit = require('express-rate-limit');

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
📊 Security Summary
Vulnerability	Severity	Status
.git Exposure	🚨 Critical	✅ Fixed
Package Info Exposure	🔥 High	✅ Fixed
SQL Injection	❌ Not Found	✔ Protected
CSRF	⚠️ Partial	⚠️ Needs Improvement
Rate Limiting	⚠️ Weak	⚠️ Needs Tuning
🔐 Key Learnings
Security controls can block automated attacks but still expose critical misconfigurations
Sensitive files like .git must never be exposed in production
CSRF protection must include token lifecycle management
Rate limiting is essential to prevent abuse and DoS attacks
📌 Recommendations
Remove sensitive files from production environments
Implement strict access controls
Use prepared statements for all database queries
Improve CSRF token handling (one-time tokens)
Strengthen rate limiting policies
Deploy a Web Application Firewall (WAF)
📁 Project Structure
/project-root
│── app.js
│── routes/
│── middleware/
│── package.json
│── README.md
📎 Deliverables
✔ Ethical hacking report
✔ Identified vulnerabilities
✔ Implemented security fixes (SQLi & CSRF)
✔ Updated project with secure configurations


⚠️ Disclaimer

This project is for educational purposes only. All testing was conducted in a controlled environment. Do not attempt unauthorized testing on live systems.

👨‍💻 Author

Geletaw Abebe
Cybersecurity | SOC Analyst | Security Engineering | GRC