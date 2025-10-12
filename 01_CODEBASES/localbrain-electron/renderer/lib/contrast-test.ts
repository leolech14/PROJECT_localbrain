// APCA Contrast Testing Utility
// Verify LocalBrain color palette meets WCAG 3.0 APCA standards

import { calculateAPCA, meetsAPCAStandard, contrastVerification } from './oklch';

/**
 * Run comprehensive contrast verification
 */
export function verifyContrastCompliance() {
  console.log('=== LocalBrain APCA Contrast Verification ===\n');

  // Test all text/background combinations
  const tests = [
    {
      name: 'Primary Text (tx1) on Dark Background (bg1)',
      Lc: contrastVerification.tx1_on_bg1,
      fontSize: 16,
      fontWeight: 400,
      requirement: 'Body text (Lc 60+)',
    },
    {
      name: 'Primary Text (tx1) on Medium Dark (bg2)',
      Lc: contrastVerification.tx1_on_bg2,
      fontSize: 16,
      fontWeight: 400,
      requirement: 'Body text (Lc 60+)',
    },
    {
      name: 'Secondary Text (tx2) on Dark Background (bg1)',
      Lc: contrastVerification.tx2_on_bg1,
      fontSize: 16,
      fontWeight: 400,
      requirement: 'Body text (Lc 60+)',
    },
    {
      name: 'Secondary Text (tx2) on Medium Dark (bg2)',
      Lc: contrastVerification.tx2_on_bg2,
      fontSize: 18,
      fontWeight: 400,
      requirement: 'Large text (Lc 45+)',
    },
    {
      name: 'UI Text (tx3) on Dark Background (bg1)',
      Lc: contrastVerification.tx3_on_bg1,
      fontSize: 16,
      fontWeight: 700,
      requirement: 'Bold UI text (Lc 45+)',
    },
    {
      name: 'Borders (hair) on Dark Background (bg1)',
      Lc: contrastVerification.hair_on_bg1,
      fontSize: 0,
      fontWeight: 0,
      requirement: 'UI components (Lc 30+)',
    },
    {
      name: 'Accent (acc) on Dark Background (bg1)',
      Lc: contrastVerification.acc_on_bg1,
      fontSize: 16,
      fontWeight: 400,
      requirement: 'Body text (Lc 60+)',
    },
  ];

  let allPassed = true;

  tests.forEach((test) => {
    const absLc = Math.abs(test.Lc);
    const passed = test.fontSize === 0
      ? absLc >= 30  // UI components
      : meetsAPCAStandard(test.Lc, test.fontSize, test.fontWeight);

    const status = passed ? '✅ PASS' : '❌ FAIL';
    const lcFormatted = test.Lc > 0
      ? `+${test.Lc.toFixed(1)}`
      : test.Lc.toFixed(1);

    console.log(`${status} ${test.name}`);
    console.log(`     Lc: ${lcFormatted} | Requirement: ${test.requirement}`);
    console.log('');

    if (!passed) allPassed = false;
  });

  console.log('===========================================');
  console.log(allPassed
    ? '✅ All contrast tests PASSED - APCA compliant!'
    : '❌ Some contrast tests FAILED - Adjustments needed'
  );
  console.log('===========================================\n');

  return allPassed;
}

/**
 * Calculate and display APCA contrast for any text/bg pair
 */
export function testCustomContrast(
  textL: number,
  bgL: number,
  fontSize: number = 16,
  fontWeight: number = 400
) {
  const Lc = calculateAPCA(textL, bgL);
  const meets = meetsAPCAStandard(Lc, fontSize, fontWeight);

  console.log(`Text L: ${textL}, Background L: ${bgL}`);
  console.log(`Font: ${fontSize}px, Weight: ${fontWeight}`);
  console.log(`APCA Lc: ${Lc > 0 ? '+' : ''}${Lc.toFixed(1)}`);
  console.log(`Meets standard: ${meets ? '✅ YES' : '❌ NO'}`);

  return { Lc, meets };
}

/**
 * Find optimal text lightness for a given background
 */
export function findOptimalTextColor(
  bgL: number,
  targetLc: number = 60
): number {
  // Binary search for optimal text lightness
  let low = 0;
  let high = 1;
  let best = bgL > 0.5 ? 0 : 1; // Start with opposite end

  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    const Lc = Math.abs(calculateAPCA(mid, bgL));

    if (Math.abs(Lc - targetLc) < 1) {
      return mid; // Close enough
    }

    if (Lc < targetLc) {
      // Need more contrast
      if (bgL > mid) {
        low = mid; // Make text darker
      } else {
        high = mid; // Make text lighter
      }
    } else {
      // Too much contrast
      if (bgL > mid) {
        high = mid; // Make text lighter
      } else {
        low = mid; // Make text darker
      }
    }

    best = mid;
  }

  return best;
}

// Export for testing in console
if (typeof window !== 'undefined') {
  (window as any).verifyContrast = verifyContrastCompliance;
  (window as any).testContrast = testCustomContrast;
  (window as any).findOptimalText = findOptimalTextColor;
}
