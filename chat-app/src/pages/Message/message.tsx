import React, { useEffect, useRef } from "react";
import { Avatar, Flex, Text, FlexProps } from "@chakra-ui/react";
import IMessage from "../../models/message.model";
import { useAuth } from "../../hooks/useAuth";

const Messages: React.FC<{ messages: IMessage[] } & FlexProps> = ({
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
    <Flex overflowY="scroll" flexDirection="column" p="3" {...props}>
      {messages.map((item, index) => {
        if (item.sender._id === currentUser?._id) {
          return (
            <Flex key={index} w="100%" justify="flex-end">
              <Flex
                bg="black"
                color="white"
                minW="100px"
                maxW="350px"
                my="1"
                p="3"
              >
                <Text>{item.message}</Text>
              </Flex>
            </Flex>
          );
        } else {
          return (
            <Flex key={index} w="100%">
              <Avatar
                name="Computer"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                bg="blue.300"
              ></Avatar>
              <Flex
                bg="gray.100"
                color="black"
                minW="100px"
                maxW="350px"
                my="1"
                p="3"
              >
                <Text>{item.message}</Text>
              </Flex>
            </Flex>
          );
        }
      })}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Messages;
