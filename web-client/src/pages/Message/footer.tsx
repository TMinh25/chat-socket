import {
  Button,
  Flex,
  FlexProps,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";

const Footer: FC<
  {
    handleSendMessage: (message: string) => void;
  } & FlexProps
> = ({ handleSendMessage, ...props }) => {
  const [inputMessage, setInputMessage] = useState("");

  const onSendMessage = () => {
    if (inputMessage.trim()) {
      handleSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <Flex w="100%" display="absolute" bottom="0" px={8} pb={4} {...props}>
      <InputGroup size="md">
        <Input
          shadow="inner"
          pr="4.5rem"
          placeholder="Tin nhắn..."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onSendMessage();
            }
          }}
          value={inputMessage}
          onChange={({ target: { value } }) => setInputMessage(value)}
        />
        <InputRightElement width="4.5rem">
          <Button
            disabled={inputMessage.trim().length <= 0}
            onClick={onSendMessage}
            h="1.75rem"
            size="sm"
            shadow="outline"
          >
            Gửi
          </Button>
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default Footer;
