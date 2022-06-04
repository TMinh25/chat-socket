import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Flex,
  Kbd,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import IMessage from "../../models/message.model";
import Footer from "./footer";
import MessagesBox from "./message";
import { useAppState } from "../../hooks/useAppState";
import {
  useGetAllGenenralMessagesQuery,
  useUpdateGeneralMessageMutation,
  useDeleteGeneralMessageMutation,
} from "../../features/chat";
import { chatSocket } from "../../features/chat/socketManager";

chatSocket.connect();

const Chat = () => {
  const { data, isLoading, refetch } = useGetAllGenenralMessagesQuery();
  const [deleteMessage, deleteMessageResult] =
    useDeleteGeneralMessageMutation();
  const [updateMessage, updateMessageResult] =
    useUpdateGeneralMessageMutation();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useAppState();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!isLoading && data) {
      setMessages(data);
    }
  }, [data]);

  chatSocket.on("connect", () => {
    if (currentUser && currentUser?._id) {
      chatSocket.emit("online", { userId: currentUser._id });
    }
  });

  chatSocket.on("message all", function (msg) {
    const oldMessages = [...messages];
    oldMessages.push(JSON.parse(msg));
    setMessages((val) => oldMessages);
  });

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

  const handleUpdateMessage = async (message: string, _id?: string) => {
    try {
      if (!!_id && !!message) {
        const result = await updateMessage({ _id, message }).unwrap();
        toast({
          status: "success",
          title: result,
        });
      }
    } catch (error) {
      toast({
        status: "error",
        title: "Lỗi",
        description: (error as any).toString(),
      });
    } finally {
      refetch();
    }
  };

  const handleDeleteMessage = (_id?: string): void => {
    try {
      if (!!_id) {
        deleteMessage(_id);
      }
    } catch (error) {
      toast({
        status: "error",
        title: "Lỗi",
        description: (error as any).toString(),
      });
    } finally {
      refetch();
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
