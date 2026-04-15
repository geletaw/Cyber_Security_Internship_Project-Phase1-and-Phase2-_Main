Advanced Threat Detection & Web Security (Week 4)
📌 Project Overview

This project implements advanced security controls for a Node.js API as part of a Cybersecurity Internship (Weeks 4–6). The goal is to enhance API security, detect malicious activities, and enforce modern web security standards.

🎯 Objectives
Detect suspicious activities in real-time
Protect APIs against brute-force and unauthorized access
Implement strong security headers and HTTPS enforcement
Apply layered security using authentication and monitoring tools
🛡️ Security Features Implemented
1️⃣ Intrusion Detection & Monitoring
Integrated logging system (security.log) to capture suspicious activities
Configured Fail2Ban to:
Monitor failed login attempts
Automatically block malicious IPs after multiple failures
2️⃣ API Security Hardening
🔹 Rate Limiting
Implemented using express-rate-limit
Global limiter: 100 requests/minute
Login limiter: 20 requests/minute
Prevents brute-force and DoS attacks
🔹 CORS Protection

Restricted access to trusted origin:

http://localhost:8081
Allowed only specific HTTP methods and headers
🔹 API Key Security
Protected sensitive endpoints using x-api-key
Unauthorized requests are blocked with 401 Unauthorized
3️⃣ Authentication & Authorization
🔐 JWT Authentication

Users authenticate via:

POST /api/auth/signin
Server generates a JSON Web Token (JWT)

Protected routes require:

Authorization: Bearer <token>
4️⃣ Security Headers & CSP
🧱 Helmet.js
Enabled secure HTTP headers:
XSS Protection
Clickjacking protection
MIME sniffing prevention
📜 Content Security Policy (CSP)
Restricts script execution to trusted sources
Prevents Cross-Site Scripting (XSS)
🔒 HSTS (HTTP Strict Transport Security)
Forces HTTPS communication
Prevents downgrade attacks
5️⃣ HTTPS Implementation

Secure server running on:

https://localhost:8443
Configured using SSL certificates (key.pem, cert.pem)
📂 Project Structure
SecIntern-phase1-task1/
│── app/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── utils/
│
│── server.js
│── .env
│── key.pem
│── cert.pem
│── security.log
│── package.json
🚀 How to Run the Project
1️⃣ Install Dependencies
npm install
2️⃣ Configure Environment Variables

Create a .env file:

PORT=8443
DB_HOST=localhost
DB_PORT=27017
DB_NAME=your_db
API_KEY=your_secret_key
JWT_SECRET=your_jwt_secret
3️⃣ Start the Server
node server.js
4️⃣ Test API (Postman)
🔹 Login
POST https://localhost:8443/api/auth/signin

Body:

{
  "username": "testuser2",
  "password": "12345678"
}
🔹 Access Protected Route
GET https://localhost:8443/api/user/profile

Headers:

Authorization: Bearer <JWT_TOKEN>
x-api-key: your_secret_key
🚨 Intrusion Detection (Fail2Ban Setup)
Example Configuration:
[login-api]
enabled = true
port = 8443
logpath = /path/to/security.log
maxretry = 5
findtime = 60
bantime = 600
📊 Security Layers Summary
Layer	Implementation
Encryption	HTTPS (SSL/TLS)
Authentication	JWT
Authorization	API Key
Rate Limiting	express-rate-limit
Monitoring	Fail2Ban + Logs
Headers	Helmet + CSP + HSTS
Network Control	CORS
🧠 Key Learnings
Implemented layered security (defense-in-depth)
Learned real-world API protection techniques
Gained experience in intrusion detection and monitoring
Applied SOC-level security practices in development
📎 Deliverables
✔ Secured Node.js API
✔ Intrusion detection setup
✔ Security headers implementation
✔ GitHub repository with full code
👤 Author

Geletaw Abebe
Cybersecurity Intern | SOC Analyst | Network & Security Engineer