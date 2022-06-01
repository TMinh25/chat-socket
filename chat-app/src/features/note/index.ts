import baseQuery from "../utils";
import { createApi } from "@reduxjs/toolkit/query/react";
import { executeReducerBuilderCallback } from "@reduxjs/toolkit/dist/mapBuilders";
import INote from "../../models/note.model";

const transformResponse = (
  response: { success: boolean; data: any },
  _meta: {} | undefined,
  _arg: any
) => {
  console.log(response.data);
  return response.data;
};

const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery,
  tagTypes: ["notes", "note"],
  endpoints(builder) {
    return {
      getAllNotes: builder.query<INote[], void>({
        query: () => ({
          url: "/note/",
          method: "GET",
        }),
        transformResponse,
        providesTags: (result) =>
          // is result available?
          result
            ? // successful query
              [
                ...result.map(({ _id }) => ({ type: "notes", _id } as const)),
                { type: "notes", id: "LIST" },
              ]
            : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
              [{ type: "notes", id: "LIST" }],
      }),
      getNoteByID: builder.query<INote, Pick<INote, "_id">>({
        query: (_id) => ({
          url: `/note/${_id}`,
          method: "GET",
        }),
        providesTags: (result, error, _id) => [{ type: "note", _id }],
      }),
      createNewNote: builder.mutation<
        INote[],
        Omit<INote, "_id" | "createdAt" | "updatedAt">
      >({
        query: (body) => ({
          url: `/note/new`,
          method: "GET",
          body,
        }),
        invalidatesTags: [{ type: "notes", id: "LIST" }],
      }),
      updateNote: builder.mutation<
        INote[],
        Omit<INote, "createdAt" | "updatedAt">
      >({
        query: ({ _id, ...body }) => ({
          url: `/note/update/${_id}`,
          method: "GET",
          body,
        }),
        invalidatesTags: (result, error, { _id }) => [{ type: "note", _id }],
      }),
      deleteNote: builder.mutation<INote, Pick<INote, "_id">>({
        query: (_id) => ({
          url: `/note/delete/${_id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, _id) => [{ type: "note", _id }],
      }),
    };
  },
});

export default noteApi;

export const {
  useCreateNewNoteMutation,
  useGetAllNotesQuery,
  useGetNoteByIDQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteApi;
