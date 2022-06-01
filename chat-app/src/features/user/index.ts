import { createApi } from "@reduxjs/toolkit/dist/query/react";
import IUser from "../../models/user.model";
import baseQuery from "../utils";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery,
  endpoints(builder) {
    return {
      getAllUsers: builder.query<IUser[], void>({
        query: () => ({
          url: `/user`,
          method: "GET",
        }),
        transformResponse: (response: {
          success: boolean;
          data: any;
          length: number;
        }) => response.data,
        extraOptions: { refetchOnReconnect: true, refetchOnFocus: true },
      }),
      getUser: builder.query<IUser, string | undefined>({
        query: (userId) => ({
          url: `/user/${userId}`,
          method: "GET",
        }),
        transformResponse: (response: { success: boolean; data: IUser }) =>
          response.data,
      }),
      findUser: builder.query<
        IUser[],
        {
          aliases: string;
          email: string;
          displayName: string;
          workPlace: string;
        }
      >({
        query: (body) => ({ url: "/user/find", method: "POST", body }),
        transformResponse: (response: { success: boolean; data: IUser[] }) =>
          response.data,
      }),
      deleteUser: builder.mutation<{ success: boolean }, string>({
        query: (userId) => ({ url: `/user/${userId}`, method: "DELETE" }),
      }),
    };
  },
});

export const {
  useGetAllUsersQuery,
  useGetUserQuery,
  useFindUserQuery,
  useDeleteUserMutation,
} = userApiSlice;
