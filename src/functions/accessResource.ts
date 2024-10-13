import { useAuth } from '@/context/user.context';
import { auth, getResource, signInUserWithEmailAndPassword, updateResource } from '@/lib/firebase';

export async function getResourceServer() {
  const { currentUser }: any = useAuth();
  var jsonuser = JSON.parse(JSON.stringify(currentUser));
  if (jsonuser != null) {
    console.log('usera:', jsonuser);
    console.log('userb:', jsonuser.uid);
    var data = await getResource(jsonuser);
    console.log('data:', data);
    const token = data.accessToken;
    const addr = data.ip;
    return {token,addr};
  } else {
    return {};
  }
}