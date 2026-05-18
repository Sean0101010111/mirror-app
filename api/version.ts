/**
 * Vercel Serverless Function: GET /api/version
 * Returns the question bank version info
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Content-Type': 'application/json',
};

export default function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).set(CORS_HEADERS).send('');
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).set(CORS_HEADERS).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Read the meta data
    const metaPath = join(__dirname, 'data', 'meta.json');
    const meta = JSON.parse(readFileSync(metaPath, 'utf-8'));

    res.status(200).set(CORS_HEADERS).json({
      version: meta.version,
      lastUpdated: meta.lastUpdated,
      totalQuestions: meta.totalQuestions
    });
  } catch (error) {
    console.error('Error loading version info:', error);
    res.status(500).set(CORS_HEADERS).json({ 
      error: 'Failed to load version info',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}