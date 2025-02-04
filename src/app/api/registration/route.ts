import { NextRequest } from 'next/server';
import { registerResource } from '@/functions/registerResource';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const userdata = await request.json();
    if (userdata) {
      console.log(userdata)
      const { email, password, accessToken } = userdata;
      var urla = userdata.serverUrl
      if (email && password && accessToken) {
        console.log(email, password, accessToken, request.url);
        const [response, details] = await registerResource(email, password, accessToken, urla);
        console.log(response);
        // return json
        return new Response(JSON.stringify({
          success:true,
          details:details
        }), {
          headers: {
            "content-type": "application/json",
          },
        });
      } else {
        return new Response("Invalid data provided", { status: 400 });
      }
    } else {
      return new Response("No data provided", { status: 400 });
    }
  } catch (error) {
    console.error("Error parsing JSON");
    return new Response("Invalid JSON", { status: 400 });
  }
}
