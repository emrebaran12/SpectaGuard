// WebRTC Leak Test
export async function runWebRTCTest() {
  return new Promise((resolve) => {
    try {
      const localIPs = [];
      const publicIPs = [];
      let hasStunResponse = false;

      // Create RTCPeerConnection with STUN servers
      const rtcConfig = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      };

      const pc = new RTCPeerConnection(rtcConfig);

      // Create data channel to trigger candidate gathering
      pc.createDataChannel("test");

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;

          // Extract IP addresses from candidate
          const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
          if (ipMatch) {
            const ip = ipMatch[1];

            // Classify IP types
            if (isLocalIP(ip)) {
              if (!localIPs.includes(ip)) {
                localIPs.push(ip);
              }
            } else {
              hasStunResponse = true;
              if (!publicIPs.includes(ip)) {
                publicIPs.push(ip);
              }
            }
          }
        } else {
          // ICE gathering complete
          pc.close();

          const hasLeak = localIPs.length > 0;
          const leakSeverity = assessLeakSeverity(localIPs, publicIPs);

          resolve({
            status: hasLeak ? "warning" : "ok",
            details: {
              localIPLeak: hasLeak,
              localIPs: localIPs,
              publicIPs: publicIPs,
              leakSeverity: leakSeverity,
              stunResponse: hasStunResponse,
            },
            score: hasLeak ? Math.max(0, 75 - leakSeverity * 25) : 100,
            raw: {
              localIPCount: localIPs.length,
              publicIPCount: publicIPs.length,
            },
          });
        }
      };

      // Handle connection state changes
      pc.oniceconnectionstatechange = () => {
        if (
          pc.iceConnectionState === "failed" ||
          pc.iceConnectionState === "closed"
        ) {
          pc.close();
        }
      };

      // Create offer to start ICE gathering
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch((error) => {
          console.error("WebRTC offer creation failed:", error);
          resolve({
            status: "failed",
            error: "Could not create WebRTC offer",
            score: 50, // Neutral score if test fails
          });
        });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (pc.iceConnectionState !== "closed") {
          pc.close();

          const hasLeak = localIPs.length > 0;
          const leakSeverity = assessLeakSeverity(localIPs, publicIPs);

          resolve({
            status: hasLeak ? "warning" : "ok",
            details: {
              localIPLeak: hasLeak,
              localIPs: localIPs,
              publicIPs: publicIPs,
              leakSeverity: leakSeverity,
              stunResponse: hasStunResponse,
              timeout: true,
            },
            score: hasLeak ? Math.max(0, 75 - leakSeverity * 25) : 100,
            raw: {
              localIPCount: localIPs.length,
              publicIPCount: publicIPs.length,
            },
          });
        }
      }, 10000);
    } catch (error) {
      resolve({
        status: "failed",
        error: error.message,
        score: 50, // Neutral score if WebRTC not supported
      });
    }
  });
}

// Check if an IP address is local/private
function isLocalIP(ip) {
  // Private IP ranges:
  // 10.0.0.0/8
  // 172.16.0.0/12
  // 192.168.0.0/16
  // 169.254.0.0/16 (Link-local)
  // 127.0.0.0/8 (Loopback)

  const parts = ip.split(".").map(Number);

  if (parts.length !== 4) return false;

  // 10.x.x.x
  if (parts[0] === 10) return true;

  // 172.16.x.x - 172.31.x.x
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

  // 192.168.x.x
  if (parts[0] === 192 && parts[1] === 168) return true;

  // 169.254.x.x (Link-local)
  if (parts[0] === 169 && parts[1] === 254) return true;

  // 127.x.x.x (Loopback)
  if (parts[0] === 127) return true;

  return false;
}

// Assess the severity of IP leaks
function assessLeakSeverity(localIPs, publicIPs) {
  let severity = 0;

  // More local IPs = higher severity
  if (localIPs.length > 0) severity += 1;
  if (localIPs.length > 2) severity += 1;

  // Public IP exposure is very serious
  if (publicIPs.length > 0) severity += 2;

  // Multiple interface exposure
  const hasWirelessIP = localIPs.some((ip) => ip.startsWith("192.168."));
  const hasWiredIP = localIPs.some(
    (ip) =>
      ip.startsWith("10.") ||
      (ip.startsWith("172.") &&
        parseInt(ip.split(".")[1]) >= 16 &&
        parseInt(ip.split(".")[1]) <= 31),
  );

  if (hasWirelessIP && hasWiredIP) severity += 1;

  return Math.min(severity, 3); // Cap at 3 (maximum severity)
}
