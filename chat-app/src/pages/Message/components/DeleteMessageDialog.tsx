import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import React, { FC } from "react";

export const DeleteMessageDialog: FC<
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
                Gỡ
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
