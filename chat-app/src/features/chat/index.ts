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
    };
  },
});

export const { useGetAllGenenralMessagesQuery } = generalMessageApiSlice;
