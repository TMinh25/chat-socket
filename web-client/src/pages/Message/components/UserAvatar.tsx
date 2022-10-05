import { Avatar, AvatarBadge } from "@chakra-ui/react";
import React, { FC } from "react";
import { useAppSelector } from "../../../app/hooks";
import IUser from "../../../models/user.model";

const UserAvatar: FC<Pick<IUser, "_id" | "avatar">> = ({ avatar, _id }) => {
  const { onlineStack } = useAppSelector((state) => state.chatState);
  const online = onlineStack.includes(_id);

  return (
    <Avatar src={avatar} mr={2}>
      {online && <AvatarBadge boxSize="1em" bg="green.500" />}
    </Avatar>
  );
};
export default UserAvatar;
