import { useEffect, useState } from "react";
import "./App.css";
import Main from "./components/Main/Main";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Step 2: Save every update to LocalStorage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // ✅ Step 3: Callback for new chat (from Main.jsx)
  const handleNewChat = (prompt) => {
    setChatHistory((prev) => [prompt, ...prev]);
  };
  return (
    <>
      <Sidebar chatHistory={chatHistory} setChatHistory={setChatHistory} />
      <Main onNewChat={handleNewChat} />
    </>
  );
}

export default App;
