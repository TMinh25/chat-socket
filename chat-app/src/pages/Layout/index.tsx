import {
  Box,
  Button,
  ButtonGroup,
  Circle,
  Collapse,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  ScaleFade,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { IconType } from "react-icons";
import { FcHome } from "react-icons/fc";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ColorModeSwitcher } from "../../components/ColorModeSwitcher";
import { useSignOutMutation } from "../../features/auth/authApiSlice";
import { resetCredentials } from "../../features/auth/authSlice";
import { updateOnlineStack } from "../../features/chat/chatStateSlice";
import { chatSocket } from "../../features/chat/socketManager";
import { useAppState } from "../../hooks/useAppState";
import { useAuth } from "../../hooks/useAuth";
import TokenService from "../../services/token.service";
import { isArrayEqual } from "../../utils";

interface NavItem {
  label: string;
  href: string;
  disabled?: boolean;
  icon?: IconType;
}

const NAVS: Array<NavItem> = [
  { href: "/", icon: FcHome, label: "Trang Chủ" },
  { href: "/message/all", label: "Tin Nhắn Chung" },
  {
    href: "/message/direct",
    label: "Tin Nhắn Riêng",
  },
];

export default function LandingPage() {
  const location = useLocation();
  const { toast } = useAppState();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { authenticated, currentUser } = useAuth();
  const borderColor = useColorModeValue("white", "black.50");
  const [signOut, signOutResult] = useSignOutMutation();
  const signOutModal = useDisclosure();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const navDisclosure = useDisclosure();

  async function handleSignOut() {
    try {
      console.log(currentUser?._id);
      chatSocket.emit("offline", currentUser?._id.toString());
      console.log(currentUser?._id);
      await signOut().unwrap();
      dispatch(resetCredentials());
      TokenService.updateLocalAccessToken(null);
      TokenService.updateLocalRefreshToken(null);
      chatSocket.disconnect();
      signOutModal.onClose();
      navigate("/");
    } catch (error) {
      console.log({ error });
      toast({
        status: "error",
        title: (error as any).data?.message,
      });
    }
  }

  const UserOnlineTag = () => (
    <Popover>
      <PopoverTrigger>
        <Tag alignItems="center" cursor="pointer">
          <Circle
            size="3"
            background="#31A24C"
            mx={2}
            border="2px solid"
            borderColor={borderColor}
          />
          {currentUser?.displayName}
        </Tag>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight="semibold">
          <Text align="center">{currentUser?.displayName}</Text>
        </PopoverHeader>
        <PopoverBody>
          <HStack mb={4} mt={2} spacing={2}>
            <ColorModeSwitcher />
          </HStack>
          <Button
            w="full"
            colorScheme="red"
            onClick={() => signOutModal.onOpen()}
          >
            Đăng Xuất
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
  const { onlineStack } = useAppSelector((state) => state.chatState);
  // update online userss
  useEffect(() => {
    chatSocket.emit("get online stack");
    chatSocket.on("update online stack", (onlineUsers) => {
      console.log(isArrayEqual(onlineUsers, onlineStack));
      if (!isArrayEqual(onlineUsers, onlineStack)) {
        dispatch(updateOnlineStack(onlineUsers));
      }
    });
    return () => {
      chatSocket.off("update online stack");
    };
  }, []);

  return (
    <ScaleFade key={location.pathname} initialScale={0.95} in={true}>
      <Flex direction="column" as="section" h="100vh" maxH="100vh">
        <Box
          flex="0 1 auto"
          as="nav"
          bg="bg-surface"
          boxShadow={useColorModeValue("sm", "sm-dark")}
          py={2}
          px={8}
        >
          {isDesktop ? (
            <Flex justify="space-between" align="center">
              <ButtonGroup variant="solid" spacing="4">
                {NAVS.map((item, index) => {
                  return item.icon ? (
                    <IconButton
                      key={item.label}
                      icon={<Icon as={item.icon} />}
                      aria-label={`nav-button-${index}`}
                      as={RouterLink}
                      to={item.href}
                    />
                  ) : (
                    <Button
                      as={RouterLink}
                      to={item.disabled ? "#" : item.href}
                      key={item.label}
                      disabled={item.disabled}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </ButtonGroup>
              {authenticated ? (
                <UserOnlineTag />
              ) : (
                <HStack spacing="3">
                  <Button variant="solid">Sign in</Button>
                  <Button variant="primary">Sign up</Button>
                </HStack>
              )}
            </Flex>
          ) : (
            <>
              <Flex justify="space-between" align="center">
                <IconButton
                  variant="ghost"
                  icon={<Icon as={navDisclosure.isOpen ? IoMdClose : FiMenu} />}
                  aria-label="Toggle Menu"
                  onClick={navDisclosure.onToggle}
                />
                <UserOnlineTag />
              </Flex>
              <Collapse in={navDisclosure.isOpen} animateOpacity>
                <MobileNav onClose={navDisclosure.onClose} />
              </Collapse>
            </>
          )}
        </Box>
        <Divider />
        {authenticated && (
          <Modal isOpen={signOutModal.isOpen} onClose={signOutModal.onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalHeader>Đăng xuất</ModalHeader>
              <ModalBody>Bạn có chắc muốn đăng xuất?</ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="red"
                  leftIcon={<Icon as={MdOutlinePowerSettingsNew} />}
                  mr={3}
                  onClick={handleSignOut}
                  isLoading={signOutResult.isLoading}
                >
                  Đăng Xuất
                </Button>
                <Button variant="ghost" onClick={signOutModal.onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
        <Outlet />
      </Flex>
    </ScaleFade>
  );
}

const MobileNav = ({ onClose }: { onClose: () => void }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      mt={2}
      display={{ lg: "none" }}
    >
      {NAVS.map((navItem) => (
        <MobileNavItem key={navItem.label} onClose={onClose} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({
  label,
  href,
  disabled,
  onClose,
}: NavItem & { onClose: () => void }) => {
  return (
    <Flex
      py={2}
      as={RouterLink}
      to={disabled ? "#" : href}
      justify={"space-between"}
      align={"center"}
      _hover={{
        textDecoration: "none",
      }}
      onClick={onClose}
    >
      <Text
        fontWeight={600}
        color={useColorModeValue("gray.600", "gray.200")}
        textDecor={disabled ? "line-through" : undefined}
      >
        {label}
      </Text>
    </Flex>
  );
};
