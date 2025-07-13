// Import Express module
const express = require("express");
const path = require("path");

// Initialize an Express application
const app = express();

// Define the port on which the server will listen
const PORT = process.env.PORT || 3000;

// FOR LOCAL DEVELOPMENT:
// Serve static files from 'public'
// On Vercel, `outputDirectory: "public"` in vercel.json handles this directly
// from the CDN for actual deployments.
app.use(express.static(path.join(__dirname, "public")));

// FOR LOCAL DEVELOPMENT:
// This catch-all serves clean URLs for local testing by finding the .html file.
// On Vercel, the `rewrites` in vercel.json (specifically "/(.*)" -> "/$1.html")
// will handle this before the request even reaches server.js.
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'public', req.path + '.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      // If the .html file isn't found, check if it's the root and serve index.html
      if (req.path === '/' || req.path === '/index') {
          return res.sendFile(path.join(__dirname, 'public', 'index.html'));
      }
      // If still not found, send a 404
      res.status(404).send('Page not found via Express server.');
    }
  });
});


// Handle non-existent .html routes redirect for local testing (optional, less critical now)
// On Vercel, this is usually handled by vercel.json.
// app.get("*.html", (req, res) => {
//   res.redirect(301, req.path.slice(0, -5)); // Redirect to the clean URL (e.g., /about)
// });


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});