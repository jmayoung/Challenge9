import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import express from 'express'; // Add this line to import express

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Serve static files from the client/dist directory
router.use(express.static(path.join(__dirname, '../../client/dist')));

// Define route to serve index.html
router.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

export default router;