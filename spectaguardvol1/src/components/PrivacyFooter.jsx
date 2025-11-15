export default function PrivacyFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3
            className="text-xl font-bold text-black mb-2"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            SpectaGuard
          </h3>
          <p
            className="text-black/60"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Browser-based anonymity analysis tool
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Privacy Statement */}
          <div>
            <h4
              className="font-semibold text-black mb-3"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Our Commitment to Privacy
            </h4>
            <p
              className="text-sm text-black/70 leading-relaxed"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              All tests run entirely in your browser. No personal data is sent or stored on our servers. Your test results are for your viewing only.
            </p>
          </div>

          {/* How It Works */}
          <div>
            <h4
              className="font-semibold text-black mb-3"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              How Does It Work?
            </h4>
            <ul className="text-sm text-black/70 space-y-1">
              <li style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                • Browser fingerprint analysis
              </li>
              <li style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                • Canvas fingerprint test
              </li>
              <li style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                • WebRTC IP leak check
              </li>
              <li style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                • Cookie and storage testing
              </li>
            </ul>
          </div>

          {/* Important Notes */}
          <div>
            <h4
              className="font-semibold text-black mb-3"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Important Notes 
            </h4>
            <p
              className="text-sm text-black/70 leading-relaxed"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              This test is for educational purposes only. Use professional security tools to protect yourself against real security threats. Test results are not definitive.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className="text-sm text-black/60"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              © 2025 SpectaGuard. Open source and free.
            </p>

            <div className="flex gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-black/60 hover:text-black transition-colors"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                GitHub
              </a>
              <a
                href="#privacy"
                className="text-sm text-black/60 hover:text-black transition-colors"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Privacy Policy
              </a>
              <a
                href="#contact"
                className="text-sm text-black/60 hover:text-black transition-colors"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
