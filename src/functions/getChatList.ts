export async function getChatList(addr:string, accessToken:string) {
  console.log("getChatList");
  let addra;
  if (addr.split(".").length == 4) {
    addra = `http://${addr}:2077/getchatlist`;
  } else {
    addra = `http://[${addr}]:2077/getchatlist`;
  }
  return await fetch(addra,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken: accessToken,
    })
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.success != true) {
      console.log("error");
      return [];
    } else {
      console.log("success");
      return data.chatList;
    }
  })
}