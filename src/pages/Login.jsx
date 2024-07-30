import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { useRegister } from "../hooks/useRegister";
import { Link } from "react-router-dom";
import { Form } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import videoLog from "../video/video.mp4";

function Login() {
  const dispatch = useDispatch();
  const { signWithGoogle } = useRegister();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      dispatch(
        login({
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );
      toast.success("You are successfully logged in!");
      navigate("/");
    } catch (error) {
      toast.error(
        "Failed to log in. Please check your credentials and try again."
      );
      console.error("Login error", error);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="h-screen flex items-center justify-center relative">
      <video
        src={videoLog}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 z-[-1] object-cover"
        muted
        autoPlay
        loop
      ></video>
      <Form
        method="post"
        onSubmit={handleLogin}
        className="card w-full sm:w-96 md:w-80 lg:w-96 p-8 rounded-lg flex flex-col gap-y-4 "
      >
        <h4 className="text-center font-bold text-3xl">Login</h4>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            className="input input-bordered w-full mt-2 border-2 input-primary rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            className="input input-bordered w-full mt-2 border-2 input-primary rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="btn bg-blue-700 border-none btn-primary text-white btn-block capitalize mt-4"
        >
          Login
        </button>
        <button
          type="button"
          onClick={signWithGoogle}
          className="btn w-full btn-neutral bg-base-content flex items-center justify-center gap-2 mt-2"
        >
          <FcGoogle className="text-2xl" />
          Google
        </button>
        <button
          onClick={handleRegister}
          type="button"
          className="btn btn-info bg-[#E900C1] text-white border-none w-full flex items-center justify-center gap-2 mt-2"
        >
          I have no account yet
        </button>
      </Form>
    </div>
  );
}

export default Login;
