// Privacy Score Calculation
export function calculatePrivacyScore(testResults) {
  const weights = {
    fingerprint: 30,
    canvas: 20,
    webrtc: 25,
    headers: 25,
  };

  let totalScore = 0;
  let totalWeight = 0;
  const detailed = {};
  const warnings = [];
  const recommendations = [];

  // Process each test result
  for (const [testId, result] of Object.entries(testResults)) {
    if (result && typeof result.score === "number") {
      const weight = weights[testId] || 0;
      totalScore += result.score * weight;
      totalWeight += weight;

      detailed[testId] = result;

      // Collect warnings
      if (result.status === "warning" || result.status === "failed") {
        warnings.push(...generateWarnings(testId, result));
      }
    }
  }

  // Calculate final score (0-100)
  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

  // Determine letter grade
  const grade = calculateLetterGrade(finalScore);

  // Generate personalized recommendations
  const allRecommendations = generateRecommendations(testResults, finalScore);

  return {
    score: finalScore,
    grade: grade,
    results: detailed,
    warnings: warnings,
    recommendations: allRecommendations,
    breakdown: generateScoreBreakdown(testResults, weights),
  };
}

// Calculate letter grade (A-F)
function calculateLetterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

// Generate warnings based on test results
function generateWarnings(testId, result) {
  const warnings = [];

  switch (testId) {
    case "fingerprint":
      if (result.details && result.details.uniquenessPercentile > 80) {
        warnings.push(
          "Your browser fingerprint is highly unique — you can be easily tracked"
        );
      }
      if (result.details && result.details.uniquenessPercentile > 50) {
        warnings.push("Your browser settings make you uniquely identifiable");
      }
      break;

    case "canvas":
      if (result.details && result.details.uniquenessScore > 70) {
        warnings.push(
          "Canvas fingerprint detected — your graphics hardware may be trackable"
        );
      }
      break;

    case "webrtc":
      if (result.details && result.details.localIPLeak) {
        warnings.push(
          `WebRTC IP leak detected (${result.details.localIPs.length} local IP addresses)`
        );
      }
      if (
        result.details &&
        result.details.publicIPs &&
        result.details.publicIPs.length > 0
      ) {
        warnings.push(
          "Your real public IP address is exposed — your VPN may not be working"
        );
      }
      break;

    case "headers":
      if (
        result.details &&
        result.details.cookies &&
        result.details.cookies.enabled
      ) {
        warnings.push(
          "Cookies are enabled — websites can track your activity"
        );
      }
      if (
        result.details &&
        result.details.localStorage &&
        result.details.localStorage.existingItems > 0
      ) {
        warnings.push(
          `${result.details.localStorage.existingItems} localStorage items detected`
        );
      }
      if (
        result.details &&
        result.details.httpsConnection &&
        !result.details.httpsConnection.secure
      ) {
        warnings.push("Unsecured HTTP connection — your data is not encrypted");
      }
      break;
  }

  return warnings;
}

// Generate personalized recommendations
function generateRecommendations(testResults, finalScore) {
  const recommendations = [];

  // WebRTC recommendations
  if (
    testResults.webrtc &&
    testResults.webrtc.details &&
    testResults.webrtc.details.localIPLeak
  ) {
    recommendations.push({
      priority: "high",
      category: "WebRTC",
      title: "Stop WebRTC IP Leak",
      description:
        "Disable WebRTC in your browser or use a WebRTC Block extension",
      action: "Disable WebRTC from browser settings",
    });
  }

  // Browser fingerprint recommendations
  if (
    testResults.fingerprint &&
    testResults.fingerprint.details &&
    testResults.fingerprint.details.uniquenessPercentile > 70
  ) {
    recommendations.push({
      priority: "high",
      category: "Browser Privacy",
      title: "Obfuscate Your Browser Fingerprint",
      description:
        "Use Firefox with uBlock Origin or switch to Tor Browser for stronger privacy",
      action: "Switch to a privacy-focused browser",
    });
  }

  // Canvas fingerprint recommendations
  if (
    testResults.canvas &&
    testResults.canvas.details &&
    testResults.canvas.details.uniquenessScore > 60
  ) {
    recommendations.push({
      priority: "medium",
      category: "Canvas Protection",
      title: "Block Canvas Fingerprinting",
      description:
        "Use Canvas Blocker or disable canvas API via about:config",
      action: "Enable canvas fingerprint protection",
    });
  }

  // Cookie/Storage recommendations
  if (testResults.headers && testResults.headers.details) {
    if (
      testResults.headers.details.cookies &&
      testResults.headers.details.cookies.enabled
    ) {
      recommendations.push({
        priority: "medium",
        category: "Cookie Protection",
        title: "Tighten Cookie Settings",
        description:
          "Block third-party cookies and clear existing tracking cookies",
        action: "Adjust browser privacy settings",
      });
    }
  }

  // General recommendations based on score
  if (finalScore < 60) {
    recommendations.push({
      priority: "high",
      category: "General Security",
      title: "Use a VPN",
      description:
        "Hide your IP address and location using a trusted VPN service",
      action: "Get a reputable VPN",
    });
  }

  if (finalScore < 80) {
    recommendations.push({
      priority: "medium",
      category: "Browser Extensions",
      title: "Install Privacy Extensions",
      description:
        "Use uBlock Origin, Privacy Badger, and DuckDuckGo Privacy Essentials",
      action: "Install and configure recommended extensions",
    });
  }

  // Always include basic recommendations
  recommendations.push({
    priority: "low",
    category: "General Advice",
    title: "Regular Privacy Checkups",
    description:
      "Repeat this test monthly and keep your privacy settings up to date",
    action: "Add a reminder to your calendar",
  });

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });
}

// Generate detailed score breakdown
function generateScoreBreakdown(testResults, weights) {
  const breakdown = [];

  for (const [testId, weight] of Object.entries(weights)) {
    const result = testResults[testId];
    if (result) {
      breakdown.push({
        testName: getTestDisplayName(testId),
        score: result.score || 0,
        weight: weight,
        weightedScore: ((result.score || 0) * weight) / 100,
        status: result.status || "unknown",
      });
    }
  }

  return breakdown;
}

// Get display name for tests
function getTestDisplayName(testId) {
  const names = {
    fingerprint: "Browser Fingerprint",
    canvas: "Canvas Fingerprint",
    webrtc: "WebRTC Leak",
    headers: "Headers & Storage",
  };

  return names[testId] || testId;
}
