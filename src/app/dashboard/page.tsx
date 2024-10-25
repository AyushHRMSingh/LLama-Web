"use client";
import { useEffect, useState } from "react";
import { getResourceServer } from "@/functions/accessResource";
import { getChatList } from "@/functions/getChatList";
import { useAuth } from '@/context/user.context';
import { Loading } from "@/components/Loader";

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
      setData(chatList);
      setStatusa(statusa);
      setLoading(false);
    }
    fetchdata();
  },[])

  console.log("statusa, data.length>0");
  console.log(statusa, data.length>0);

  console.log(statusa)
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  } else if (!loading && statusa.status == 200 && data.length == 0) {
    return (
      <div>
        <h1>Dashboard</h1>
        <div className="Container w-full ">
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
  } else if (!loading && statusa.status == 200 && data.length > 0) {
    return (
      <div>
        <h1>Dashboard</h1>
        <div className="Container w-full ">
          <ul>
            {data.map((item: any) => (
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
  } else {
    return (
      <>
        Some error: {statusa.status} {statusa.message}
      </>
    )
  }
}