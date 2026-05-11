import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { chatWithFarmAI, generateFarmContext, getQuickAISuggestions } from '../services/aiChatService';

const AIChat = () => {
  const { trays, sensorData, aiScores } = useApp();
  const { t } = useLanguage();
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  // Generate farm context and suggestions on mount/data change
  useEffect(() => {
    const farmContext = generateFarmContext(trays, sensorData, aiScores);
    const suggestions = getQuickAISuggestions(farmContext);
    setQuickSuggestions(suggestions);
  }, [trays, sensorData, aiScores]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  // Handle message submission
  const handleSendMessage = async (messageText = null) => {
    const messageToSend = messageText || userInput.trim();
    if (!messageToSend) return;

    // Add user message to history
    const updatedHistory = [...conversationHistory, { role: 'user', content: messageToSend }];
    setConversationHistory(updatedHistory);
    setUserInput('');
    setIsLoading(true);

    try {
      const farmContext = generateFarmContext(trays, sensorData, aiScores);
      const aiResponse = await chatWithFarmAI(messageToSend, farmContext, updatedHistory.slice(0, -1));

      // Add AI response to history
      setConversationHistory((prev) => [
        ...prev,
        { role: 'assistant', content: aiResponse },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setConversationHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick suggestion click
  const handleQuickSuggestion = (suggestion) => {
    // Map severity to emoji and prefix
    const prefixMap = {
      warning: '⚠️',
      info: 'ℹ️',
      success: '✅',
    };
    const userQuestion = `${prefixMap[suggestion.severity]} ${suggestion.message}`;
    handleSendMessage(userQuestion);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('aiChatTitle', 'AI Farm Assistant')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('aiChatDescription', 'Ask questions about your AI recommendations and farm data to improve your vertical farm.')}</p>
      </div>

      {/* Quick Suggestions */}
      {quickSuggestions.length > 0 && conversationHistory.length === 0 && (
        <div className="mb-6 grid gap-3">
          <p className="text-sm font-semibold text-slate-500 uppercase">{t('quickSuggestionsLabel', 'Quick Suggestions')}</p>
          <div className="space-y-2">
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="w-full text-left rounded-3xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition"
              >
                <p className="text-sm text-slate-700 dark:text-slate-300">{suggestion.message}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-6 rounded-3xl bg-slate-50 dark:bg-slate-900 p-6 space-y-4">
        {conversationHistory.length === 0 && quickSuggestions.length === 0 && (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-5xl mb-3">🤖</p>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('startChatting', 'Start Chatting with Your AI Assistant')}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t('askAboutRecommendations', 'Ask about your AI recommendations, sensor data, or ways to improve your farm.')}</p>
            </div>
          </div>
        )}

        {conversationHistory.map((message, idx) => (
          <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md rounded-3xl px-5 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-3xl rounded-bl-none px-5 py-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
              handleSendMessage();
            }
          }}
          placeholder={t('askAQuestion', 'Ask a question about your farm...')}
          disabled={isLoading}
          className="flex-1 rounded-3xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-5 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !userInput.trim()}
          className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-6 py-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('sending', 'Sending...') : t('send', 'Send')}
        </button>
      </div>

      {/* Info footer */}
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
        <p>{t('aiChatFooter', 'AI responses are based on your current farm data and recommendations.')}</p>
      </div>
    </div>
  );
};

export default AIChat;
