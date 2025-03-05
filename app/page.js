'use client'

import { useState } from "react";

export default function ChatBot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 

  const handleChat = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await res.json();
      setResponse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response");
    } catch (error) {
      setResponse("Error fetching response");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Gemini AI Chat</h1>
      <textarea
        className="w-full max-w-lg p-2 border rounded"
        rows="4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
      />
      <button
        onClick={handleChat}
        disabled={loading}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? "Generating..." : "Send"}
      </button>
      {response && (
        <div className="mt-4 p-4 bg-white shadow rounded w-full max-w-lg">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
