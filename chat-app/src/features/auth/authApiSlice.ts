import { createApi } from "@reduxjs/toolkit/dist/query/react";
import {
  AuthInfoResponse,
  ResetPasswordRequest,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from "../../models/requestAndResponse";
import IUser from "../../models/user.model";
import TokenService from "../../services/token.service";
import baseQuery from "../utils";

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints(builder) {
    return {
      signIn: builder.mutation<SignInResponse, SignInRequest>({
        query: (signInRequest) => ({
          url: "/auth/signin",
          method: "POST",
          body: signInRequest,
        }),
        transformResponse: (response: any, _meta, _arg) => {
          if (response && response.authenticated) {
            TokenService.updateLocalAccessToken(response.accessToken);
            TokenService.updateLocalRefreshToken(response.refreshToken);
          }
          return response;
        },
      }),
      signUp: builder.mutation<IUser, SignUpRequest>({
        query: (user) => ({
          url: "/auth/signup",
          method: "POST",
          body: user,
        }),
        transformResponse: (response: SignUpResponse, _meta, _arg) =>
          response.data,
      }),
      signOut: builder.mutation<{ success: boolean }, void>({
        query: () => {
          const refreshToken = TokenService.getLocalRefreshToken();
          return {
            url: "/auth/signout",
            method: "DELETE",
            body: { refreshToken },
          };
        },
      }),
      resetPassword: builder.mutation<
        { success: boolean; message: string },
        ResetPasswordRequest
      >({
        query: ({ userId, password }) => ({
          url: `/auth/password-reset/${userId}`,
          method: "POST",
          body: { password },
        }),
      }),
      getAuthInfo: builder.mutation<IUser, void>({
        query: () => {
          const accessToken = TokenService.getLocalAccessToken();
          return {
            url: "/auth/info",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
        transformResponse: (response: AuthInfoResponse, _meta, _arg) => {
          console.log(response.data);
          return response.data;
        },
      }),
    };
  },
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useGetAuthInfoMutation,
  useResetPasswordMutation,
} = authApiSlice;
