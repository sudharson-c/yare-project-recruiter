import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div className="w-full flex justify-center">
      <SignUp 
      afterSignOutUrl={'/'}/>
    </div>
  );
};

export default SignUpPage;
