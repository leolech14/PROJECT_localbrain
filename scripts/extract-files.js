#!/usr/bin/env node

/**
 * Script to extract pseudo-files from the AI-generated output
 * and write them to the filesystem
 * 
 * Usage: node extract-files.js < output.txt
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let currentFile = null;
let currentContent = [];
let inCodeBlock = false;
let foundFileMarker = false;

rl.on('line', (line) => {
  // Check for FILE: marker
  if (line.includes('// FILE:') || line.includes('# FILE:')) {
    if (currentFile && currentContent.length > 0) {
      // Write previous file
      writeFile(currentFile, currentContent.join('\n'));
    }
    
    // Extract filename
    const match = line.match(/FILE:\s*(.+?)$/);
    if (match) {
      currentFile = match[1].trim();
      currentContent = [];
      foundFileMarker = true;
      console.log(`Found file: ${currentFile}`);
    }
  } else if (foundFileMarker) {
    // Accumulate content for current file
    currentContent.push(line);
  }
});

rl.on('close', () => {
  // Write last file if exists
  if (currentFile && currentContent.length > 0) {
    writeFile(currentFile, currentContent.join('\n'));
  }
  console.log('\nExtraction complete!');
});

function writeFile(filePath, content) {
  // Create directory if it doesn't exist
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  
  // Write file
  fs.writeFileSync(filePath, content);
  console.log(`✓ Written: ${filePath}`);
}