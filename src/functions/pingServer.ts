export async function pingServer(addr:string, accessToken:string) {
    console.log("pingserver");
    console.log("pingserverLALALAL");
    // console.log(addr, accessToken);
    let addra = addr;
    try{
      const result  = await fetch(addra,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken,
        })
      })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
            return false;
        }
      })
      // .then((response) => response.json())
      .then((data) => {
        if (data == false) {
          return false;
        }
        if (data.success != true) {
          console.log("error");
          return false;
        }
        console.log("success");
        return true;
      })
      return result;
    } catch (e) {
      console.log("error");
      console.log(e);
      return false;
    }
  }