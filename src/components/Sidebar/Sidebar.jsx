import React, { useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
const Sidebar = ({ chatHistory, setChatHistory }) => {
  const [extended, setExtended] = useState(false);

  const handleDeleteChat = (index) => {
    const updatedChats = chatHistory.filter((_, i) => i !== index);
    setChatHistory(updatedChats);
    localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
  };

  return (
    <>
      {/* Overlay for mobile (click outside to close) */}
      {extended && (
        <div
          className="sidebar-overlay"
          onClick={() => setExtended(false)}
        ></div>
      )}

      <div className={`sidebar ${extended ? "open" : ""}`}>
        <div className="top">
          <img
            onClick={() => setExtended((prev) => !prev)}
            className="menu"
            src={assets.menu_icon}
            alt="Menu Icon"
          />
          <div className="new-chat">
            <img src={assets.plus_icon} alt="Menu Icon" />
            {extended ? <p>New Chat</p> : null}
          </div>
          {extended ? (
            <div className="recent">
              <p className="recent-title">Recent</p>

              {chatHistory && chatHistory.length > 0 ? (
                chatHistory.map((chat, index) => (
                  <div className="recent-entry" key={index}>
                    <img src={assets.message_icon} alt="" />
                    <p>{chat.slice(0, 10)}...</p>

                    <img
                      src={assets.trash_icon}
                      alt="delete"
                      onClick={() => handleDeleteChat(index)}
                      style={{
                        width: "16px",
                        height: "16px",
                        marginLeft: "auto",
                        cursor: "pointer",
                        opacity: "0.7",
                      }}
                    />
                  </div>
                ))
              ) : (
                <p style={{ paddingLeft: "10px", opacity: 0.7 }}>
                  No chats yet
                </p>
              )}
            </div>
          ) : null}
        </div>
        <div className="bottom">
          <div className="bottom-item recent-entry">
            <img src={assets.question_icon} />
            {extended ? <p>Help</p> : null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.history_icon} />
            {extended ? <p>Activity</p> : null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} />
            {extended ? <p>Settings</p> : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
