"use client";

import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleAction, ChatBubbleActionWrapper } from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getChatHistory } from "@/functions/getChatHistory";
import { useAuth } from "@/context/user.context";
import { getResourceServer } from "@/functions/accessResource";
import { Loading } from "@/components/Loader";
import { chat } from "@/functions/chat";
import ReactMarkdown from 'react-markdown';


// const messages = [
//   {
//     id: 1,
//     message: 'Hello, how has your day been? I hope you are doing well.',
//     sender: 'user',
//   },
//   {
//     id: 2,
//     message: 'Hi, I am doing well, thank you for asking. How can I help you today?',
//     sender: 'bot',
//   },
//   {
//     id: 3,
//     sender: 'bot',
//     isLoading: true,
//   },
// ];

const ChatPage = ({ params }: { params: { chatid: string } }) => {
  const { chatid } = params;
  const [loading, setLoading] = useState(true); //sets whether or not loading is triggered
  const [messages, setMessages]:any = useState([{}]); //state to manage messages
  const { currentUser }: any = useAuth(); //standard auth to allow access
  const [serverDetails, setServerDetails] = useState({token:"", addr:""}); //resource server variables

  useEffect(()=> {
    const fetchdata = async () => {
      const resourceServer:any = await getResourceServer(currentUser);
      setServerDetails(resourceServer);
      var messageList:any = await getChatHistory(resourceServer.addr, resourceServer.token, chatid[0]);
      console.log("messageList", messageList);
      if (messageList.length > 0) {
        console.log("greater")
        setMessages(messageList[0]);
      } else {
        console.log("ngreater")
        setMessages([])
      }
      setLoading(false);
    }
    fetchdata();
  },[])

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col h-[92vh]">
        {/* <h1>Chat ID: {chatid}</h1> */}
        <ChatMessageList>
          {messages.map((message:any, index:number) => {
            console.log("message", message);
            const variant = message.sender === 'user' ? 'sent' : 'received';
            return (
              <ChatBubble key={message.id} variant={variant}>
                <ChatBubbleAvatar fallback={variant === 'sent' ? 'US' : 'AI'} />
                <ChatBubbleMessage isLoading={message.isLoading}>
                  <ReactMarkdown>
                    {message.message}
                  </ReactMarkdown>
                </ChatBubbleMessage>
                <ChatBubbleActionWrapper>
                  <ChatBubbleAction
                    className="size-7"
                    icon={<span className="size-4">👍</span>}
                    onClick={() => console.log('Action clicked for message ' + index)}
                  />
                </ChatBubbleActionWrapper>
              </ChatBubble>
            );
          })}
        </ChatMessageList>
  
        <form
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1 m-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const message = formData.get('message');
            if (message) {
              setMessages((prevMessages:any) => [
                ...prevMessages,
                { id: prevMessages.length + 1, message, sender: 'user' },
              ]);
              e.currentTarget.reset();
            }
            // set ai message is loading
            setMessages((prevMessages:any) => [
              ...prevMessages,
              { id: prevMessages.length + 1, message: '', sender: 'bot', isLoading: true },
            ]);
            // now get response from the server
            chat(serverDetails.addr, serverDetails.token, chatid[0], message).then((response:any) => {
              console.log("response", response);
              setMessages((prevMessages:any) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = {
                  id: updatedMessages.length,
                  message: response,
                  sender: 'bot',
                };
                return updatedMessages;
              });
            });
          }}
        >
          <ChatInput
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">

            <Button variant="ghost" size="icon">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>
  
            <Button variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>
  
            <Button
              size="sm"
              className="ml-auto gap-1.5"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    );
  }
};

export default ChatPage;