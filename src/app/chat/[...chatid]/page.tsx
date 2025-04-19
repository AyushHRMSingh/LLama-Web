"use client";

import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleAction, ChatBubbleActionWrapper } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Mic, Paperclip, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { getChatHistory } from "@/functions/getChatHistory";
import { useAuth } from "@/context/user.context";
import { getResourceServer } from "@/functions/accessResource";
import { Loading } from "@/components/Loader";
import { chat } from "@/functions/chat";
import ReactMarkdown from 'react-markdown';

const ChatPage = ({ params }: { params: { chatid: string } }) => {
  const { chatid } = params;
  const [loading, setLoading] = useState(true);
  const [messages, setMessages]: any = useState([{}]);
  const { currentUser }: any = useAuth();
  const [serverDetails, setServerDetails] = useState({ token: "", addr: "" });
  const [isSending, setIsSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const resourceServer: any = await getResourceServer(currentUser);
        setServerDetails(resourceServer);
        const messageList: any = await getChatHistory(resourceServer.addr, resourceServer.token, chatid[0]);
        
        if (messageList.length > 0) {
          setMessages(messageList[0]);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, [currentUser, chatid]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    
    if (!message?.trim()) {
      setIsSending(false);
      return;
    }

    // Add user message
    setMessages((prevMessages: any) => [
      ...prevMessages,
      { id: prevMessages.length + 1, message, sender: 'user' },
    ]);
    
    // Reset the form
    e.currentTarget.reset();

    // Show loading state for AI response
    setMessages((prevMessages: any) => [
      ...prevMessages,
      { id: prevMessages.length + 1, message: '', sender: 'bot', isLoading: true },
    ]);

    chat(serverDetails.addr, serverDetails.token, chatid[0], message)
    .then((response:any) => {
      console.log("Response received:", response);
      // Update with actual response - Extract the message from response.output
      setMessages((prevMessages:any) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          id: updatedMessages.length,
          message: response[0],
          sender: 'bot',
        };
        console.log("updating chat with message:", response.output || response);
        return updatedMessages;
      });
    })
    try {
      // Get AI response
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error state
      setMessages((prevMessages: any) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          id: updatedMessages.length,
          message: "Sorry, there was an error processing your request.",
          sender: 'bot',
        };
        return updatedMessages;
      });
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center" aria-label="Loading chat">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] max-h-screen">
      <div className="flex-1 overflow-y-auto px-1 sm:px-4 py-2">
        <ChatMessageList className="max-w-full">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-center p-4">
              Start a new conversation by sending a message below
            </div>
          ) : (
            messages.map((message: any, index: number) => {
              const variant = message.sender === 'user' ? 'sent' : 'received';
              return (
                <ChatBubble 
                  key={`${message.id}-${index}`} 
                  variant={variant}
                  className="mb-3 sm:max-w-3/4 max-w-[90%]"
                >
                  <ChatBubbleAvatar 
                    fallback={variant === 'sent' ? 'US' : 'AI'} 
                    aria-label={variant === 'sent' ? 'User' : 'AI Assistant'}
                    className="hidden sm:flex" // Hide avatar on small screens
                  />
                  <ChatBubbleMessage 
                    isLoading={message.isLoading}
                    className="break-words w-full overflow-hidden"
                  >
                    <div className="prose prose-sm max-w-none overflow-hidden">
                      <ReactMarkdown components={{
                        p: ({node, ...props}) => <p className="whitespace-normal break-words" {...props} />,
                        pre: ({node, ...props}) => <pre className="overflow-x-auto w-full text-sm" {...props} />,
                        code: ({node, ...props}) => <code className="break-words whitespace-pre-wrap text-xs sm:text-sm" {...props} />,
                        a: ({node, ...props}) => <a className="break-words" {...props} />,
                        li: ({node, ...props}) => <li className="break-words" {...props} />
                      }}>
                        {message.message}
                      </ReactMarkdown>
                    </div>
                  </ChatBubbleMessage>
                  <ChatBubbleActionWrapper>
                    <ChatBubbleAction
                      className="size-6 sm:size-7"
                      icon={<span className="size-3 sm:size-4" role="img" aria-label="Like">👍</span>}
                      onClick={() => console.log('Action clicked for message ' + index)}
                    />
                  </ChatBubbleActionWrapper>
                </ChatBubble>
              );
            })
          )}
          <div ref={messageEndRef} />
        </ChatMessageList>
      </div>

      <div className="border-t p-1 sm:p-4 bg-background sticky bottom-0">
        <form
          ref={formRef}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring shadow-sm"
          onSubmit={handleSendMessage}
          aria-label="Chat message form"
        >
          <ChatInput
            name="message"
            placeholder="Type your message here..."
            className="min-h-10 sm:min-h-12 resize-none rounded-lg bg-background border-0 p-2 sm:p-3 pr-12 sm:pr-28 shadow-none focus-visible:ring-0"
            aria-label="Message input"
            disabled={isSending}
          />
          
          <div className="absolute right-1 sm:right-2 bottom-1 flex items-center gap-1 sm:gap-2">
            <Button 
              type="button"
              variant="ghost" 
              size="icon"
              className="hidden sm:flex"
              aria-label="Attach file"
              disabled={isSending}
            >
              <Paperclip className="size-4" />
            </Button>
    
            <Button 
              type="button"
              variant="ghost" 
              size="icon"
              className="hidden sm:flex"
              aria-label="Voice input"
              disabled={isSending}
            >
              <Mic className="size-4" />
            </Button>
    
            <Button
              type="submit"
              size="sm"
              className="text-xs sm:text-sm gap-1"
              disabled={isSending}
              aria-label="Send message"
            >
              {isSending ? 'Sending...' : 'Send'}
              <CornerDownLeft className="size-3 hidden sm:inline" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;