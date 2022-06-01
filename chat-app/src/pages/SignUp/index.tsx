import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Select,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useSignUpMutation } from "../../features/auth/authApiSlice";
import { useAppState } from "../../hooks/useAppState";
import FormControlComponent from "../../components/FormControlComponent";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => setShowPassword((prev) => !prev);
  const navigate = useNavigate();
  const [signUp, signUpData] = useSignUpMutation();
  const { toast } = useAppState();
  const [isReviewer, setIsReviewer] = useState(false);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    setFieldValue,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      displayName: "",
      aliases: "",
      sex: undefined,
      degree: "",
      workPlace: "",
      nation: "",
      backgroundInfomation: "",
      email: "",
      username: "",
      password: "",
      rePassword: "",
      photoURL: "",
      role: -1,
      userSetting: {
        forReviewer: {
          acceptingReview: false,
          reviewField: [],
        },
      },
    },
    validationSchema: yup.object({
      displayName: yup.string().required("Vui lòng nhập họ tên của bạn!"),
      aliases: yup.string(),
      email: yup.string().email().required("Vui lòng nhập email của bạn!"),
      username: yup
        .string()
        .min(6, "Tài khoản phải có ít nhất 6 kí tự")
        .required("Hãy nhập tên tài khoản của bạn"),
      workPlace: yup.string().required("Hãy nhập đơn vị bạn đang công tác"),
      password: yup
        .string()
        .min(8, "Mật khẩu phải dài ít nhất 8 kí tự")
        .required("Vui lòng nhập mật khẩu"),
      rePassword: yup
        .string()
        .required("Vui lòng nhập lại mật khẩu")
        .when("password", {
          is: (password: any) =>
            password && password.length > 0 ? true : false,
          then: yup
            .string()
            .oneOf([yup.ref("password")], "Mật khẩu không trùng khớp"),
        }),
      role: yup.number(),
    }),
    onSubmit: (signUpForm) => {
      console.log(typeof signUpForm);
      signUpForm.role = isReviewer ? 4 : 5;

      signUp(signUpForm)
        .unwrap()
        .then((user) => {
          toast({
            status: "success",
            title: "Đăng Kí thành công!",
            description: "Xin mời đăng nhập",
          });
          navigate("/signin", { replace: true });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  });

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
        <Stack spacing={6} mx={"auto"} w={"5xl"} py={12} px={6}>
          <form onSubmit={handleSubmit}>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <Stack spacing={4}>
                {signUpData.isError && (signUpData.error as any).data && (
                  <Text align="center" color={"red"}>
                    {(signUpData.error as any).data.error.title}
                  </Text>
                )}
                <HStack spacing={4}>
                  <Box flex={1}>
                    <FormControlComponent
                      id="displayName"
                      formLabel="Họ & Tên"
                      value={values.displayName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.displayName?.toString()}
                      error={errors.displayName}
                      isRequired
                    />
                  </Box>
                </HStack>
                <FormControlComponent
                  id="email"
                  formLabel="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.email?.toString()}
                  error={errors.email}
                  isRequired
                />
                <FormControlComponent
                  id="username"
                  formLabel="Tên tài khoản"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.username?.toString()}
                  error={errors.username}
                  isRequired={true}
                />
                <HStack spacing={4}>
                  <Box flex={1}>
                    <FormControl
                      isRequired
                      isInvalid={Boolean(touched.password && errors.password)}
                      id="password"
                    >
                      <HStack>
                        <FormLabel>Mật khẩu</FormLabel>
                        {touched.password && errors.password && (
                          <>
                            <Spacer />
                            <FormErrorMessage pb={2}>
                              {errors.password}
                            </FormErrorMessage>
                          </>
                        )}
                      </HStack>
                      <InputGroup>
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={values.password}
                          onChange={handleChange}
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
                    </FormControl>
                  </Box>
                  <Box flex={1}>
                    <FormControl
                      isRequired
                      isInvalid={Boolean(
                        touched.rePassword && errors.rePassword
                      )}
                      id="rePassword"
                    >
                      <HStack>
                        <FormLabel>Nhập Lại Mật Khẩu</FormLabel>
                        {touched.rePassword && errors.rePassword && (
                          <>
                            <Spacer />
                            <FormErrorMessage pb={2}>
                              {errors.rePassword}
                            </FormErrorMessage>
                          </>
                        )}
                      </HStack>
                      <Input
                        type="password"
                        value={values.rePassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                  </Box>
                </HStack>
                <Button
                  id="submit"
                  type="submit"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  isLoading={signUpData.isLoading}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Đăng Kí
                </Button>
                <Stack pt={6}>
                  <Text align={"center"}>
                    Đã có tài khoản?{" "}
                    <Link
                      onClick={() => navigate("/signin")}
                      color={"blue.400"}
                    >
                      Đăng Nhập
                    </Link>
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </form>
        </Stack>
      </Flex>
    </>
  );
}
