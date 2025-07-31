import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import { FaUser, FaRobot, FaMoon, FaSun } from "react-icons/fa";

function App() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const chatBoxRef = useRef(null);

  // Toggle body class based on darkMode state
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  // Scroll chat box to bottom whenever chat history or loading state changes
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
    }
  }, [chatHistory, loading]);

  // Handle asking question
  const askQuestion = async () => {
    if (!question.trim()) return;

    const timestamp = new Date().toLocaleTimeString();

    // Add user's question to chat history
    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: question, timestamp },
    ]);
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/ask", {
        question,
        chat_history: chatHistory,
      });

      const answer = response.data.answer;

      // Add assistant's answer to chat history
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: answer, timestamp: new Date().toLocaleTimeString() },
      ]);
      setQuestion("");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <div> RAG Chatbot</div>
        <div
          className="theme-toggle"
          role="button"
          tabIndex={0}
          onClick={() => setDarkMode(!darkMode)}
          onKeyPress={(e) => {
            if (e.key === "Enter") setDarkMode(!darkMode);
          }}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>
      </header>

      <div className="chat-container">
        <div className="chat-box" ref={chatBoxRef}>
          {chatHistory.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {msg.role === "user" ? <FaUser /> : <FaRobot />}
                <span>{msg.content}</span>
              </div>
              <div className="timestamp">{msg.timestamp}</div>
            </div>
          ))}
          {loading && <div className="typing-indicator">Bot is typing...</div>}
        </div>

        <textarea
          rows={3}
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!loading) askQuestion();
            }
          }}
          disabled={loading}
        />
        <button onClick={askQuestion} disabled={loading || !question.trim()}>
          {loading ? "Loading..." : "Ask"}
        </button>
      </div>
    </div>
  );
}

export default App;
