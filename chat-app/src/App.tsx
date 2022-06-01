import {
  Avatar,
  Box,
  Button,
  Collapse,
  Heading,
  HStack,
  Progress,
  Text,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import io, { Manager } from "socket.io-client";
import "./App.css";
import { useAppDispatch } from "./app/hooks";
import { NoteTags } from "./components/note/BlogTags";
import config from "./config";
import { useGetAuthInfoMutation } from "./features/auth/authApiSlice";
import { setCredentials, setIsAuthenticating } from "./features/auth/authSlice";
import { useAppState } from "./hooks/useAppState";
import { useAuth } from "./hooks/useAuth";
import INote from "./models/note.model";
import NotFound from "./pages/404";
import { HomePage } from "./pages/Home";
import LandingPage from "./pages/Layout";
import Chat from "./pages/Message";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import ProfilePage from "./pages/User";
import TokenService from "./services/token.service";
import PrivateRoute from "./components/PrivateRoute";

export const socketManager = new Manager(config.server.url, {
  autoConnect: false,
  transports: ["websocket", "polling", "flashsocket"],
});

export const socket = io("http://localhost:5000", { withCredentials: true });

function App() {
  // const { data: notes, isLoading, isFetching } = useGetAllNotesQuery();
  const [messages, setMessages] = useState<JSX.Element[]>([]);
  const [message, setMessage] = useState<string>("");

  const dispatch = useAppDispatch();
  const accessToken = TokenService.getLocalAccessToken();
  const [getAuthInfo, authInfoData] = useGetAuthInfoMutation();
  const { authenticated, currentUser, isAuthenticating } = useAuth();
  const { toast } = useAppState();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!authenticated || currentUser == null) {
        console.log("fetchAuthInfo in App");
        dispatch(setIsAuthenticating(true));
        try {
          const user = await getAuthInfo().unwrap();
          dispatch(setCredentials(user));
        } catch (error: any) {
          console.log(error);
          const title =
            error.data?.message || "Không thể lấy dữ liệu từ phiên!";
          toast.closeAll();
          toast({
            status: "error",
            title,
            description: "Vui lòng thử lại sau.",
          });
        } finally {
          dispatch(setIsAuthenticating(false));
        }
      }
    };

    if (accessToken) fetchUserInfo();
  }, [accessToken]);

  if (authInfoData.isLoading || isAuthenticating)
    return <Progress size="xs" isIndeterminate />;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <LandingPage />
              </PrivateRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="chat/:channelId" element={<Chat />} />
            <Route path="message/all" element={<Chat />} />
            {/* <Route path="message/direct/:channelId" element={<Chat />} /> */}
            <Route path="user/:userId">
              <Route index element={<ProfilePage />} />
            </Route>
          </Route>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
