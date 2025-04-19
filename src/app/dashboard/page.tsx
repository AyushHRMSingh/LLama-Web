"use client";

import { useEffect, useState } from "react";
import { getResourceServer } from "@/functions/accessResource";
import { getChatList } from "@/functions/getChatList";
import { useAuth } from '@/context/user.context';
import { Loading } from "@/components/Loader";
import { AlertCircle, LayoutDashboard, MessageCircle, MoreVertical, Trash2 } from "lucide-react";
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";



import { AddChatDialog } from "@/components/addChatDialog";
// import { ChatList } from "@/components/chatlist";
import { getModelList } from "@/functions/getModelList";
import { pingServer } from "@/functions/pingServer";

export default function Page() {  
  const [data, setData] = useState([]); // final chatlist being passed to the rendering function
  const [loading, setLoading] = useState(true); // sets whether or not loading is triggered
  const { currentUser }: any = useAuth(); // standard auth to allow access
  const [serverDetails, setServerDetails] = useState({ token: "", addr: "" }); // resource server variables
  const [statusa, setStatusa] = useState({ status: 0, message: "" }); // status variables for server
  const [modelList, setModelList] = useState<any[]>([]); // model list for the select dropdown
  const [serverStatus, setServerStatus] = useState(false); // server status for the resource server

  const ServerMissing = () => {
    if (serverStatus == false) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your resources server is down or inaccessible, please ensure that it is up and running before accessing the service
          </AlertDescription>
        </Alert>
      );
    }
    return <div></div>;
  };
  
  // useEffect being used to fetch data from the server
  useEffect(() => {
    const fetchdata = async () => {
      const resourceServer: any = await getResourceServer(currentUser);
      const servStatus = await pingServer(resourceServer.addr, resourceServer.token);
      setLoading(false);
      setServerDetails(resourceServer);
      setServerStatus(servStatus);
      
      if (servStatus == true) {
        var [chatList, statusa]: any = await getChatList(resourceServer.addr, resourceServer.token);
        console.log("Server is up");
        const tempModelList = await getModelList(resourceServer.addr, resourceServer.token);
        console.log("tempModelList");
        console.log(tempModelList);
        setModelList(tempModelList ? tempModelList : []);
        setData(chatList ? chatList : []);
        setStatusa(statusa);
      } else {
        console.log("Server is down");
      }
    };
    fetchdata();
  }, []);

  // Function to handle chat deletion (placeholder for now)
  const handleDeleteChat = (chatId: string) => {
    console.log(`Deleting chat with ID: ${chatId}`);
    // Future implementation: Add API call to delete chat
    // After successful deletion, update the data state
    // setData(prevData => prevData.filter(chat => chat.ChatId !== chatId));
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  } else if (!loading) {
    console.log("ServerDetails: ", serverDetails.token);
    return (
      <div className="Container max-w-7xl mx-auto px-4 py-6">
        <div className="dashboard-header mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <LayoutDashboard className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
            <AddChatDialog 
              modelList={modelList}
              serverDetails={serverDetails}
            />
          </div>
          <p className="mt-2 text-gray-500 max-w-4xl">
            Manage your chats and AI conversations from this central dashboard
          </p>
        </div>
        
        <ServerMissing />
        <div className="w-full">
          <ChatList 
            Statusa={statusa}
            Data={data}
            onDeleteChat={handleDeleteChat}
          />
        </div>
      </div>
    );
  } else {
    return (
      <>
        Some error: {statusa.status} {statusa.message}
      </>
    );
  }
}

