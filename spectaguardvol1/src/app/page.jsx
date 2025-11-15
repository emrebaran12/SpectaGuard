"use client";

import { useState } from "react";
import PrivacyHero from "../components/PrivacyHero";
import TestRunner from "../components/TestRunner";
import ResultsDashboard from "../components/ResultsDashboard";
import PrivacyFooter from "../components/PrivacyFooter";

export default function PrivacyAnalyzer() {
  const [currentSection, setCurrentSection] = useState("hero"); // 'hero', 'testing', 'results'
  const [testResults, setTestResults] = useState(null);

  const startTest = () => {
    setCurrentSection("testing");
  };

  const onTestComplete = (results) => {
    setTestResults(results);
    setCurrentSection("results");
  };

  const resetTest = () => {
    setCurrentSection("hero");
    setTestResults(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {currentSection === "hero" && <PrivacyHero onStartTest={startTest} />}

      {currentSection === "testing" && (
        <TestRunner onComplete={onTestComplete} />
      )}

      {currentSection === "results" && testResults && (
        <ResultsDashboard results={testResults} onReset={resetTest} />
      )}

      <PrivacyFooter />
    </div>
  );
}
