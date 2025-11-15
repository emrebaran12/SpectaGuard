"use client";

import { useState } from "react";
import {
  RefreshCw,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Eye,
} from "lucide-react";

export default function ResultsDashboard({ results, onReset }) {
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade) => {
    if (grade === "A" || grade === "B")
      return "bg-green-100 text-green-800 border-green-200";
    if (grade === "C" || grade === "D")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ok":
        return <CheckCircle size={20} className="text-green-600" />;
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-600" />;
      case "failed":
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Shield size={20} className="text-gray-600" />;
    }
  };

  const shareResults = () => {
    const shareText = `Anonimlik Skorom: ${results.grade} (${results.score}/100) - Ne kadar izlenebilir olduğumu öğrendim!`;
    if (navigator.share) {
      navigator.share({
        title: "Anonimlik Testi Sonuçlarım",
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText + " " + window.location.href);
      alert("Sonuçlar panoya kopyalandı!");
    }
  };

  const downloadResults = () => {
    const reportData = {
      score: results.score,
      grade: results.grade,
      timestamp: new Date().toISOString(),
      warnings: results.warnings,
      recommendations: results.recommendations.map((r) => ({
        title: r.title,
        description: r.description,
        priority: r.priority,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `privacy-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="min-h-screen bg-white px-6 py-20">
      <div className="max-w-[900px] mx-auto">
        {/* Header with Score */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <Shield size={32} className="text-black" />
              <h1
                className="text-[32px] md:text-[42px] font-bold text-black"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Anonymity Report
              </h1>
            </div>
          </div>

          {/* Score Display */}
          <div className="mb-8">
            <div className="relative inline-block">
              {/* Score Circle */}
              <div className="w-40 h-40 md:w-48 md:h-48 border-8 border-gray-200 rounded-full flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full border-8 border-transparent transition-all duration-1000 ease-out"
                  style={{
                    background: `conic-gradient(black ${results.score * 3.6}deg, transparent 0deg)`,
                  }}
                ></div>
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex flex-col items-center justify-center relative z-10">
                  <div
                    className={`text-[32px] md:text-[42px] font-bold ${getScoreColor(results.score)}`}
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {results.score}
                  </div>
                  <div className="text-black/60 text-sm font-medium">
                    out of 100
                  </div>
                </div>
              </div>

              {/* Grade Badge */}
              <div
                className={`absolute -top-2 -right-2 w-12 h-12 rounded-full border-2 ${getGradeColor(results.grade)} flex items-center justify-center font-bold text-xl`}
              >
                {results.grade}
              </div>
            </div>

            <p
              className="mt-6 text-lg text-black/70 max-w-[500px] mx-auto"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {results.score >= 80
                ? "Congratulations! Your online privacy is perfectly secure."
                : results.score >= 60
                  ? "Your privacy is at a moderate level. You could make some improvements."
                  : "Your privacy is at risk. Immediate action is recommended."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 bg-black hover:bg-black/90 text-white font-medium px-6 py-3 rounded-full transition-all duration-200"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              <RefreshCw size={18} />
              Retry
            </button>

            <button
              onClick={shareResults}
              className="inline-flex items-center gap-2 border-2 border-black hover:bg-black hover:text-white text-black font-medium px-6 py-3 rounded-full transition-all duration-200"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              <Share2 size={18} />
              Share
            </button>

            <button
              onClick={downloadResults}
              className="inline-flex items-center gap-2 border-2 border-black hover:bg-black hover:text-white text-black font-medium px-6 py-3 rounded-full transition-all duration-200"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

        {/* Warnings Section */}
        {results.warnings && results.warnings.length > 0 && (
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-black mb-4 flex items-center gap-2"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              <AlertTriangle size={24} className="text-yellow-600" />
              Detected Risks
            </h2>
            <div className="space-y-3">
              {results.warnings.map((warning, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <Eye
                    size={20}
                    className="text-yellow-600 mt-0.5 flex-shrink-0"
                  />
                  <p
                    className="text-black font-medium"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {warning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="w-full text-left mb-4"
          >
            <h2
              className="text-2xl font-bold text-black flex items-center justify-between"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              <span className="flex items-center gap-2">
                <Shield size={24} />
                Recommendations ({results.recommendations.length})
              </span>
              {showRecommendations ? (
                <ChevronUp size={24} />
              ) : (
                <ChevronDown size={24} />
              )}
            </h2>
          </button>

          {showRecommendations && (
            <div className="space-y-4">
              {results.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-black/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3
                      className="font-semibold text-black"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      {rec.title}
                    </h3>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}
                    >
                      {rec.priority === "high"
                        ? "High"
                        : rec.priority === "medium"
                          ? "Medium"
                          : "Low"}
                    </div>
                  </div>

                  <p
                    className="text-black/70 mb-2"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {rec.description}
                  </p>

                  <div className="text-sm">
                    <span className="text-black/60">Action: </span>
                    <span
                      className="text-black font-medium"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      {rec.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Results Section */}
        <div>
          <button
            onClick={() => setShowDetailedResults(!showDetailedResults)}
            className="w-full text-left mb-4"
          >
            <h2
              className="text-2xl font-bold text-black flex items-center justify-between"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Detailed Test Results
              {showDetailedResults ? (
                <ChevronUp size={24} />
              ) : (
                <ChevronDown size={24} />
              )}
            </h2>
          </button>

          {showDetailedResults && (
            <div className="space-y-4">
              {results.breakdown &&
                results.breakdown.map((test, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <h3
                          className="font-semibold text-black"
                          style={{
                            fontFamily: "Plus Jakarta Sans, sans-serif",
                          }}
                        >
                          {test.testName}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${getScoreColor(test.score)}`}
                        >
                          {test.score}/100
                        </div>
                        <div className="text-sm text-black/60">
                          Severity: %{test.weight}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-500"
                        style={{ width: `${test.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
