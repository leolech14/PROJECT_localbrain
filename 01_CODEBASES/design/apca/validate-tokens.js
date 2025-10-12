#!/usr/bin/env node

/**
 * Design Token APCA Validation
 *
 * Validates all color pairings in design-tokens.json against APCA requirements
 */

import { validatePairing, getFontRecommendations } from './validator.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load design tokens
const tokensPath = join(__dirname, '../tokens/design-tokens.json');
const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'));

console.log('🎨 LocalBrain Design Tokens - APCA Validation Report\n');
console.log('=' . repeat(70));
console.log('\n');

// Define color pairings to validate from design tokens
const pairingsToValidate = [
  // Surface tokens
  {
    name: 'Surface: bg + text (primary)',
    text: tokens.tokens.color.surface.text.value,
    bg: tokens.tokens.color.surface.bg.value,
    usage: 'body',
    required: 75
  },
  {
    name: 'Surface: bg + textMuted (secondary)',
    text: tokens.tokens.color.surface.textMuted.value,
    bg: tokens.tokens.color.surface.bg.value,
    usage: 'body',
    required: 60
  },
  {
    name: 'Surface: bgSubtle + text',
    text: tokens.tokens.color.surface.text.value,
    bg: tokens.tokens.color.surface.bgSubtle.value,
    usage: 'body',
    required: 75
  },
  {
    name: 'Surface: bgHover + text',
    text: tokens.tokens.color.surface.text.value,
    bg: tokens.tokens.color.surface.bgHover.value,
    usage: 'body',
    required: 75
  },

  // Accent tokens
  {
    name: 'Accent: bg + text (interactive)',
    text: tokens.tokens.color.accent.text.value,
    bg: tokens.tokens.color.accent.bg.value,
    usage: 'interactive',
    required: 75
  },
  {
    name: 'Accent: bgHover + text',
    text: tokens.tokens.color.accent.text.value,
    bg: tokens.tokens.color.accent.bgHover.value,
    usage: 'interactive',
    required: 75
  },
  {
    name: 'Accent: bgActive + text',
    text: tokens.tokens.color.accent.text.value,
    bg: tokens.tokens.color.accent.bgActive.value,
    usage: 'interactive',
    required: 75
  },

  // Muted tokens
  {
    name: 'Muted: bg + text',
    text: tokens.tokens.color.muted.text.value,
    bg: tokens.tokens.color.muted.bg.value,
    usage: 'body',
    required: 75
  },
  {
    name: 'Muted: bgHover + text',
    text: tokens.tokens.color.muted.text.value,
    bg: tokens.tokens.color.muted.bgHover.value,
    usage: 'body',
    required: 75
  },

  // Interactive tokens
  {
    name: 'Interactive: bg + text (buttons, links)',
    text: tokens.tokens.color.interactive.text.value,
    bg: tokens.tokens.color.interactive.bg.value,
    usage: 'interactive',
    required: 75
  },
  {
    name: 'Interactive: bgHover + text',
    text: tokens.tokens.color.interactive.text.value,
    bg: tokens.tokens.color.interactive.bgHover.value,
    usage: 'interactive',
    required: 75
  },
  {
    name: 'Interactive: bgActive + text',
    text: tokens.tokens.color.interactive.text.value,
    bg: tokens.tokens.color.interactive.bgActive.value,
    usage: 'interactive',
    required: 75
  },

  // Success tokens
  {
    name: 'Success: bg + text',
    text: tokens.tokens.color.success.text.value,
    bg: tokens.tokens.color.success.bg.value,
    usage: 'interactive',
    required: 75
  },
  {
    name: 'Success: bgSubtle + textSubtle',
    text: tokens.tokens.color.success.textSubtle.value,
    bg: tokens.tokens.color.success.bgSubtle.value,
    usage: 'body',
    required: 60
  },

  // Warning tokens
  {
    name: 'Warning: bg + text',
    text: tokens.tokens.color.warning.text.value,
    bg: tokens.tokens.color.warning.bg.value,
    usage: 'interactive',
    required: 75
  },
  {
    name: 'Warning: bgSubtle + textSubtle',
    text: tokens.tokens.color.warning.textSubtle.value,
    bg: tokens.tokens.color.warning.bgSubtle.value,
    usage: 'body',
    required: 60
  },

  // Error tokens
  {
    name: 'Error: bg + text',
    text: tokens.tokens.color.error.text.value,
    bg: tokens.tokens.color.error.bg.value,
    usage: 'interactive',
    required: 75
  },
  {
    name: 'Error: bgSubtle + textSubtle',
    text: tokens.tokens.color.error.textSubtle.value,
    bg: tokens.tokens.color.error.bgSubtle.value,
    usage: 'body',
    required: 60
  }
];

let passCount = 0;
let failCount = 0;
const results = [];

console.log('📊 VALIDATION RESULTS:\n');

pairingsToValidate.forEach((pairing, index) => {
  const result = validatePairing(pairing.text, pairing.bg, pairing.usage);
  results.push({ ...result, name: pairing.name, required: pairing.required });

  const statusIcon = result.passes ? '✅' : '❌';
  const contrastDisplay = result.actualContrast.toFixed(1);

  console.log(`${statusIcon} ${pairing.name}`);
  console.log(`   Actual: ${contrastDisplay} | Required: ≥${pairing.required} | ${result.status}`);

  if (!result.passes) {
    const deficit = (pairing.required - result.actualContrast).toFixed(1);
    console.log(`   ⚠️  Deficit: ${deficit} points below requirement`);
    failCount++;
  } else {
    const surplus = (result.actualContrast - pairing.required).toFixed(1);
    console.log(`   ✨ Surplus: ${surplus} points above requirement`);
    passCount++;
  }

  console.log('');
});

// Summary statistics
console.log('=' .repeat(70));
console.log('\n📈 SUMMARY STATISTICS:\n');
console.log(`Total Pairings Tested: ${pairingsToValidate.length}`);
console.log(`✅ Passed: ${passCount} (${((passCount / pairingsToValidate.length) * 100).toFixed(1)}%)`);
console.log(`❌ Failed: ${failCount} (${((failCount / pairingsToValidate.length) * 100).toFixed(1)}%)`);
console.log('');

// Compliance status
if (failCount === 0) {
  console.log('🎉 FULL COMPLIANCE: All design tokens meet APCA requirements!');
  console.log('✅ Safe to use in production');
} else {
  console.log(`⚠️  NON-COMPLIANT: ${failCount} token pairing(s) fail APCA requirements`);
  console.log('❌ Must fix before production use');
}

console.log('\n' + '='.repeat(70));
console.log('\n');

// Exit with error code if any validation fails
process.exit(failCount > 0 ? 1 : 0);
