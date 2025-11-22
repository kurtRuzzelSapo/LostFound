// components/chatInterface.tsx
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/use-chat';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Users, MessageSquare, Menu, X } from 'lucide-react';

interface ChatInterfaceProps {
  otherUserId?: string; // For starting a chat with specific user
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ otherUserId }) => {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [initializing, setInitializing] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { user } = useAuth();
  const {
    conversations,
    messages,
    loading,
    sending,
    getOrCreateConversation,
    sendMessage,
    fetchMessages,
    subscribeToMessages,
    markAsRead,
  } = useChat();

  // Get active conversation details for tab title
  const activeConversationDetails = activeConversation 
    ? conversations.find(conv => conv.id === activeConversation)
    : null;

  // Update browser tab title with active chat
  useEffect(() => {
    if (activeConversationDetails) {
      const otherUserName = activeConversationDetails.other_user.full_name || 
                           activeConversationDetails.other_user.email || 
                           'User';
      document.title = `Chat with ${otherUserName} - Lost & Found`;
    } else {
      document.title = 'Messages - Lost & Found';
    }

    return () => {
      document.title = 'Lost & Found';
    };
  }, [activeConversationDetails]);

  // Initialize conversation if otherUserId is provided
  useEffect(() => {
    const initializeChat = async () => {
      console.log('🔄 initializeChat called');
      console.log('otherUserId:', otherUserId);
      console.log('user:', user?.id);
      
      if (otherUserId && user && user.id !== otherUserId) {
        console.log('🚀 Starting chat initialization...');
        setInitializing(true);
        try {
          console.log('📞 Calling getOrCreateConversation with:', otherUserId);
          const conversationId = await getOrCreateConversation(otherUserId);
          console.log('📝 Conversation ID result:', conversationId);
          
          if (conversationId) {
            console.log('✅ Success! Setting active conversation:', conversationId);
            setActiveConversation(conversationId);
            console.log('📨 Fetching messages...');
            await fetchMessages(conversationId);
            console.log('👀 Marking as read...');
            await markAsRead(conversationId);
            console.log('🎉 Chat initialization complete!');
            
            // On mobile, hide conversations list after selecting
            if (window.innerWidth < 768) {
              setShowMobileConversations(false);
            }
          } else {
            console.log('❌ Failed to get conversation ID - returned null');
          }
        } catch (error) {
          console.error('💥 Error initializing chat:', error);
        } finally {
          console.log('🏁 Setting initializing to false');
          setInitializing(false);
        }
      } else {
        console.log('⏸️ Skipping initialization - missing requirements:');
        console.log('   otherUserId:', otherUserId);
        console.log('   user:', user?.id);
        console.log('   same user:', user?.id === otherUserId);
      }
    };

    initializeChat();
  }, [otherUserId, user]);

  const handleSelectConversation = async (conversationId: string) => {
    setActiveConversation(conversationId);
    await fetchMessages(conversationId);
    if (user) {
      await markAsRead(conversationId);
    }
    
    // On mobile, hide conversations list after selecting
    if (window.innerWidth < 768) {
      setShowMobileConversations(false);
    }
  };

  const handleSendMessage = async () => {
    if (!activeConversation || !message.trim() || !user) return;

    await sendMessage(activeConversation, message);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'; // Max height 120px
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift + Enter: new line
        return;
      } else {
        // Enter: send message
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  // Subscribe to new messages
  useEffect(() => {
    if (activeConversation) {
      const unsubscribe = subscribeToMessages(activeConversation);
      return unsubscribe;
    }
  }, [activeConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format message content with proper line breaks and word wrapping
  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index} className={index > 0 ? 'mt-1' : ''}>
        {line}
      </div>
    ));
  };

  // Show loading state when initializing with otherUserId
  if (initializing) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Starting conversation...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[90vh] max-h-[1000px] over-flow-hidden border rounded-lg bg-white shadow-lg">
      {/* Mobile Header */}
      <div className="md:hidden absolute top-4 left-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMobileConversations(!showMobileConversations)}
          className="bg-white/90 backdrop-blur-sm shadow-sm"
        >
          {showMobileConversations ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Conversations List */}
      <div className={`
        ${showMobileConversations ? 'flex' : 'hidden'} 
        md:flex md:w-1/3 lg:w-1/4 border-r absolute md:relative 
        top-0 left-0 w-full h-full bg-white z-10 md:z-auto shadow-lg md:shadow-none overflow-hidden
      `}>
        <div className="mt-20 w-full flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Conversations
              {conversations.length > 0 && (
                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                  {conversations.length}
                </span>
              )}
            </h2>
          </div>
          <ScrollArea className="flex-1">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No conversations yet</p>
                {otherUserId && (
                  <p className="text-xs mt-2 text-gray-400">
                    Starting new conversation...
                  </p>
                )}
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                    activeConversation === conversation.id 
                      ? 'bg-blue-50 border-blue-200 shadow-inner' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="flex-shrink-0 w-10 h-10">
                      <AvatarFallback className="text-sm font-medium">
                        {conversation.other_user.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">
                        {conversation.other_user.full_name || conversation.other_user.email}
                      </p>
                      {conversation.last_message && (
                        <p className="text-xs text-gray-500 truncate mt-1 leading-relaxed">
                          {conversation.last_message.content.length > 60 
                            ? `${conversation.last_message.content.substring(0, 60)}...`
                            : conversation.last_message.content
                          }
                        </p>
                      )}
                      {conversation.last_message && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(conversation.last_message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden overflow-scroll">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="md:hidden w-10 h-10">
                  <AvatarFallback className="text-sm font-medium">
                    {activeConversationDetails?.other_user.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate text-lg">
                    {activeConversationDetails?.other_user.full_name || 
                     activeConversationDetails?.other_user.email || 
                     'User'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {messages.length > 0 
                      ? `${messages.length} message${messages.length === 1 ? '' : 's'}`
                      : 'No messages yet'
                    }
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setShowMobileConversations(true)}
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4 max-w-6xl mx-auto w-full">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-16">
                      <MessageSquare className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                      <p className="text-xl font-medium mb-2">No messages yet</p>
                      <p className="text-sm max-w-md mx-auto">
                        Start the conversation by sending a message! You can discuss item details, 
                        arrange meetups, or ask questions about the lost/found item.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] rounded-2xl p-4 break-words shadow-sm ${
                            msg.sender_id === user?.id
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-900 rounded-bl-none border'
                          }`}
                        >
                          <div className="text-base leading-relaxed whitespace-pre-wrap">
                            {formatMessageContent(msg.content)}
                          </div>
                          <p
                            className={`text-xs mt-3 ${
                              msg.sender_id === user?.id
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t bg-white sticky bottom-0">
                <div className="max-w-6xl mx-auto w-full">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 min-w-0">
                      <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                        disabled={sending || !user}
                        rows={1}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[48px] max-h-[120px]"
                        style={{ overflow: 'hidden' }}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={sending || !message.trim() || !user}
                      className="flex-shrink-0 h-12 w-12 rounded-full"
                      size="icon"
                    >
                      {sending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Press Enter to send • Shift + Enter for new line
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center p-8 max-w-md">
              <MessageSquare className="w-24 h-24 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-medium mb-3">No conversation selected</h3>
              <p className="text-base mb-6">
                {otherUserId && !initializing 
                  ? "Could not start conversation. Please try selecting one from the list."
                  : "Select a conversation from the list to start chatting"
                }
              </p>
              {!otherUserId && (
                <Button
                  variant="outline"
                  className="mt-2 md:hidden"
                  onClick={() => setShowMobileConversations(true)}
                  size="lg"
                >
                  <Menu className="w-5 h-5 mr-2" />
                  Show Conversations
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};