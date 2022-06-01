import React, { FC } from "react";
import {
  Flex,
  Input,
  Button,
  InputRightElement,
  InputGroup,
  FlexProps,
} from "@chakra-ui/react";

const Footer: FC<
  {
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: () => void;
  } & FlexProps
> = ({ inputMessage, setInputMessage, handleSendMessage, ...props }) => {
  return (
    <Flex w="100%" display="absolute" bottom="0" px={8} pb={4} {...props}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          placeholder="Tin nhắn..."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button
            disabled={inputMessage.trim().length <= 0}
            onClick={handleSendMessage}
            h="1.75rem"
            size="sm"
          >
            Gửi
          </Button>
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default Footer;
