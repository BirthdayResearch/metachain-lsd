import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateUserI } from "@/types";
import process from "process";

// eslint-disable-next-line import/prefer-default-export
export const marbleFiApi = createApi({
  reducerPath: "marbleFiApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_SERVER_URL }),
  endpoints: (builder) => ({
    createUser: builder.mutation<any, CreateUserI>({
      query: ({ email, status }) => ({
        url: "/user",
        body: {
          email: email,
          status: status,
        },
        method: "POST",
      }),
    }),
  }),
});

export const { useCreateUserMutation } = marbleFiApi;
