import React from "react";
import { Helmet } from "react-helmet";
import ChatInterface from "@/components/chatbot/ChatInterface";
import AuthGuard from "@/components/auth/AuthGuard";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Chatbot = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white p-6 md:p-8 overflow-y-auto h-full">
        <Helmet>
          <title>AI Chatbot | Medgen AI</title>
        </Helmet>

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                AI Medical Chatbot
              </h1>
              <p className="text-muted-foreground mt-2">
                Ask medical questions and get AI-powered responses
              </p>
            </div>
          </div>

          <Alert className="bg-[#f5f5f7] border-0 rounded-xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-medium">
              Important Disclaimer
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              This AI assistant is not a replacement for professional medical
              advice. Always consult with a healthcare provider for diagnosis
              and treatment.
            </AlertDescription>
          </Alert>

          <div className="apple-card bg-white p-0 overflow-hidden">
            <ChatInterface />
          </div>

          <div className="apple-card bg-white p-8">
            <h2 className="text-xl font-semibold mb-6">About This Feature</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The AI Medical Chatbot uses advanced natural language processing
              to understand your medical questions and provide informative
              responses. While it can offer general medical information and
              guidance, it's important to remember:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#f5f5f7] p-6 rounded-xl">
                <h3 className="font-medium mb-3">How to Use</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      1
                    </span>
                    <span>Type your medical question in the chat input</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </span>
                    <span>
                      Provide additional details if prompted by the AI
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      3
                    </span>
                    <span>
                      Review the AI's response and ask follow-up questions
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#f5f5f7] p-6 rounded-xl">
                <h3 className="font-medium mb-3">Important Notes</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      !
                    </span>
                    <span>
                      Always consult with a healthcare provider for diagnosis
                      and treatment
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      !
                    </span>
                    <span>
                      In case of emergency, call your local emergency services
                      immediately
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      !
                    </span>
                    <span>
                      Your chat history is saved to your account for future
                      reference
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Chatbot;
