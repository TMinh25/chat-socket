import { Box, Divider, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import IMessage from "../../models/message.model";
import Footer from "./footer";
import Header from "./header";
import Messages from "./message";
import { socket } from "../../App";
import { useAuth } from "../../hooks/useAuth";

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { currentUser } = useAuth();

  socket.on("message. type. all", function (msg) {
    const oldMessages = [...messages];
    oldMessages.push(msg);
    setMessages((val) => oldMessages);
    // window.scrollTo(0, document.body.scrollHeight);
  });

  const handleSendMessage = () => {
    if (!!inputMessage) {
      socket.emit("message. type. all", {
        message: inputMessage,
        sender: {
          _id: currentUser?._id,
          displayName: currentUser?.displayName,
        },
      } as IMessage);
      setInputMessage("");
    }
  };

  useEffect(() => console.log(messages), [messages]);

  // const handleSendMessage = () => {
  //   if (!inputMessage.trim().length) {
  //     return;
  //   }

  //   setMessages((old) => [
  //     ...old,
  //     {
  //       _id: "kasndkajsnda",
  //       sender: { _id: "", displayName: "" },
  //       message: "askdajksn",
  //     } as IMessage,
  //   ]);
  //   setInputMessage("");

  //   setTimeout(() => {
  //     setMessages((old) => [
  //       ...old,
  //       {
  //         _id: "kasndkajsnda",
  //         sender: { _id: "", displayName: "computer" },
  //         message: "askdajksn",
  //       } as IMessage,
  //     ]);
  //   }, 1000);
  // };

  return (
    <>
      <Flex h="100vh" flexDir="column">
        <Messages flex="1 1 auto" messages={messages} />
        <Footer
          flex="0 1 56px"
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
        />
      </Flex>
    </>
  );
};

export default Chat;
