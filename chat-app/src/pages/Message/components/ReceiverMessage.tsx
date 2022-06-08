import {
  ButtonGroup,
  Editable,
  EditablePreview,
  EditableTextarea,
  Flex,
  Icon,
  IconButton,
  Kbd,
  ScaleFade,
  Text,
  useColorModeValue,
  useDisclosure,
  useEditableControls,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { BiTrash, BiPencil } from "react-icons/bi";
import IMessage from "../../../models/message.model";
import { BsCheck, BsX } from "react-icons/bs";
import { DeleteMessageDialog } from "./DeleteMessageDialog";

export const ReceiverMessage: FC<{
  messageItem: IMessage;
  index: number;
  onDeleteMessage?: (id?: string) => void;
  onUpdateMessage?: (message: string, id?: string) => void;
}> = ({ messageItem, index, onDeleteMessage, onUpdateMessage }) => {
  const deleteMessageColor = useColorModeValue("gray.300", "gray.500");
  const deleteAndUpdateButton = useDisclosure();
  const deleteMessageDialog = useDisclosure();

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

  const UpdateControls = () => {
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
        />
      </ScaleFade>
    );
  };

  return (
    <>
      {onDeleteMessage && (
        <DeleteMessageDialog
          handleDeleteMessage={() => {
            onDeleteMessage(messageItem._id);
            deleteMessageDialog.onClose();
          }}
          {...deleteMessageDialog}
        />
      )}
      {onUpdateMessage && (
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
            {!messageItem.deleted && (
              <Flex mr={2}>
                <DeleteControls />
                <UpdateControls />
              </Flex>
            )}
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
                align={"flex-end"}
                color={"white"}
                py={2}
                px={{ base: "4", sm: "6" }}
                bg={"messenger.500"}
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
                <Text fontSize={11} align="center">
                  {messageItem.updated && "đã chỉnh sửa | "}
                  {new Date(messageItem.createdAt).toLocaleTimeString()}
                </Text>
              </Flex>
            )}
          </Flex>
        </Editable>
      )}
    </>
  );
};
