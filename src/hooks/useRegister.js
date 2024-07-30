import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";
export const useRegister = () => {
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();
  const auth = getAuth();
  const signWithGoogle = async () => {
    setIsPending(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      dispatch(
        login({
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );
    } catch (error) {
      console.error("Google sign-in error", error);
    } finally {
      setIsPending(false);
    }
  };

  return { signWithGoogle, isPending };
};
