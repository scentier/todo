let count = 0;

const Message = () => {
  console.log("Message called", count);
  // output
  // Message called 0
  // Message called 1

  count++;
  return <div>Message {count}</div>;
};

export default Message;
