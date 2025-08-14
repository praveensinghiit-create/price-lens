import React, { useState, useRef, useEffect } from "react";
import apiService from "../../services/apiService";
import "./ChatComponent.css";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setLoading(true);
    const userMessage = inputMessage;
    setInputMessage("");

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userMessage },
    ]);

    try {
      const historyForApi = messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const response = await apiService.sendMessage({
        message: userMessage,
        history: historyForApi,
      });

      const modelResponse = response.data.response;

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", text: modelResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "model",
          text: "Error: Could not get a response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages-area custom-scrollbar">
        {messages.length === 0 && !loading && (
          <div className="chat-welcome-message">
            Start a conversation PriceLens AI
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-row ${
              msg.role === "user" ? "message-row-user" : "message-row-model"
            }`}
          >
            <div
              className={`message-bubble ${
                msg.role === "user"
                  ? "message-bubble-user"
                  : "message-bubble-model"
              }`}
            >
              <p className="message-text">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-row message-row-model">
            <div className="message-bubble message-bubble-model">
              <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          className="chat-input-field"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="chat-send-button" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;