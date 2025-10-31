import React, { useState } from "react";
import { assets } from "../../assets/assets";
import "./Main.css";
import { GoogleGenAI } from "@google/genai"; // ✅ latest Gemini SDK

// Initialize Gemini API client
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const Main = ({ onNewChat }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⚙️ Send Prompt
  const handleSend = async () => {
    if (!input.trim()) return;

    onNewChat && onNewChat(input);

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: input,
      });

      const text = result.text;
      const botMessage = { role: "bot", text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      const botMessage = {
        role: "bot",
        text: "⚠️ Something went wrong. Please try again!",
      };
      setMessages((prev) => [...prev, botMessage]);
    }

    setLoading(false);
  };

  return (
    <div className="main">
      {/* Navbar */}
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="user" />
      </div>

      <div className="main-container">
        {/* Greeting when no chat */}
        {messages.length === 0 && (
          <div className="greet">
            <p>
              <span>Hello, Dev.</span>
            </p>
            <p>How can I help you today?</p>
          </div>
        )}

        {/* Cards – only when no chat */}
        {messages.length === 0 && (
          <div className="cards">
            <div className="card">
              <p>Suggest beautiful places to see on an upcoming road trip</p>
              <img src={assets.compass_icon} alt="" />
            </div>
            <div className="card">
              <p>Briefly summarize this concept: urban planning</p>
              <img src={assets.bulb_icon} alt="" />
            </div>
            <div className="card">
              <p>Brainstorm team bonding activities for our work retreat</p>
              <img src={assets.message_icon} alt="" />
            </div>
            <div className="card">
              <p>Improve the readability of the following code</p>
              <img src={assets.code_icon} alt="" />
            </div>
          </div>
        )}

        {/* Chat Area */}
        {messages.length > 0 && (
          <div className="chat-area">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.role === "user" ? "user" : "bot"
                }`}
              >
                <img
                  src={
                    msg.role === "user"
                      ? assets.user_icon
                      : assets.gemini_icon || assets.bulb_icon
                  }
                  alt={msg.role}
                  className="chat-icon"
                />
                <p className="chat-text">{msg.text}</p>
              </div>
            ))}

            {loading && (
              <div className="chat-message bot">
                <img
                  src={assets.gemini_icon || assets.bulb_icon}
                  alt="bot"
                  className="chat-icon"
                />
                <p className="chat-text">Thinking... 🤔</p>
               
              </div>
            )}
          </div>
        )}

        {/* Bottom Input */}
        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter a prompt here!"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img
                src={assets.send_icon}
                alt="send"
                onClick={handleSend}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
