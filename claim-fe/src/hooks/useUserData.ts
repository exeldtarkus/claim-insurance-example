import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Users from "@/services/users";
import { AppDispatch, RootState } from "@/store";
import { setUserData } from "@/store/slices/userSlice";

export function useUserData() {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.user?.data || null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) return;

      const userData = await Users.findUser();

      if (!userData) {
        return;
      }

      dispatch(setUserData(userData));
    };

    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user;
}
