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