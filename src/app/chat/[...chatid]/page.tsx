

const ChatPage = ({ params }: { params: { chatid: string } }) => {
  const { chatid } = params;
  
  return (
    <div>
      <h1>Chat ID: {chatid}</h1>
      <p>This page is dynamically generated based on the ID in the URL.</p>
    </div>
  );
};

export default ChatPage;
