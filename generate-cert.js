const forge = require("node-forge");
const fs = require("fs");

// Generate a keypair
const keys = forge.pki.rsa.generateKeyPair(2048);

// Create a certificate
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = "01";
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

const attrs = [
  { name: "commonName", value: "example.com" },
  { name: "countryName", value: "US" },
  { shortName: "ST", value: "California" },
  { name: "localityName", value: "San Francisco" },
  { name: "organizationName", value: "My Company" },
  { shortName: "OU", value: "Test" }
];

cert.setSubject(attrs);
cert.setIssuer(attrs);

// Self-sign certificate
cert.sign(keys.privateKey, forge.md.sha256.create());

// Convert to PEM format
const pemCert = forge.pki.certificateToPem(cert);
const pemKey = forge.pki.privateKeyToPem(keys.privateKey);

// Save to files
fs.writeFileSync("cert.pem", pemCert);
fs.writeFileSync("key.pem", pemKey);

console.log("✅ Certificate generated successfully!");