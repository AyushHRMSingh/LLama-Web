import { NextRequest } from 'next/server';
import { registerResource } from '@/functions/registerResource';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const ip = headers().get("x-forwarded-for") || "";
    console.log(ip)
    const userdata = await request.json();
    if (userdata) {
      const { email, password, accessToken } = userdata;

      if (email && password && accessToken) {
        console.log(email, password, accessToken, request.url);
        const response = await registerResource(email, password, accessToken, ip);
        console.log(response);
        // return json
        return new Response(JSON.stringify({
          success:true,
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
