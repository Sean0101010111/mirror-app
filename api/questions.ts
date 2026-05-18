/**
 * Vercel Serverless Function: GET /api/questions
 * Returns the complete question bank
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
    // Read the questions data
    const dataPath = join(__dirname, 'data', 'questions.json');
    const questionData = JSON.parse(readFileSync(dataPath, 'utf-8'));

    res.status(200).set(CORS_HEADERS).json(questionData);
  } catch (error) {
    console.error('Error loading questions:', error);
    res.status(500).set(CORS_HEADERS).json({ 
      error: 'Failed to load question bank',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}