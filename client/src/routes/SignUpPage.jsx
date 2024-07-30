import { SignUp, useUser } from "@clerk/clerk-react";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
// import { fireDb } from "../../../backend/config/firebase";
 // Import Firebase Firestore

const SignUpPage = () => {
  const { isSignedIn, user } = useUser();
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
      <SignUp afterSignOutUrl={'/'} />
    </div>
  );
};

export default SignUpPage;
