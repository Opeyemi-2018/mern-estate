import conversation from "../assets/images/conversation.png";
const Messaging = () => {
  return (
    <div className="flex items-center mt-20 justify-center">
      <div>
        <p>Messaging</p>
        <img src={conversation} alt="" className="w-40 h-40" />
      </div>
    </div>
  );
};

export default Messaging;
