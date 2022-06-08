import { Avatar, Flex, Kbd, Text, useColorModeValue } from "@chakra-ui/react";
import React, { FC } from "react";
import { useGetUserQuery } from "../../../features/user";
import IMessage from "../../../models/message.model";
import UserAvatar from "./UserAvatar";

export const SenderMessage: FC<{
  messageItem: IMessage;
  index: number;
}> = ({ messageItem, index }) => {
  const deleteMessageColor = useColorModeValue("gray.300", "gray.500");
  const elseMessageColor = useColorModeValue("#F6F9FA", "gray.600");
  const textColor = useColorModeValue("black", "white");
  const { data: sender } = useGetUserQuery(messageItem.sender._id);

  return (
    <Flex key={index} w="100%" my={1} align="start">
      <UserAvatar avatar={sender?.avatar} _id={messageItem.sender._id} />
      {messageItem.deleted ? (
        <Flex
          flexDir={"column"}
          align={"flex-end"}
          py={2}
          px={{ base: "4", sm: "6" }}
          bg={deleteMessageColor}
          shadow="lg"
          borderRadius={{ base: "md", sm: "xl" }}
          w="fit-content"
        >
          <Text opacity={0.5}>Tin nhắn đã bị gỡ</Text>
        </Flex>
      ) : (
        <Flex
          flexDir={"column"}
          align={"flex-start"}
          color={textColor}
          py={2}
          px={{ base: "4", sm: "6" }}
          bg={elseMessageColor}
          boxShadow={"lg"}
          borderRadius={{ base: "md", sm: "xl" }}
        >
          <Kbd shadow="md" color={useColorModeValue("black", "white")}>
            {sender?.displayName || "Anonymous"}
          </Kbd>
          <Text>{messageItem.message}</Text>
          <Text fontSize={11}>
            {new Date(messageItem.createdAt).toLocaleTimeString()}
            {messageItem.updated && " | đã chỉnh sửa"}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};
