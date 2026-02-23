import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserService } from "@/interfaces/IUsersResponseData";

interface UserState {
  data: IUserService | null;
}

const initialState: UserState = {
  data: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action untuk menyimpan data dari hook ke Redux
    setUserData: (state, action: PayloadAction<IUserService>) => {
      state.data = action.payload;
    },
    // Action untuk menghapus data saat logout
    clearUserData: (state) => {
      state.data = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
