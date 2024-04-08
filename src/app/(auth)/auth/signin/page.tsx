"use client";
import { Command, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
const SignInPage = () => {
  const router = useRouter();
  return (
    <div className="max-w-screen-xl mx-auto relative">
      <Button
        className="absolute sm:left-8 top-12 left-4 sm:px-4 sm:py-2 px-2 py-1 bg-backgroundM text-textM-900 font-medium hover:bg-textM-900 hover:text-textM-100"
        onClick={() => router.back()}
      >
        {" "}
        <ChevronLeft className="w-5 h-5 mr-1 " />
        Back
      </Button>
      <div className="h-screen flex justify-center items-center w-full">
        <div className=" flex flex-col items-center space-y-6">
          <Command className="w-8 h-8 text-textM-900 " />
          <div className="text-center flex flex-col space-y-2">
            {" "}
            <h3 className="text-2xl font-semibold text-textM-900">Welcome</h3>
            <h5 className="text text-slate-9">Login to continue to the app</h5>
          </div>
          <div className="flex flex-col space-y-6 w-full">
            <Button
              className="sm:w-[350px] w-full text-textM-900 bg-backgroundM border border-textM-900 rounded-lg hover:bg-textM-900 hover:text-textM-100"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "http://localhost:3000/dashboard",
                })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                viewBox="0 0 424 432"
                className="w-4 h-4 mr-1.5"
              >
                <path
                  fill="currentColor"
                  d="M214 186v-1h201q3 12 3 36q0 93-56.5 150.5T213 429q-88 0-150.5-62T0 216T62 65T213 3q87 0 144 57l-57 56q-33-33-86-33q-54 0-92.5 39.5t-38.5 95t38.5 94.5t92.5 39q31 0 55-9.5t37.5-24.5t20.5-29.5t10-27.5H214v-74z"
                />
              </svg>
              Google
            </Button>
            <Button
              className="sm:w-[350px] text-textM-900 bg-backgroundM border border-textM-900 rounded-lg hover:bg-textM-900 hover:text-textM-100"
              onClick={() =>
                signIn("github", {
                  callbackUrl: "http://localhost:3000/dashboard",
                })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="200"
                height="200"
                viewBox="0 0 432 416"
                className="w-4 h-4 mr-1.5"
              >
                <path
                  fill="currentColor"
                  d="M213.5 0q88.5 0 151 62.5T427 213q0 70-41 125.5T281 416q-14 2-14-11v-58q0-27-15-40q44-5 70.5-27t26.5-77q0-34-22-58q11-26-2-57q-18-5-58 22q-26-7-54-7t-53 7q-18-12-32.5-17.5T107 88h-6q-12 31-2 57q-22 24-22 58q0 55 27 77t70 27q-11 10-13 29q-42 18-62-18q-12-20-33-22q-2 0-4.5.5t-5 3.5t8.5 9q14 7 23 31q1 2 2 4.5t6.5 9.5t13 10.5T130 371t30-2v36q0 13-14 11q-64-22-105-77.5T0 213q0-88 62.5-150.5T213.5 0z"
                />
              </svg>
              Github
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
