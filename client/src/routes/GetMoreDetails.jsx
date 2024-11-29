import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GetMoreDetails = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  const LabelInputContainer = ({ children, className }) => {
    return (
      <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
      </div>
    );
  };
  useEffect(() => {
    if (!isSignedIn) {
      navigate("/sign-up");
    }
  }, [isSignedIn, user]);

  //   useEffect(() => {
  //     if (isSignedIn && user) {
  //       const userDetails = {
  //         clerkId: user.id,
  //         email: user.primaryEmailAddress.emailAddress,
  //         firstName: user.firstName,
  //         lastName: user.lastName,
  //         avatar: user.imageUrl,
  //         phone: user.primaryPhoneNumber,
  //         username: user.username,
  //         createdAt: new Date().toISOString(),
  //         projectIds: [],
  //       };

  //       const sendUserDetails = async () => {
  //         try {
  //           await axios.post(`${process.env.API_URL}/users`, userDetails);
  //         } catch (error) {
  //           console.error("Error sending user details to server:", error.message);
  //         }
  //       };
  //       sendUserDetails();
  //     }
  //   }, [isSignedIn, user]);
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to <span className="font-serif">Yare!</span>
      </h2>
    </div>
  );
};

export default GetMoreDetails;
