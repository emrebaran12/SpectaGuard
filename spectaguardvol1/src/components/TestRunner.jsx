"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { runFingerprintTest } from "../tests/fingerprint";
import { runCanvasTest } from "../tests/canvas";
import { runWebRTCTest } from "../tests/webrtc";
import { runHeadersStorageTest } from "../tests/headersStorage";
import { calculatePrivacyScore } from "../tests/scoring";

export default function TestRunner({ onComplete }) {
  const [currentTest, setCurrentTest] = useState(0);
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(true);

  const tests = [
    {
      id: "fingerprint",
      name: "Browser Fingerprint",
      description: "Analyzing unique browser characteristics",
      runner: runFingerprintTest,
    },
    {
      id: "canvas",
      name: "Canvas Fingerprint",
      description: "Testing canvas drawing uniqueness",
      runner: runCanvasTest,
    },
    {
      id: "webrtc",
      name: "WebRTC Leak",
      description: "Checking if your IP address is exposed",
      runner: runWebRTCTest,
    },
    {
      id: "headers",
      name: "Headers & Storage",
      description: "Checking cookies and storage permissions",
      runner: runHeadersStorageTest,
    },
  ];

  useEffect(() => {
    if (isRunning && currentTest < tests.length) {
      const test = tests[currentTest];

      const runCurrentTest = async () => {
        try {
          const result = await test.runner();
          setTestResults((prev) => ({
            ...prev,
            [test.id]: result,
          }));

          // Move to next test after 1 second delay for UX
          setTimeout(() => {
            setCurrentTest((prev) => prev + 1);
          }, 1000);
        } catch (error) {
          console.error(`Test ${test.id} failed:`, error);
          setTestResults((prev) => ({
            ...prev,
            [test.id]: { status: "failed", error: error.message },
          }));

          setTimeout(() => {
            setCurrentTest((prev) => prev + 1);
          }, 1000);
        }
      };

      runCurrentTest();
    } else if (currentTest >= tests.length) {
      // All tests complete, calculate final score
      const finalResults = calculatePrivacyScore(testResults);
      setIsRunning(false);

      // Optionally submit anonymous statistics (no personal data)
      fetch("/api/privacy-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: finalResults.score,
          grade: finalResults.grade,
          results: {
            fingerprint: { status: testResults.fingerprint?.status },
            canvas: { status: testResults.canvas?.status },
            webrtc: { status: testResults.webrtc?.status },
            headers: { status: testResults.headers?.status },
          },
        }),
      }).catch((error) => {
        console.log("Could not submit anonymous statistics:", error.message);
      });

      // Pass results to parent after short delay
      setTimeout(() => {
        onComplete(finalResults);
      }, 1500);
    }
  }, [currentTest, isRunning]);

  const getTestStatusIcon = (testId, testIndex) => {
    if (testIndex > currentTest) {
      return (
        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
      );
    } else if (testIndex === currentTest) {
      return <Loader2 size={24} className="text-black animate-spin" />;
    } else if (testResults[testId]) {
      const result = testResults[testId];
      if (result.status === "ok") {
        return <CheckCircle size={24} className="text-green-600" />;
      } else if (result.status === "warning") {
        return <AlertTriangle size={24} className="text-yellow-600" />;
      } else {
        return <XCircle size={24} className="text-red-600" />;
      }
    }
    return <CheckCircle size={24} className="text-green-600" />;
  };

  const getProgressPercentage = () => {
    return Math.min((currentTest / tests.length) * 100, 100);
  };

  return (
    <section className="min-h-screen bg-white px-6 py-20 flex items-center justify-center">
      <div className="max-w-[600px] mx-auto text-center">

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-[36px] md:text-[48px] font-bold text-black mb-4 leading-tight"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Privacy is being tested...
          </h1>
          <p
            className="text-[16px] md:text-[18px] text-black/70"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Please wait while we run a series of privacy tests.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-black rounded-full h-3 transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <p
            className="text-sm text-black/60"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {Math.round(getProgressPercentage())}% complete
          </p>
        </div>

        {/* Test Cards */}
        <div className="space-y-4 mb-12">
          {tests.map((test, index) => (
            <div
              key={test.id}
              className={`
                border-2 rounded-lg p-4 text-left transition-all duration-300
                ${
                  index === currentTest
                    ? "border-black bg-black/5"
                    : index < currentTest
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-200"
                }
              `}
            >
              <div className="flex items-center gap-4">
                {getTestStatusIcon(test.id, index)}

                <div className="flex-1">
                  <h3
                    className="font-semibold text-black mb-1"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {test.name}
                  </h3>
                  <p
                    className="text-sm text-black/60"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {test.description}
                  </p>
                </div>

                {index === currentTest && (
                  <div className="text-right">
                    <div className="text-xs text-black/60 animate-pulse">
                      Running...
                    </div>
                  </div>
                )}

                {index < currentTest && testResults[test.id] && (
                  <div className="text-right">
                    <div className="text-xs font-medium text-black/60">
                      Completed
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {currentTest >= tests.length && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-black">
              <Loader2 size={20} className="animate-spin" />
              <span
                className="font-medium"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Preparing your results...
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
