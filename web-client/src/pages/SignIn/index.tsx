import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import {
  useGetAuthInfoMutation,
  useSignInMutation,
} from "../../features/auth/authApiSlice";
import { setCredentials } from "../../features/auth/authSlice";
import { useAppState } from "../../hooks/useAppState";
import IUser from "../../models/user.model";
import { useFormik } from "formik";
import * as yup from "yup";
import { FaChevronLeft } from "react-icons/fa";
import { chatSocket } from "../../features/chat/socketManager";

function SignInPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [signIn, signInData] = useSignInMutation();
  const [fetchAuthInfo, fetchAuthInfoData] = useGetAuthInfoMutation();
  const { auth } = useAppState();

  const from = (location.state as any)?.from || "/";

  const handleShowPasswordClick = () => setShowPassword(!showPassword);

  const setUserCredentials = async (user: IUser) => {
    dispatch(setCredentials(user));
    navigate(from, { replace: true });
  };

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: { username: "", password: "" },
      validationSchema: yup.object({
        username: yup.string().required("Vui lòng điền tài khoản"),
        password: yup
          .string()
          .min(8, "Mật khẩu phải dài hơn 8 kí tự")
          .required("Vui lòng điền mật khẩu"),
      }),
      onSubmit: async (signInForm) => {
        try {
          await signIn(signInForm).unwrap();
          const user = await fetchAuthInfo().unwrap();
          chatSocket.auth = { _id: user._id };
          chatSocket.connect();
          chatSocket.emit("online", user._id);
          await setUserCredentials(user);
        } catch (error) {
          console.log(error);
        }
      },
    });

  const handleChangeForm = (e: ChangeEvent) => {
    handleChange(e);
    signInData.reset();
    fetchAuthInfoData.reset();
  };

  const formError: string = useMemo(() => {
    if (errors.username && touched.username) return errors.username;
    if (errors.password && touched.password) return errors.password;
    if (signInData.error) return (signInData.error as any)?.data.error.title;
    if (fetchAuthInfoData.error)
      return (fetchAuthInfoData.error as any)?.data.error.title;
  }, [errors, touched, signInData.error, fetchAuthInfoData.error]);

  useEffect(() => {
    if (auth.currentUser) {
      setUserCredentials(auth.currentUser);
    }
  }, [auth.currentUser]);

  if (auth.isAuthenticating)
    return (
      <Center h="100vh">
        <CircularProgress
          isIndeterminate
          color="blue.500"
          trackColor="gray.600"
        />
      </Center>
    );

  return (
    <>
      <IconButton
        m={12}
        size="lg"
        boxShadow={"lg"}
        position="absolute"
        aria-label="chevron-left"
        onClick={() => navigate(-1)}
        icon={<Icon as={FaChevronLeft} />}
      />
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.300", "white.800")}
      >
        <Stack spacing={8} mx={"auto"} w={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Đăng nhập</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              để bắt đầu trò chuyện ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="username" isInvalid={!!formError}>
                  <FormLabel>Tài Khoản</FormLabel>
                  <Input
                    className="username"
                    type="text"
                    value={values.username}
                    onChange={handleChangeForm}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <FormControl id="password" isInvalid={!!formError}>
                  <FormLabel>Mật Khẩu</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChangeForm}
                      onBlur={handleBlur}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowPasswordClick}
                      >
                        {showPassword ? "Ẩn" : "Hiện"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{formError}</FormErrorMessage>
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    id="submit"
                    type="submit"
                    bg={"blue.400"}
                    color={"white"}
                    boxShadow={"lg"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    isLoading={
                      signInData.isLoading || fetchAuthInfoData.isLoading
                    }
                  >
                    Đăng Nhập
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
          <Box>
            Người dùng mới?{" "}
            <Link color="blue.400" onClick={() => navigate("/signup")}>
              Đăng Kí
            </Link>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export default SignInPage;
