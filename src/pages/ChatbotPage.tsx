import React from "react";
import { Helmet } from "react-helmet";
import ChatbotFeature from "@/components/chatbot/ChatbotFeature";

const ChatbotPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>AI Medical Chatbot | Medgen AI</title>
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Medical Chatbot</h1>
          <p className="text-gray-600">
            Ask medical questions and get AI-powered responses based on the
            latest medical knowledge.
          </p>
        </div>
        <div className="h-[calc(100vh-220px)]">
          <ChatbotFeature />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
