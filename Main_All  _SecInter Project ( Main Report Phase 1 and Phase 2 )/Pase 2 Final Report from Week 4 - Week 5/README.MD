Security Internship Phase 2
Secure Web Application – Security Assessment & Hardening
👨‍💻 Author

Geletaw Abebe Tsegaye
Cybersecurity Intern – DevelopersHub Corporation

📌 Project Overview

This project demonstrates a secure Node.js web application built and tested using real-world cybersecurity practices.

It covers:

Secure development (SDLC)
Web application hardening
Ethical hacking & penetration testing
Security auditing
OWASP Top 10 compliance

The goal is to simulate how modern applications are built, attacked, and secured.

🎯 Objectives
Build a secure web application using Node.js
Implement layered security controls
Identify vulnerabilities using ethical hacking techniques
Perform security audits using industry tools
Align the system with OWASP Top 10 standards
🛠️ Technologies & Tools
🔹 Development Stack
Node.js
Express.js
MongoDB
HTTPS (TLS)
dotenv
🔹 Security Libraries
Helmet.js
csurf (CSRF protection)
express-rate-limit
cors
xss-clean
express-mongo-sanitize
🔹 Penetration Testing Tools
OWASP ZAP
Nikto
SQLMap
Burp Suite
Kali Linux tools
curl
🔹 Environment
Windows 11
WSL2 (Kali Linux)
🔐 Security Features Implemented
✅ Authentication & Access Control
JWT-based authentication
API Key protection
Role-based access (basic)
✅ API Security
Rate limiting (anti-brute force & DoS)
CORS restriction
Input validation & sanitization
✅ Web Security Hardening
Helmet security headers
Content Security Policy (CSP)
HTTPS + HSTS enforcement
✅ Threat Detection
Logging & monitoring
Fail2Ban integration (brute-force protection)
🧪 Ethical Hacking & Findings (Week 5)
🔍 Vulnerabilities Identified
Vulnerability	Severity	Status
.git Exposure	🚨 Critical	✅ Fixed
Package Info Exposure	🚨 High	✅ Fixed
CSRF	⚠️ Medium	✅ Fixed (Improved)
Rate Limiting Weakness	⚠️ Medium	✅ Improved
SQL Injection	❌ Not Found	✔ Protected
⚠️ Key Finding
Exposed .git directory allowed access to full source code
Demonstrates a real-world critical misconfiguration
🛡️ Security Audit Results (Week 6)
🔎 OWASP ZAP
No critical vulnerabilities
No SQL Injection
No XSS detected
🔎 Nikto
Minor header issues (fixed)
No major server vulnerabilities
🔎 Lynis
System hardening validated
No critical OS-level issues
📊 OWASP Top 10 Compliance
Risk	Status
Injection	✔ Mitigated
Broken Authentication	✔ Mitigated
Sensitive Data Exposure	✔ Mitigated
Broken Access Control	✔ Mitigated
Security Misconfiguration	✔ Reduced
XSS	✔ Mitigated
Logging & Monitoring	✔ Implemented
🚀 Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/your-username/your-repo.git
cd your-repo
2️⃣ Install Dependencies
npm install
3️⃣ Configure Environment

Create .env file:

PORT=8443
JWT_SECRET=your_secret_key
API_KEY=your_api_key
4️⃣ Run Application
npm start
5️⃣ Access Application
https://localhost:8443
🧪 Testing Scenarios
✅ Normal user access
✅ JWT login authentication
❌ Invalid API key → 401 Unauthorized
❌ Rate limit exceeded → 429 Too Many Requests
❌ CSRF attack → blocked
🔒 Security Best Practices Applied
Principle of Least Privilege
Defense in Depth
Secure Headers & Encryption
Input Validation & Sanitization
Monitoring & Logging
📸 Screenshots (Add in Repo)
OWASP ZAP scan results
Nikto scan output
Lynis audit summary
HTTPS browser lock
API request (success/failure)
Security headers (curl -I)
📌 Key Achievements

✔ Built secure Node.js application
✔ Performed real penetration testing
✔ Fixed critical vulnerabilities
✔ Implemented layered security controls
✔ Achieved OWASP Top 10 compliance

📚 Learning Outcomes
Practical penetration testing
Web security implementation
Security auditing tools usage
SOC-level monitoring concepts
Real-world vulnerability remediation
🏁 Conclusion

This project successfully demonstrates a secure, hardened web application following industry cybersecurity standards.

It reflects real-world skills in:

Security Engineering
Ethical Hacking
SOC Monitoring
Risk Mitigation
📬 Contact

Geletaw Abebe Tsegaye
Cybersecurity Enthusiast | SOC Analyst | Security Engineer