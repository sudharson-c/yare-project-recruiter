import { SignIn, useUser } from "@clerk/clerk-react";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Loading from '../components/sub/Loading'
// import { fireDb } from "../../../backend/config/firebase";


const SignInPage = () => {
  const { isSignedIn, user ,isLoaded} = useUser();
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      login(user);
      navigate("/projects", { replace: true });
    }
  }, [isSignedIn, user]);

  return (
    <div className="w-full flex justify-center">
      {isLoaded ?
      <SignIn afterSignInUrl={"/projects"} /> : 
      <Loading />
      }
    </div>
  );
};

export default SignInPage;
