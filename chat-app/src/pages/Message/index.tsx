import {
  Box,
  BoxProps,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useGetAllGenenralMessagesQuery } from "../../features/chat";
import { chatSocket } from "../../features/chat/socketManager";
import { useAppState } from "../../hooks/useAppState";
import { useAuth } from "../../hooks/useAuth";
import IMessage from "../../models/message.model";
import Footer from "./footer";
import MessagesBox from "./message";

chatSocket.connect();

const Chat = ({ ...rest }: BoxProps) => {
  const { data, isLoading, refetch, isFetching } =
    useGetAllGenenralMessagesQuery();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatSocketErrorToast = "toast-error-chat-socket";
  const chatSocketSuccessToast = "toast-success-chat-socket";
  const { toast } = useAppState();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!isLoading && !isFetching && data) {
      setMessages(data);
    }
  }, [data]);

  const handleSendMessage = () => {
    if (!!inputMessage.trim()) {
      chatSocket.emit("message all", {
        message: inputMessage,
        sender: {
          _id: currentUser?._id,
          displayName: currentUser?.displayName,
        },
      } as IMessage);
      setInputMessage("");
    }
  };

  const handleUpdateMessage = async (message: string, _id?: string) => {
    if (!!_id && !!message) {
      chatSocket.emit("update message", { _id, message });
    }
  };

  const handleDeleteMessage = (_id?: string): void => {
    if (!!_id) {
      chatSocket.emit("delete message", _id);
    }
  };

  // useEffect(() => {
  // console.log("initialize chat socket listener");
  chatSocket.once("connect", () => {
    if (currentUser && currentUser?._id) {
      chatSocket.emit("online", { userId: currentUser._id });
    }
    if (!toast.isActive(chatSocketSuccessToast)) {
      if (toast.isActive(chatSocketErrorToast))
        toast.close(chatSocketErrorToast);
      toast({
        id: chatSocketSuccessToast,
        status: "success",
        title: "Khôi phục kết nối!",
      });
    }
  });
  chatSocket.once("user connected", (users) => {
    console.log(users);
  });
  chatSocket.once("disconnect", () => {
    if (currentUser && currentUser?._id) {
      chatSocket.emit("offline", { userId: currentUser._id });
    }
  });
  chatSocket.once("error", (error) => {
    if (
      error.message === "xhr poll error" &&
      !toast.isActive(chatSocketErrorToast)
    ) {
      toast.close(chatSocketSuccessToast);
      toast({
        id: chatSocketErrorToast,
        status: "error",
        title: "Mất kết nối!",
        description: "Vui lòng đợi để kết nối lại với máy chủ...",
        duration: null,
      });
    }
  });
  chatSocket.on("message all", (msg) => {
    const oldMessages = [...messages];
    oldMessages.push(msg);
    setMessages(oldMessages);
  });
  chatSocket.on("update message result", ({ message, updated }) => {
    console.log(message, updated);
    if (updated) {
      const oldMessages = [...messages];
      const messageIndex = oldMessages.findIndex(
        (val) => val._id === message._id
      );
      oldMessages[messageIndex] = message;
      setMessages(oldMessages);
      // refetch();
    } else {
      toast({
        status: "error",
        title: "Đã có lỗi xảy ra!",
        description: "Hãy thử lại sau",
      });
    }
  });
  chatSocket.on("delete message result", ({ message, deleted }) => {
    console.log(message, deleted);
    if (deleted) {
      const oldMessages = [...messages];
      const messageIndex = oldMessages.findIndex(
        (val) => val._id === message._id
      );
      console.log(messageIndex);
      oldMessages[messageIndex] = message as IMessage;
      setMessages(oldMessages);
      // refetch();
    } else {
      toast({
        status: "error",
        title: "Đã có lỗi xảy ra!",
        description: "Hãy thử lại sau",
      });
    }
  });
  // }, []);

  useEffect(() => console.log(messages), [messages]);

  // useEffect(() => {
  //   return function () {
  //     chatSocket.off("update message result");
  //     chatSocket.off("delete message result");
  //     chatSocket.off("message all");
  //     chatSocket.off("connect");
  //     // chatSocket.disconnect();
  //   };
  // }, []);

  return (
    <>
      <Box flex="1 1 auto" {...rest}>
        <Flex h="100%" flexDir="column">
          <Flex overflowY="scroll" flexDirection="column" px="8" py="4">
            {isLoading ? (
              <MessageSkeleton />
            ) : (
              <MessagesBox
                flex="1 1 auto"
                messages={messages}
                onDeleteMessage={handleDeleteMessage}
                onUpdateMessage={handleUpdateMessage}
              />
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
      </Box>
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
      <Flex key={"message-skeleton-5"} w="100%" my={1}>
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
