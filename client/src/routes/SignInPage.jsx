import { SignIn, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const SignInPage = () => {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      <Navigate to={"/projects"}replace={true} />
    }
  }, [isSignedIn]);

  return (
    <div className="w-full flex justify-center">
      <SignIn />
    </div>
  );
};

export default SignInPage;
