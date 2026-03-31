// test-cors.js
fetch("https://localhost:8443/api/test", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "Gele123"  // must match dbConfig.API_KEY
  }
})
  .then(res => res.json())
  .then(data => console.log("Success:", data))
  .catch(err => console.error("CORS Error:", err));