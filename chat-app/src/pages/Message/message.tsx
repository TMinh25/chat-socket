import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  Kbd,
  Link,
  Tag,
  Text,
  useColorModeValue,
  Spacer,
} from "@chakra-ui/react";
import React, { FC, useEffect, useRef } from "react";
import { useGetUserQuery } from "../../features/user";
import { useAuth } from "../../hooks/useAuth";
import IMessage from "../../models/message.model";
import { Link as RouterLink } from "react-router-dom";

const MessagesBox: React.FC<{ messages: IMessage[] } & FlexProps> = ({
  messages,
  ...props
}) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef(null);
    useEffect(() => (elementRef!.current as any).scrollIntoView());
    return <div ref={elementRef} />;
  };

  const { currentUser } = useAuth();

  return (
    <>
      {messages.map((item, index) => {
        if (item.sender?._id === currentUser?._id) {
          return (
            <ReceiverMessage
              key={`message-${index}`}
              messageItem={item}
              index={index}
            />
          );
        } else {
          return (
            <SenderMessage
              key={`message-${index}`}
              messageItem={item}
              index={index}
            />
          );
        }
      })}
      <AlwaysScrollToBottom />
    </>
  );
};

const ReceiverMessage: FC<{ messageItem: IMessage; index: number }> = ({
  messageItem,
  index,
}) => {
  const selfMessageColor = useColorModeValue("messenger.500", "messenger.500");
  return (
    <Flex key={index} w="100%" justify="flex-end" my={1}>
      <Flex
        flexDir={"column"}
        align={"flex-end"}
        color={"white"}
        py={2}
        px={{ base: "4", sm: "6" }}
        bg={selfMessageColor}
        shadow="lg"
        borderRadius={{ base: "none", sm: "xl" }}
      >
        <Kbd
          // textAlign="end"
          shadow="md"
          color={useColorModeValue("black", "white")}
        >
          {messageItem.sender.displayName || "Anonymous"}
        </Kbd>
        {/* <Link>{messageItem.sender?.displayName}</Link> */}
        <Text>{messageItem.message}</Text>
        <Text fontSize={11}>
          {new Date(messageItem.createdAt).toLocaleTimeString()}
        </Text>
      </Flex>
    </Flex>
  );
};

const SenderMessage: FC<{ messageItem: IMessage; index: number }> = ({
  messageItem,
  index,
}) => {
  const elseMessageColor = useColorModeValue("#F6F9FA", "gray.600");
  const textColor = useColorModeValue("black", "white");
  const { data: sender, isLoading } = useGetUserQuery(messageItem.sender._id);

  useEffect(() => {
    console.log(sender);
  }, [sender]);

  return (
    <Flex key={index} w="100%" my={1}>
      <Avatar src={sender?.avatar || undefined} />
      <Flex
        flexDir={"column"}
        align={"flex-start"}
        color={textColor}
        ml={2}
        py={2}
        px={{ base: "4", sm: "6" }}
        bg={elseMessageColor}
        boxShadow={"lg"}
        borderRadius={{ base: "none", sm: "xl" }}
      >
        {/* <Link as={RouterLink} to={`/user/${messageItem.sender._id}`}> */}
        {/* </Link> */}
        <Kbd shadow="md" color={useColorModeValue("black", "white")}>
          {sender?.displayName || "Anonymous"}
        </Kbd>
        <Text>{messageItem.message}</Text>
        <Text fontSize={11}>
          {new Date(messageItem.createdAt).toLocaleTimeString()}
        </Text>
      </Flex>
    </Flex>
  );
};
export default MessagesBox;
