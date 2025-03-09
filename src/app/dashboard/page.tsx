"use client";
import { useEffect, useState } from "react";
import { getResourceServer } from "@/functions/accessResource";
import { getChatList } from "@/functions/getChatList";
import { useAuth } from '@/context/user.context';
import { Loading } from "@/components/Loader";
import { Button } from "@/components/ui/button"

import { AddChatDialog } from "@/components/addChatDialog";
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

import { ChatList } from "@/components/chatlist";
import { Form, set } from "react-hook-form";
import { getModelList } from "@/functions/getModelList";

export default function Page() {  
  const [data, setData] = useState([]); //final chatlist being passed to the rendering function
  const [loading, setLoading] = useState(true); //sets whether or not loading is triggered
  const { currentUser }: any = useAuth(); //standard auth to allow access
  const [serverDetails, setServerDetails] = useState({token:"", addr:""}); //resource server variables
  const [statusa, setStatusa] = useState({status: 0, message: ""}); //status variables for server
  const [modelList, setModelList] = useState<any[]>([]); //model list for the select dropdown
  
  // useEffect being used to fetch data from the server
  useEffect(() => {
    const fetchdata = async () => {
      const resourceServer = await getResourceServer(currentUser);
      // console.log(resourceServer);
      var [chatList, statusa]:any = await getChatList(resourceServer.addr, resourceServer.token);
      // var modellist = await getModelList(resourceServer.addr, resourceServer.token);
      // console.log(modellist)
      // console.log(chatList, statusa);
      const tempModelList = await getModelList(resourceServer.addr, resourceServer.token);
      console.log("tempModelList");
      console.log(tempModelList);
      setModelList(tempModelList?tempModelList:[]);
      setData(chatList?chatList:[]);
      setStatusa(statusa);
      setLoading(false);
      setServerDetails(resourceServer);
    }
    fetchdata();
    // console.log("DATA1: "+data)
  },[])
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  } else if (!loading) {
    console.log("ServerDetaiks: ",serverDetails.token);
    return (
      <div className="Container">
        <div className="ListNButton w-full">
          <ChatList 
            Statusa={statusa}
            Data={data}
          />
          <div className="AddButtonCont flex flex-row-reverse w-full ">
            <AddChatDialog 
              modelList={modelList}
              serverDetails={serverDetails}
            />
          {/* <Dialog>
            <DialogTrigger>
              <Button
              className="mr-3"
              onClick={()=>{
                console.log("clicked");
              }}>
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
              <Form>

              </Form>
            </DialogContent>
          </Dialog> */}
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