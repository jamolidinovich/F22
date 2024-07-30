import { useRegister } from "../hooks/useRegister";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";
import { useState } from "react";
import videoLog from "../video/fruit-cut.mp4";

function Register() {
  const dispatch = useDispatch();
  const { signWithGoogle, isPending } = useRegister();
  const auth = getAuth();

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    tempErrors.displayName = displayName ? "" : "User Name is required.";
    tempErrors.photoURL = photoURL ? "" : "Photo URL is required.";
    tempErrors.email = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ? ""
      : "Valid email is required.";
    tempErrors.password =
      password.length >= 6
        ? ""
        : "Password must be at least 6 characters long.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: displayName,
          photoURL: photoURL,
        });

        dispatch(login({ email, displayName, photoURL }));
        navigate("/");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setErrors((prev) => ({
            ...prev,
            email: "Email is already registered.",
          }));
        } else {
          console.error("Registration error", error);
        }
      }
    } else {
      console.log("Validation failed");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <video
        src={videoLog}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 z-[-1] object-cover"
        muted
        autoPlay
        loop
      ></video>
      <form
        onSubmit={handleRegister}
        className="card w-96 p-8 rounded-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center font-bold text-3xl text-gray-800">Signup</h4>
        <div>
          <label htmlFor="displayName" className="text-black">
            User Name:
          </label>
          <input
            type="text"
            name="displayName"
            placeholder="User Name"
            className="input input-bordered border-2 rounded-lg input-primary w-full mt-2"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          {errors.displayName && (
            <p className="text-red-500">{errors.displayName}</p>
          )}
        </div>
        <div>
          <label htmlFor="photoURL" className="text-black">
            Photo URL:
          </label>
          <input
            type="url"
            name="photoURL"
            placeholder="Photo URL"
            className="input input-bordered border-2 rounded-lg input-primary w-full mt-2"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
          />
          {errors.photoURL && <p className="text-red-500">{errors.photoURL}</p>}
        </div>
        <div>
          <label htmlFor="email" className="text-black">
            Email:
          </label>
          <input
            type="email"
            name="email"
            placeholder="test@gmail.com"
            className="input input-bordered border-2 rounded-lg input-primary w-full mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="text-black">
            Password:
          </label>
          <input
            type="password"
            name="password"
            placeholder="********"
            className="input input-bordered border-2 input-primary rounded-lg w-full mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <button
          type="submit"
          className="btn btn-primary bg-blue-700 text-white btn-block capitalize mt-4"
          disabled={isPending}
        >
          Signup
        </button>
        <button
          type="button"
          onClick={signWithGoogle}
          className="btn btn-neutral bg-base-content w-full flex items-center justify-center gap-2 mt-2"
        >
          <FcGoogle className="text-2xl" />
          Google
        </button>
        <button
          onClick={handleLogin}
          type="button"
          className="btn btn-info bg-[#E900C1] text-white border-none w-full flex items-center justify-center gap-2 mt-2"
        >
          <span>I have an account</span>
        </button>
      </form>
    </div>
  );
}

export default Register;
