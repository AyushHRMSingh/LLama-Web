"use client";
import { useEffect, useState } from "react";
import { getResourceServer } from "@/functions/accessResource";
import { getChatList } from "@/functions/getChatList";
import { useAuth } from '@/context/user.context';

export default function Page() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser }: any = useAuth();

  useEffect(() => {
    console.log("hellothere");
    const fetchdata = async () => {
      const resourceServer = await getResourceServer(currentUser);
      const chatList = await getChatList(resourceServer.addr, resourceServer.token);
      setData(chatList);
      setLoading(false);
    }
    fetchdata();
  },[])

  console.log("data");
  console.log(data);

  if (loading) {
    return (
      <div>
        <h1>Dashboard Loading</h1>
      </div>
    );
  } else {
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
  }
}