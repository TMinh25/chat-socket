import {
  Avatar,
  Box,
  Flex,
  Kbd,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import io, { Manager, Socket } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth";
import IMessage from "../../models/message.model";
import config from "../../config";
import Footer from "./footer";
import MessagesBox from "./message";
import { useAppState } from "../../hooks/useAppState";
import { useGetAllGenenralMessagesQuery } from "../../features/chat";

export const socketManager = new Manager(config.server.url, {
  autoConnect: false,
  transports: ["websocket", "polling", "flashsocket"],
});

export const chatSocket: Socket = io("http://localhost:5000", {
  withCredentials: true,
});

const Chat = () => {
  const { data, isLoading } = useGetAllGenenralMessagesQuery();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useAppState();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!isLoading && data) {
      setMessages(data);
    }
  }, [data]);

  chatSocket.on("message all", function (msg) {
    const oldMessages = [...messages];
    oldMessages.push(JSON.parse(msg));
    setMessages((val) => oldMessages);
    // window.scrollTo(0, document.body.scrollHeight);
  });

  // socket.emit("hello", "akjsndkjans");

  const handleSendMessage = () => {
    if (!!inputMessage) {
      chatSocket.emit(
        "message all",
        JSON.stringify({
          message: inputMessage,
          sender: {
            _id: currentUser?._id,
            displayName: currentUser?.displayName,
          },
          createdAt: new Date(),
        } as IMessage)
      );
      setInputMessage("");
    }
  };

  useEffect(() => {
    chatSocket.io.on("error", (error) => {
      if (error.message === "xhr poll error") {
        toast.closeAll();
        toast({
          status: "error",
          title: "Mất kết nối!",
          description: "Vui lòng đợi để kết nối lại với máy chủ...",
        });
      }
    });
  });

  useEffect(() => console.log(messages), [messages]);

  return (
    <>
      <Flex h="100%" flexDir="column">
        <Flex overflowY="scroll" flexDirection="column" px="8" py="4">
          {isLoading ? (
            <MessageSkeleton />
          ) : (
            <MessagesBox flex="1 1 auto" messages={messages} />
          )}
        </Flex>
        <Spacer />
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

const MessageSkeleton = () => {
  const selfMessageColor = useColorModeValue("messenger.500", "messenger.500");
  const elseMessageColor = useColorModeValue("#F6F9FA", "gray.600");
  const textColor = useColorModeValue("black", "white");
  return (
    <>
      <Flex key={"message-skeleton-1"} w="100%" justify="flex-end" my={1}>
        <Box
          color={"white"}
          py={2}
          px={{ base: "4", sm: "6" }}
          bg={selfMessageColor}
          shadow="lg"
          borderRadius={{ base: "none", sm: "xl" }}
          w="25%"
        >
          <SkeletonText my="4" noOfLines={4} spacing="2" />
        </Box>
      </Flex>
      <Flex key={"message-skeleton-2"} w="100%" my={1}>
        <SkeletonCircle size="10" />
        <Box
          color={textColor}
          ml={2}
          py={2}
          px={{ base: "4", sm: "6" }}
          bg={elseMessageColor}
          boxShadow={"lg"}
          borderRadius={{ base: "none", sm: "xl" }}
          w="25%"
          pb={2}
        >
          <SkeletonText my="4" noOfLines={2} spacing="2" />
        </Box>
      </Flex>
      <Flex key={"message-skeleton-3"} w="100%" justify="flex-end" my={1}>
        <Box
          color={"white"}
          py={2}
          px={{ base: "4", sm: "6" }}
          bg={selfMessageColor}
          shadow="lg"
          borderRadius={{ base: "none", sm: "xl" }}
          w="20%"
          pb={2}
        >
          <SkeletonText my="4" noOfLines={5} spacing="2" />
        </Box>
      </Flex>
      <Flex key={"message-skeleton-4"} w="100%" justify="flex-end" my={1}>
        <Box
          color={"white"}
          py={2}
          px={{ base: "4", sm: "6" }}
          bg={selfMessageColor}
          shadow="lg"
          borderRadius={{ base: "none", sm: "xl" }}
          w="35%"
          pb={2}
        >
          <SkeletonText my="4" noOfLines={3} spacing="2" />
        </Box>
      </Flex>
      <Flex key={"message-skeleton-2"} w="100%" my={1}>
        <SkeletonCircle size="10" />
        <Box
          color={textColor}
          ml={2}
          py={2}
          px={{ base: "4", sm: "6" }}
          bg={elseMessageColor}
          boxShadow={"lg"}
          borderRadius={{ base: "none", sm: "xl" }}
          w="25%"
          pb={2}
        >
          <SkeletonText my="4" noOfLines={2} spacing="2" />
        </Box>
      </Flex>
    </>
  );
};

export default Chat;
