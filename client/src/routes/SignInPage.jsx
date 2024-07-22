// SignInPage.js
import { SignIn, useUser } from "@clerk/clerk-react";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const SignInPage = () => {
  const { isSignedIn, user } = useUser();
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      login(user); 
      navigate("/projects", { replace: true });
    }
  }, [isSignedIn, user, login, navigate]);

  return (
    <div className="w-full flex justify-center">
      <SignIn afterSignInUrl={"/projects"} />
    </div>
  );
};

export default SignInPage;
