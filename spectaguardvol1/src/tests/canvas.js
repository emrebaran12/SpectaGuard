// Canvas Fingerprint Test
export async function runCanvasTest() {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 200;
    canvas.height = 50;

    // Draw some text and shapes to create a fingerprint
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);

    ctx.fillStyle = "#069";
    ctx.fillText("Canvas fingerprint test 🔒", 2, 15);

    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("Privacy Test 123", 4, 35);

    // Draw some geometric shapes
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgb(255, 0, 255)";
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // Get canvas data
    const canvasData = canvas.toDataURL();

    // Create hash of canvas data
    const hash = await createCanvasHash(canvasData);

    // Simulate analysis of how unique this canvas is
    const uniquenessScore = analyzeCanvasUniqueness(canvasData);

    return {
      status: uniquenessScore > 70 ? "warning" : "ok",
      details: {
        canvasHash: hash,
        uniquenessScore: uniquenessScore,
        dataLength: canvasData.length,
      },
      score: Math.max(0, 100 - uniquenessScore),
      raw: {
        canvasDataURL: canvasData.substring(0, 100) + "...", // Truncated for display
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

// Create hash of canvas data
async function createCanvasHash(canvasData) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(canvasData);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 16);
  } else {
    // Simple fallback hash
    let hash = 0;
    for (let i = 0; i < canvasData.length; i++) {
      const char = canvasData.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// Analyze canvas uniqueness (simplified simulation)
function analyzeCanvasUniqueness(canvasData) {
  let score = 0;

  // Check data length - more data usually means more unique rendering
  if (canvasData.length > 10000) score += 20;
  else if (canvasData.length > 5000) score += 10;

  // Look for specific patterns that indicate font/rendering differences
  if (canvasData.includes("data:image/png")) score += 10;

  // Check for emoji rendering (can vary significantly between systems)
  if (canvasData.length > 8000) score += 15; // Emoji rendered = longer data

  // Simulate system-specific rendering differences
  const currentTime = new Date().getTime();
  const pseudoRandom = currentTime % 100;

  // Simulate canvas rendering variations based on:
  // - Graphics card differences
  // - Font rendering engines
  // - Anti-aliasing settings
  score += pseudoRandom > 70 ? 30 : pseudoRandom > 40 ? 20 : 10;

  return Math.min(score, 100);
}
