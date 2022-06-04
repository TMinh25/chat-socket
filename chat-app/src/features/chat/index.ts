import { createApi } from "@reduxjs/toolkit/dist/query/react";
import IMessage from "../../models/message.model";
import baseQuery from "../utils";

export const generalMessageApiSlice = createApi({
  reducerPath: "generalMessageApi",
  baseQuery: baseQuery,
  tagTypes: ["Message", "General"],
  endpoints(builder) {
    return {
      getAllGenenralMessages: builder.query<IMessage[], void>({
        query: () => ({
          url: `/message/general`,
          method: "GET",
        }),
        transformResponse: (response: {
          success: boolean;
          data: any;
          length: number;
        }) => response.data,
        extraOptions: { refetchOnReconnect: true, refetchOnFocus: true },
      }),
      updateGeneralMessage: builder.mutation<
        string,
        Pick<IMessage, "_id" | "message">
      >({
        query: ({ _id, ...body }) => ({
          url: `/message/general/update/${_id}`,
          method: "PATCH",
          body,
        }),
        transformResponse: (response: { success: boolean; message: string }) =>
          response.message,
      }),
      deleteGeneralMessage: builder.mutation<boolean, string | undefined>({
        query: (_id) => ({
          url: `/message/general/delete/${_id}`,
          method: "DELETE",
        }),
        transformResponse: (response: { success: boolean }) => response.success,
      }),
    };
  },
});

export const {
  useGetAllGenenralMessagesQuery,
  useUpdateGeneralMessageMutation,
  useDeleteGeneralMessageMutation,
} = generalMessageApiSlice;
