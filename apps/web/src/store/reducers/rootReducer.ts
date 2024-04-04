import { marbleFiApi } from "@/store/marbleFiApi";

const rootReducer = marbleFiApi.reducer;
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
