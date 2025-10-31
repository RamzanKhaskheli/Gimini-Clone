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
    setMessages((prev) => [...prev, userMessage, { role: "bot", text: "" }]);
    setInput("");
    setLoading(true);

    try {
      const result = await ai.models.streamGenerateContent({
        model: "gemini-2.5-flash",
        contents: input,
      });

      let fullText = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullText;
          return updated;
        });
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorText = error.message?.includes("503")
        ? "Gemini servers are busy, please try again later."
        : "⚠️ Something went wrong. Please try again!";
      setMessages((prev) => [...prev, { role: "bot", text: errorText }]);
    }

    setLoading(false);
  };

  const handleCardClick = async (question) => {
    setLoading(true);
    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: question,
      });

      const botMessage = { role: "bot", text: result.text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorText = error.message?.includes("503")
        ? "Gemini servers is busy, try again"
        : "⚠️ Something went wrong. Please try again!";

      setMessages((prev) => [...prev, { role: "bot", text: errorText }]);

      // Retry after delay if overloaded
      if (error.message?.includes("503")) {
        setTimeout(() => handleCardClick(question), 2000);
      }
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
        {/* Suggestion cards */}
        {messages.length === 0 && (
          <div className="cards">
            <div
              className="card"
              onClick={() =>
                handleCardClick(
                  "Suggest beautiful places to see on an upcoming road trip"
                )
              }
            >
              <p>Suggest beautiful places to see on an upcoming road trip</p>
              <img src={assets.compass_icon} alt="" />
            </div>

            <div
              className="card"
              onClick={() =>
                handleCardClick(
                  "Briefly summarize this concept: urban planning"
                )
              }
            >
              <p>Briefly summarize this concept: urban planning</p>
              <img src={assets.bulb_icon} alt="" />
            </div>

            <div
              className="card"
              onClick={() =>
                handleCardClick(
                  "Brainstorm team bonding activities for our work retreat"
                )
              }
            >
              <p>Brainstorm team bonding activities for our work retreat</p>
              <img src={assets.message_icon} alt="" />
            </div>

            <div
              className="card"
              onClick={() =>
                handleCardClick("Improve the readability of the following code")
              }
            >
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
