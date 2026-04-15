# Secure Web Application Security Audit & Compliance Validation

## 📌 Week 6: Advanced Security Audit & Final Deployment Report

---

## 1. Objective

The objective of this phase was to perform a full security audit of the application using industry-standard tools:

- OWASP ZAP
- Nikto
- Lynis

And validate compliance with OWASP Top 10 security standards while ensuring secure deployment practices.

---

## 2. Tools Used

- OWASP ZAP (Web vulnerability scanner)
- Nikto (Web server security scanner)
- Lynis (Linux security auditing tool)
- Curl (manual HTTP header validation)
- Node.js secure backend

---

## 3. Security Audit Results

### 3.1 OWASP ZAP Scan Results

**Findings:**
- No critical vulnerabilities detected
- No SQL injection issues found
- No XSS vulnerabilities detected
- CSP policy partially enforced (later improved via Helmet)

**Evidence:**
- Screenshot 1: OWASP ZAP Active Scan Results
- Screenshot 2: Passive Scan Alerts

**Conclusion:**
✔ Application is secure against common OWASP Top 10 web attacks

---

### 3.2 Nikto Web Server Scan Results

**Findings:**
- Missing or informational security headers detected initially:
  - X-Content-Type-Options (fixed later)
  - Permissions-Policy (added later)
- Server banner hidden (good security practice)
- Rate limiting headers detected

**Evidence:**
- Screenshot 3: Initial Nikto Scan Output
- Screenshot 4: Final Nikto Scan Output (After Fixes)

**Conclusion:**
✔ No critical vulnerabilities detected  
✔ Only informational findings remain

---

### 3.3 Lynis Security Audit Results

**Findings:**
- System security baseline checked
- TLS configuration validated
- File permission checks passed
- No critical system-level vulnerabilities found

**Evidence:**
- Screenshot 5: Lynis Audit Summary

**Conclusion:**
✔ System is hardened and compliant with basic Linux security standards

---

## 4. OWASP Top 10 Compliance Check

| Risk Category                 | Status        |
|------------------------------|--------------|
| Injection                    | ✔ Mitigated  |
| Broken Authentication        | ✔ Mitigated  |
| Sensitive Data Exposure      | ✔ Mitigated  |
| XML External Entities        | ✔ Not Applicable |
| Broken Access Control        | ✔ Mitigated  |
| Security Misconfiguration    | ✔ Reduced     |
| Cross-Site Scripting (XSS)   | ✔ Mitigated  |
| Insecure Deserialization     | ✔ Not Applicable |
| Vulnerable Components        | ✔ Controlled |
| Insufficient Logging         | ✔ Implemented |

---

## 5. Secure Deployment Practices

### ✔ HTTPS Encryption
- TLS enabled using mkcert
- Secure communication enforced via HTTPS

---

### ✔ Security Headers (Helmet.js)

Implemented headers:
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Permissions-Policy

---

### ✔ API Security

- Rate limiting implemented using express-rate-limit
- API key authentication enabled
- CORS restricted to trusted origin only

---

### ✔ Input Security

- XSS protection enabled
- MongoDB injection prevention applied

---

## 6. Final Penetration Testing Summary

**Tools Used:**
- OWASP ZAP
- Nikto
- Manual testing (curl, browser inspection)

**Results:**
- No high or critical vulnerabilities detected
- Medium/low issues mitigated
- Application considered secure for development and test deployment

---

## 7. Key Security Improvements Applied

✔ Helmet security headers fully configured  
✔ CSP policy implemented  
✔ HTTPS enforced  
✔ API authentication enabled  
✔ Rate limiting protection active  
✔ Input sanitization enabled  
✔ CSRF protection implemented  

---

## 8. Screenshot Checklist

### OWASP ZAP
- Scan summary dashboard
- Alerts tab

### Nikto
- Initial scan output
- Final scan output after fixes

### Lynis
- Final audit score screen

### Browser / API
- HTTPS lock in browser
- API blocked request (no key)
- Successful API request (valid key)

### Terminal
- `curl -I` showing headers

---

## 9. Conclusion

The application has been successfully audited and secured using industry-standard cybersecurity tools and best practices.

All major vulnerabilities have been mitigated, and the system now aligns with OWASP Top 10 security standards.

### Final Security Posture:
✔ Secure API design  
✔ Hardened web server configuration  
✔ Proper authentication and authorization  
✔ Strong defensive security posture  

---