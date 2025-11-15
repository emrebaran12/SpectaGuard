// Headers & Storage Test
export async function runHeadersStorageTest() {
  try {
    const results = {
      cookies: testCookies(),
      localStorage: testLocalStorage(),
      sessionStorage: testSessionStorage(),
      doNotTrack: testDoNotTrack(),
      httpsConnection: testHTTPS(),
      headers: await testHeaders(),
    };

    const score = calculateHeadersStorageScore(results);
    const status = determineHeadersStorageStatus(results, score);

    return {
      status: status,
      details: results,
      score: score,
      raw: {
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        protocol: window.location.protocol,
        userAgent: navigator.userAgent.substring(0, 50) + "...",
      },
    };
  } catch (error) {
    return {
      status: "failed",
      error: error.message,
      score: 0,
    };
  }
}

// Test cookie support
function testCookies() {
  try {
    // Check if cookies are enabled
    const cookiesEnabled = navigator.cookieEnabled;

    // Try to set a test cookie
    document.cookie = "test_privacy_cookie=1; path=/; SameSite=Strict";
    const canSetCookies = document.cookie.includes("test_privacy_cookie=1");

    // Clean up test cookie
    if (canSetCookies) {
      document.cookie =
        "test_privacy_cookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }

    return {
      enabled: cookiesEnabled,
      canWrite: canSetCookies,
      riskLevel: cookiesEnabled ? "medium" : "low",
    };
  } catch (error) {
    return {
      enabled: false,
      canWrite: false,
      riskLevel: "low",
      error: error.message,
    };
  }
}

// Test localStorage
function testLocalStorage() {
  try {
    const testKey = "privacy_test_local";
    const testValue = "test_value_123";

    localStorage.setItem(testKey, testValue);
    const canWrite = localStorage.getItem(testKey) === testValue;

    // Clean up
    localStorage.removeItem(testKey);

    // Check if there are existing items (privacy risk)
    const existingItems = localStorage.length;

    return {
      available: true,
      canWrite: canWrite,
      existingItems: existingItems,
      riskLevel:
        existingItems > 5 ? "high" : existingItems > 0 ? "medium" : "low",
    };
  } catch (error) {
    return {
      available: false,
      canWrite: false,
      existingItems: 0,
      riskLevel: "low",
      error: error.message,
    };
  }
}

// Test sessionStorage
function testSessionStorage() {
  try {
    const testKey = "privacy_test_session";
    const testValue = "test_session_123";

    sessionStorage.setItem(testKey, testValue);
    const canWrite = sessionStorage.getItem(testKey) === testValue;

    // Clean up
    sessionStorage.removeItem(testKey);

    const existingItems = sessionStorage.length;

    return {
      available: true,
      canWrite: canWrite,
      existingItems: existingItems,
      riskLevel: existingItems > 3 ? "medium" : "low",
    };
  } catch (error) {
    return {
      available: false,
      canWrite: false,
      existingItems: 0,
      riskLevel: "low",
      error: error.message,
    };
  }
}

// Test Do Not Track header
function testDoNotTrack() {
  const dnt = navigator.doNotTrack;
  const enabled = dnt === "1" || dnt === "yes";

  return {
    enabled: enabled,
    value: dnt,
    riskLevel: enabled ? "low" : "medium",
  };
}

// Test HTTPS connection
function testHTTPS() {
  const isHTTPS = window.location.protocol === "https:";
  const hasHSTS =
    document.querySelector('meta[http-equiv="Strict-Transport-Security"]') !==
    null;

  return {
    secure: isHTTPS,
    hsts: hasHSTS,
    protocol: window.location.protocol,
    riskLevel: isHTTPS ? "low" : "high",
  };
}

// Test additional headers and features
async function testHeaders() {
  const features = {};

  try {
    // Test if certain APIs are available
    features.geolocation = "geolocation" in navigator;
    features.camera =
      "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices;
    features.microphone = features.camera; // Same API
    features.notifications = "Notification" in window;
    features.clipboard = "clipboard" in navigator;
    features.webgl = !!document.createElement("canvas").getContext("webgl");
    features.webWorkers = typeof Worker !== "undefined";
    features.serviceWorkers = "serviceWorker" in navigator;

    // Browser language preferences
    features.languages = navigator.languages ? navigator.languages.length : 1;
    features.language = navigator.language;

    return {
      availableAPIs: features,
      sensitiveAPIs: [
        "geolocation",
        "camera",
        "microphone",
        "notifications",
      ].filter((api) => features[api]).length,
      riskLevel: features.geolocation || features.camera ? "high" : "medium",
    };
  } catch (error) {
    return {
      availableAPIs: {},
      sensitiveAPIs: 0,
      riskLevel: "low",
      error: error.message,
    };
  }
}

// Calculate overall score for headers and storage
function calculateHeadersStorageScore(results) {
  let score = 100;

  // Cookies penalty
  if (results.cookies.enabled) score -= 15;
  if (results.cookies.canWrite) score -= 10;

  // Storage penalties
  if (results.localStorage.available && results.localStorage.canWrite)
    score -= 10;
  if (results.localStorage.existingItems > 0)
    score -= Math.min(results.localStorage.existingItems * 2, 20);

  if (results.sessionStorage.available && results.sessionStorage.canWrite)
    score -= 5;

  // DNT bonus
  if (results.doNotTrack.enabled) score += 10;

  // HTTPS bonus
  if (results.httpsConnection.secure) score += 5;
  else score -= 25;

  // Sensitive API penalties
  if (results.headers.sensitiveAPIs > 0)
    score -= results.headers.sensitiveAPIs * 10;

  return Math.max(0, Math.min(100, score));
}

// Determine status based on results
function determineHeadersStorageStatus(results, score) {
  if (score >= 80) return "ok";
  if (score >= 60) return "warning";
  return "warning";
}
