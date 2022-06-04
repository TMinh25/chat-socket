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
  ButtonGroup,
  Editable,
  EditablePreview,
  EditableTextarea,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  Kbd,
  ScaleFade,
  Text,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
  useEditableControls,
} from "@chakra-ui/react";
import React, { FC, useEffect, useRef } from "react";
import { BiTrash, BiPencil } from "react-icons/bi";
import { useGetUserQuery } from "../../features/user";
import { useAuth } from "../../hooks/useAuth";
import IMessage from "../../models/message.model";
import { BsCheck, BsX } from "react-icons/bs";

const DeleteMessageDialog: FC<
  { handleDeleteMessage: () => void } & UseDisclosureReturn
> = ({ isOpen, onClose, handleDeleteMessage }) => {
  const cancelRef = React.useRef(null);
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Gỡ tin nhắn
            </AlertDialogHeader>

            <AlertDialogBody>
              Sau khi tin nhắn bị gỡ, không ai có thể xem tin nhắn này
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Huỷ
              </Button>
              <Button colorScheme="red" onClick={handleDeleteMessage} ml={3}>
                Xoá
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

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

  return (
    <>
      {messages.map((item, index) => {
        if (item.sender?._id === currentUser?._id) {
          return (
            <ReceiverMessage
              onDeleteMessage={onDeleteMessage}
              onUpdateMessage={onUpdateMessage}
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

const ReceiverMessage: FC<{
  messageItem: IMessage;
  index: number;
  onDeleteMessage: (id?: string) => void;
  onUpdateMessage: (message: string, id?: string) => void;
}> = ({ messageItem, index, onDeleteMessage, onUpdateMessage }) => {
  const selfMessageColor = useColorModeValue("messenger.500", "messenger.500");
  const deleteAndUpdateButton = useDisclosure();
  const deleteMessageDialog = useDisclosure();

  const UpdateEditableControls = () => {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" alignItems="center" size="sm">
        <IconButton
          rounded="full"
          colorScheme="green"
          icon={<Icon as={BsCheck} />}
          aria-label={"update-message-accept"}
          {...getSubmitButtonProps()}
        />
        <IconButton
          rounded="full"
          colorScheme="red"
          icon={<Icon as={BsX} />}
          aria-label={"update-message-decline"}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <ScaleFade initialScale={0.8} in={deleteAndUpdateButton.isOpen}>
        <IconButton
          rounded={"full"}
          icon={<Icon as={BiPencil} />}
          aria-label={`update-message-${index}`}
          {...getEditButtonProps()}
          // onClick={updateMessageButtons.onOpen}
        />
      </ScaleFade>
    );
  };

  const DeleteControls = () => {
    return (
      <ScaleFade initialScale={0.8} in={deleteAndUpdateButton.isOpen}>
        <IconButton
          rounded={"full"}
          icon={<Icon as={BiTrash} />}
          aria-label={`trash-message-${index}`}
          mr={2}
          onClick={deleteMessageDialog.onOpen}
        />
      </ScaleFade>
    );
  };

  return (
    <>
      <DeleteMessageDialog
        handleDeleteMessage={() => {
          onDeleteMessage(messageItem._id);
          deleteMessageDialog.onClose();
        }}
        {...deleteMessageDialog}
      />
      <Editable
        defaultValue={messageItem.message}
        submitOnBlur={false}
        isPreviewFocusable={false}
        onSubmit={(value) => onUpdateMessage(value, messageItem._id)}
      >
        <Flex
          key={index}
          w="100%"
          justify="flex-end"
          my={1}
          onMouseEnter={deleteAndUpdateButton.onOpen}
          onMouseLeave={deleteAndUpdateButton.onClose}
          alignItems={"center"}
        >
          <Flex mr={2}>
            <DeleteControls />
            <UpdateEditableControls />
          </Flex>
          <Flex
            flexDir={"column"}
            align={"flex-end"}
            color={"white"}
            py={2}
            px={{ base: "4", sm: "6" }}
            bg={selfMessageColor}
            shadow="lg"
            borderRadius={{ base: "md", sm: "xl" }}
            w="fit-content"
          >
            <Kbd
              // textAlign="end"
              shadow="md"
              color={useColorModeValue("black", "white")}
            >
              {messageItem.sender.displayName || "Anonymous"}
            </Kbd>
            <EditablePreview />
            <EditableTextarea
              minW={{ base: "xl", sm: "xs" }}
              w="fit-content"
              h="fit-content"
              resize={"both"}
            />
            {/* <Text>{messageItem.message}</Text> */}
            <Text fontSize={11}>
              {new Date(messageItem.createdAt).toLocaleTimeString()}
            </Text>
          </Flex>
        </Flex>
      </Editable>
    </>
  );
};

const SenderMessage: FC<{ messageItem: IMessage; index: number }> = ({
  messageItem,
  index,
}) => {
  const elseMessageColor = useColorModeValue("#F6F9FA", "gray.600");
  const textColor = useColorModeValue("black", "white");
  const { data: sender } = useGetUserQuery(messageItem.sender._id);

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
        borderRadius={{ base: "md", sm: "xl" }}
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
