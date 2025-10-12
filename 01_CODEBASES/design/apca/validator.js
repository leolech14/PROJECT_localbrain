#!/usr/bin/env node

/**
 * APCA Contrast Validator
 *
 * Validates color pairings against APCA contrast requirements:
 * - Body text: APCA ≥ 60
 * - Interactive elements: APCA ≥ 75
 * - Small text (<18px): APCA ≥ 75
 *
 * Usage: node validator.js
 */

import { APCAcontrast, sRGBtoY, displayP3toY, adobeRGBtoY, alphaBlend, calcAPCA, fontLookupAPCA } from 'apca-w3';
import Color from 'colorjs.io';

/**
 * Parse OKLCH color string to sRGB values for APCA calculation
 * @param {string} oklchString - Color in format "oklch(L C H)"
 * @returns {Array<number>} - [r, g, b] values in 0-255 range
 */
function parseOKLCH(oklchString) {
  try {
    const color = new Color(oklchString);
    const rgb = color.to('srgb');
    return [
      Math.round(rgb.r * 255),
      Math.round(rgb.g * 255),
      Math.round(rgb.b * 255)
    ];
  } catch (error) {
    throw new Error(`Failed to parse OKLCH color "${oklchString}": ${error.message}`);
  }
}

/**
 * Calculate APCA contrast between two OKLCH colors
 * @param {string} textColor - Text color in OKLCH format
 * @param {string} bgColor - Background color in OKLCH format
 * @returns {number} - APCA contrast value (Lc)
 */
export function calculateAPCA(textColor, bgColor) {
  const [tR, tG, tB] = parseOKLCH(textColor);
  const [bR, bG, bB] = parseOKLCH(bgColor);

  // Convert RGB to Y (relative luminance)
  const textY = sRGBtoY([tR, tG, tB]);
  const bgY = sRGBtoY([bR, bG, bB]);

  // Calculate APCA contrast
  const contrast = APCAcontrast(textY, bgY);

  return Math.abs(contrast);
}

/**
 * Validate a color pairing against APCA requirements
 * @param {string} textColor - Text color in OKLCH format
 * @param {string} bgColor - Background color in OKLCH format
 * @param {string} usage - Usage type: 'body', 'interactive', or 'small'
 * @returns {Object} - Validation result with pass/fail and details
 */
export function validatePairing(textColor, bgColor, usage = 'body') {
  const thresholds = {
    body: 60,
    interactive: 75,
    small: 75
  };

  const requiredContrast = thresholds[usage] || 60;
  const actualContrast = calculateAPCA(textColor, bgColor);
  const passes = actualContrast >= requiredContrast;

  return {
    textColor,
    bgColor,
    usage,
    requiredContrast,
    actualContrast: Math.round(actualContrast * 10) / 10,
    passes,
    status: passes ? '✅ PASS' : '❌ FAIL',
    message: passes
      ? `Contrast ${actualContrast.toFixed(1)} meets requirement ≥${requiredContrast}`
      : `Contrast ${actualContrast.toFixed(1)} fails requirement ≥${requiredContrast}`
  };
}

/**
 * Get recommended font sizes for a given contrast level
 * @param {number} contrast - APCA contrast value
 * @returns {Array<Object>} - Array of font weight/size recommendations
 */
export function getFontRecommendations(contrast) {
  const lookup = fontLookupAPCA(contrast);

  if (!lookup || lookup.length === 0) {
    return [{ message: 'Contrast too low for any font size' }];
  }

  const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  return lookup.map((size, index) => ({
    weight: weights[index],
    minSize: size > 0 ? `${size}px` : 'Not recommended',
    suitable: size > 0
  })).filter(rec => rec.suitable);
}

// Example validation
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🎨 APCA Contrast Validator\n');

  // Test cases from design tokens
  const testCases = [
    {
      name: 'Surface: bg + text',
      text: 'oklch(0.22 0.04 262)',
      bg: 'oklch(0.97 0.02 250)',
      usage: 'body'
    },
    {
      name: 'Surface: bg + textMuted',
      text: 'oklch(0.58 0.03 255)',
      bg: 'oklch(0.97 0.02 250)',
      usage: 'body'
    },
    {
      name: 'Accent: bg + text',
      text: 'oklch(0.98 0.01 230)',
      bg: 'oklch(0.50 0.12 230)',
      usage: 'interactive'
    },
    {
      name: 'Interactive: bg + text',
      text: 'oklch(0.98 0.01 230)',
      bg: 'oklch(0.50 0.12 230)',
      usage: 'interactive'
    }
  ];

  console.log('Validating design token pairings:\n');

  testCases.forEach(test => {
    const result = validatePairing(test.text, test.bg, test.usage);
    console.log(`${result.status} ${test.name}`);
    console.log(`   ${result.message}`);

    if (result.passes) {
      const recommendations = getFontRecommendations(result.actualContrast);
      console.log(`   Recommended font sizes:`);
      recommendations.slice(0, 3).forEach(rec => {
        console.log(`     - Weight ${rec.weight}: ${rec.minSize} minimum`);
      });
    }
    console.log('');
  });

  console.log('✅ Validation complete!');
}
