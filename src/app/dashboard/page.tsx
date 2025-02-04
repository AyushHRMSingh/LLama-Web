"use client";
import { useEffect, useState } from "react";
import { getResourceServer } from "@/functions/accessResource";
import { getChatList } from "@/functions/getChatList";
import { useAuth } from '@/context/user.context';
import { Loading } from "@/components/Loader";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCirclePlus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function ChatList({Statusa, Data}:any) {
  console.log("statusa, data.length>0");
  console.log(Statusa, Data.length>0);
  let list;
  console.log(Statusa)
  if (Statusa.status == 200 && Data.length == 0) {
    return (
      <div>
        <h1>Dashboard</h1>
        <div className="ListCont w-full ">
          <ul>
            <li>
              <div className="flex flex-row place-content-between m-3 p-5 border-2 hover:bg-gray-800 rounded-lg">
                <div>No Chats</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    )
    
  } else if (Statusa.status == 200 && Data.length > 0) {
    return (
      <div>
        <h1>Dashboard</h1>
        <div className="ListCont w-full ">
          <ul>
            {Data.map((item: any) => (
              <li key={item.ChatId}>
                <a 
                  // onClick={ () => {
                  //   console.log(item);
                  //   window.location.href = '/chat/' + item.ChatId;
                  // }}
                  href={'/chat/' + item.ChatId}
                >
                  <div className="flex flex-row place-content-between m-3 p-5 border-2 hover:bg-gray-800 rounded-lg">
                    <div>{item.Title}</div>
                    <div>{item.Model}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default function Page() {  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser }: any = useAuth();
  const [statusa, setStatusa] = useState({status: 0, message: ""});
  
  useEffect(() => {
    console.log("hellothere");
    const fetchdata = async () => {
      const resourceServer = await getResourceServer(currentUser);
      var [chatList, statusa]:any = await getChatList(resourceServer.addr, resourceServer.token);
      console.log(chatList, statusa);
      setData(chatList?chatList:[]);
      setStatusa(statusa);
      setLoading(false);
    }
    fetchdata();
    console.log("DATA1: "+data)
  },[])
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  } else if (!loading) {
    return (
      <div className="Container">
        <div className="ListNButton w-full">
          <ChatList 
            Statusa={statusa}
            Data={data}
          />
          <div className="AddButtonCont flex flex-row-reverse w-full ">
          <Dialog>
            <DialogTrigger>
              <Button
              className="mr-3">
                Add Chat
                <MessageCirclePlus className="ml-1" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Add Chat
                </DialogTitle>
                <DialogDescription>
                  Select a model from the list and create a new chat
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <>
        Some error: {statusa.status} {statusa.message}
      </>
    )
  }
}