// Browser Fingerprint Test
export async function runFingerprintTest() {
  try {
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages ? navigator.languages.join(",") : "",
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
      },
      hardware: {
        deviceMemory: navigator.deviceMemory || "unknown",
        hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
      },
      touchSupport: "ontouchstart" in window,
      plugins: Array.from(navigator.plugins)
        .map((plugin) => plugin.name)
        .slice(0, 10),
    };

    // Create a hash of the fingerprint
    const fingerprintString = JSON.stringify(fingerprint);
    const hash = await createHash(fingerprintString);

    // Simulate uniqueness calculation (in real app, you'd compare against database)
    const uniquenessScore = calculateUniquenessScore(fingerprint);

    return {
      status:
        uniquenessScore > 80
          ? "warning"
          : uniquenessScore > 50
            ? "warning"
            : "ok",
      details: {
        fingerprintHash: hash,
        uniquenessPercentile: uniquenessScore,
        entropy: fingerprintString.length,
      },
      score: Math.max(0, 100 - uniquenessScore), // Lower uniqueness = better privacy
      raw: fingerprint,
    };
  } catch (error) {
    return {
      status: "failed",
      error: error.message,
      score: 0,
    };
  }
}

// Create SHA-256 hash
async function createHash(data) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 16);
  } else {
    // Fallback for older browsers
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

// Calculate uniqueness score (0-100, higher = more unique/trackable)
function calculateUniquenessScore(fingerprint) {
  let score = 0;

  // User Agent uniqueness (common UAs get lower score)
  const commonUserAgents = ["Chrome", "Firefox", "Safari", "Edge"];
  const hasCommonUA = commonUserAgents.some((ua) =>
    fingerprint.userAgent.includes(ua),
  );
  score += hasCommonUA ? 10 : 25;

  // Screen resolution uniqueness
  const commonResolutions = [
    "1920x1080",
    "1366x768",
    "1280x720",
    "1440x900",
    "1536x864",
  ];
  const resolution = `${fingerprint.screen.width}x${fingerprint.screen.height}`;
  score += commonResolutions.includes(resolution) ? 5 : 15;

  // Language/timezone combination
  score += fingerprint.languages.includes(",") ? 10 : 5; // Multiple languages = more unique

  // Hardware information
  if (
    fingerprint.hardware.deviceMemory &&
    fingerprint.hardware.deviceMemory !== "unknown"
  ) {
    score += fingerprint.hardware.deviceMemory > 8 ? 15 : 5;
  }

  if (
    fingerprint.hardware.hardwareConcurrency &&
    fingerprint.hardware.hardwareConcurrency !== "unknown"
  ) {
    score += fingerprint.hardware.hardwareConcurrency > 8 ? 10 : 5;
  }

  // Plugin count (more plugins = more unique)
  score += Math.min(fingerprint.plugins.length * 2, 20);

  // Touch support on desktop = unusual
  if (fingerprint.touchSupport && fingerprint.platform.includes("Win")) {
    score += 10;
  }

  return Math.min(score, 100);
}
