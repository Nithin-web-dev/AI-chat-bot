import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const API_KEY = "your api key"; // Replace ur API key
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  const sendMessage = async () => {
    if (!input.trim() || loading) return; // Prevent sending empty messages or multiple requests

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);
    setCurrentMessage("");

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: input }] }]
        }
      );

      const botReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
                       "Sorry, I couldn't understand.";

      simulateTypingEffect(botReply);
    } catch (error) {
      console.error("API Error:", error);
      simulateTypingEffect("Error fetching response!");
    }
  };

  // Function for typing effect
  const simulateTypingEffect = (message) => {
    let index = 0;
    setLoading(true);
    
    const interval = setInterval(() => {
      if (index < message.length) {
        setCurrentMessage((prev) => prev + message[index]);
        index++;
      } else {
        clearInterval(interval);
        setMessages((prev) => [...prev, { text: message, sender: "bot" }]);
        setCurrentMessage("");
        setLoading(false);
      }
    }, 50); // Speed of typing effect
  };

  // Function for Enter key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-header">NSL Chatbot</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot">{currentMessage || "..."}</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Typing..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
