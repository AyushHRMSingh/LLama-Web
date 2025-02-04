import { useAuth } from '@/context/user.context';
import { auth, getResource, signInUserWithEmailAndPassword, updateResource } from '@/lib/firebase';

export async function getResourceServer(currentUser:any) {
  
  var jsonuser = JSON.parse(JSON.stringify(currentUser));
  if (jsonuser != null) {
    var data = await getResource(jsonuser);
    const token = data.accessToken;
    const addr = data.url;
    return {token,addr};
  } else {
    return {};
  }
}