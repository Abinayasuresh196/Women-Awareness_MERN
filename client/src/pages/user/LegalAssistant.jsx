import React, { useState } from "react";
import api from "../../services/api";
import "../../styles/legalAssistant.css";

const LegalAssistant = () => {
  const [complaint, setComplaint] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!complaint.trim()) return;

    try {
      setLoading(true);
      const res = await api.post("/ai/legal-assistant", { complaint });
      if (res.data.success) setResult(res.data.data);
    } catch (err) {
      alert("AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="legal-page">
      <h1>AI Legal Assistant</h1>
      <p className="subtitle">
        Describe your issue. We will help you understand the law.
      </p>

      <textarea
        placeholder="Example: My husband is demanding dowry and abusing me..."
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
      />

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze with AI"}
      </button>

      {result && (
        <div className="result-box">
          <h3>🟣 Problem Identified</h3>
          <p>{result.problem}</p>

          <h3>⚖️ Applicable Laws</h3>
          <ul>
            {result.laws.map((law, i) => (
              <li key={i}>
                <strong>{law.section}</strong> – {law.act}
              </li>
            ))}
          </ul>

          <h3>🚨 Punishment</h3>
          <p>{result.punishment}</p>

          <h3>📍 What You Can Do</h3>
          <ul>
            {result.nextSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>

          <small className="disclaimer">
            ⚠️ This is AI-generated guidance. Please consult a lawyer or women helpline.
          </small>
        </div>
      )}
    </div>
  );
};

export default LegalAssistant;
