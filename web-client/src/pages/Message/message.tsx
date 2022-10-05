import { Button, FlexProps, SlideFade } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import IMessage from "../../models/message.model";
import { ReceiverMessage } from "./components/ReceiverMessage";
import { SenderMessage } from "./components/SenderMessage";

const MessagesBox: React.FC<
  {
    messages: IMessage[];
    onDeleteMessage: (id?: string) => void;
    onUpdateMessage: (message: string, id?: string) => void;
  } & FlexProps
> = ({ messages, onDeleteMessage, onUpdateMessage, ...props }) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef(null);
    useEffect(() => (elementRef!.current as any).scrollIntoView());
    return <div ref={elementRef} />;
  };

  const { currentUser } = useAuth();
  const [loadedMessages, setLoadedMessages] = useState(20);

  window.addEventListener(
    "scroll",
    () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight < scrollHeight - 30) {
        setLoadedMessages((v) => v + 10);
      }
    },
    {
      passive: true,
    }
  );

  return (
    <>
      {loadedMessages < messages.length && (
        <Button w="full" onClick={() => setLoadedMessages((v) => v + 10)}>
          Tải thêm
        </Button>
      )}
      {messages
        .slice(Math.max(messages.length - loadedMessages, 0))
        .map((item, index) => {
          if (item.sender?._id === currentUser?._id) {
            return (
              <SlideFade in={true} offsetY="20px">
                <ReceiverMessage
                  onDeleteMessage={onDeleteMessage}
                  onUpdateMessage={onUpdateMessage}
                  key={`message-${index}`}
                  messageItem={item}
                  index={index}
                />
              </SlideFade>
            );
          } else {
            return (
              <SlideFade in={true} offsetY="20px">
                <SenderMessage
                  key={`message-${index}`}
                  messageItem={item}
                  index={index}
                />
              </SlideFade>
            );
          }
        })}
      <AlwaysScrollToBottom />
    </>
  );
};

export default MessagesBox;
