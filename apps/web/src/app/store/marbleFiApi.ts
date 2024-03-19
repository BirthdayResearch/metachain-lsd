import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateUserI } from "@/app/types/user";

// eslint-disable-next-line import/prefer-default-export
export const marbleFiApi = createApi({
  reducerPath: "marbleFiApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5741" }),
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
