import {
  createApi,
  fetchBaseQuery,
  retry,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { HttpStatusCode } from "axios";
import { CreateUserI } from "@/app/types/user";

const staggeredBaseQueryWithBailOut = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    const result = await fetchBaseQuery({})(args, api, extraOptions);
    // bail out of re-tries if TooManyRequests,
    // because we know successive re-retries would be redundant
    if (result.error?.status === HttpStatusCode.TooManyRequests) {
      retry.fail(result.error);
    }
    return result;
  },
  {
    maxRetries: 0,
  },
);

// eslint-disable-next-line import/prefer-default-export
export const marbleFiApi = createApi({
  reducerPath: "marbleFi",
  baseQuery: staggeredBaseQueryWithBailOut,
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
