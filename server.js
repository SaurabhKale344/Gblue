// Import Express module
const express = require("express");
const path = require("path");

// Initialize an Express application
const app = express();

// Define the port on which the server will listen
const PORT = process.env.PORT || 3000;

// Serve static files (like images, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "dist")));



// Define routes for the HTML pages (without .html extension)
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.get("/about", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "about.html"));
// });


// app.get("/contact", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "contact.html"));
// });

// app.get("/whatisDEF", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "whatdef.html"));
// });

// app.get("/whydefimp", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "whydefimp.html"));
// });

// app.get("/careers", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "career.html"));
// });

// app.get("/deleteaccount", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "deleteaccount.html"));
// });

// app.get("/privacypolicy", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "privacypolicy.html"));
// });

// app.get("/blogs", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "blogs.html"));
// });

// app.get("/quality", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "quality.html"));
// });

// app.get("/partnerships", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "partnerships.html"));
// });

// app.get("/BSnorms", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "BSnorms.html"));
// });

// app.get("/whatisadblue", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "whatisadblue.html"));
// });

// app.get("/whatisscr", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "whatisscr.html"));
// });

// app.get("/storeadblue", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "storeadblue.html"));
// });

// app.get("/FAQs", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "FAQs.html"));
// });

// Handle non-existent routes (e.g., /about.html) to serve proper pages
// app.get("*.html", (req, res) => {
//   res.redirect(301, req.path.slice(0, -5)); // Redirect to the clean URL (e.g., /about)
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
