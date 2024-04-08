"use client";
import { Button } from "./ui/button";
import { ArrowRight, Podcast } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import NavDropDown from "./NavDropDown";
const NavBar = () => {
  const router = useRouter();
  const { status, data: session } = useSession();
  return (
    <nav className="sticky z-30 inset-0 backdrop-blur-lg border-b border-slate-4 shadow-sm bg-backgroundM ">
      <div className="max-w-screen-xl mx-auto  px-4">
        <div className="flex justify-between h-14 items-center py-4">
          <Link
            // text-transparent bg-clip-text bg-gradient-to-r from-primaryM to-accentM
            className="font-bold text-textM-900  cursor-pointer flex gap-x-2 "
            href={"/"}
          >
            <Podcast className="text-primaryM" />
            <div>
              Repod<span className="text-primaryM">FM</span>
            </div>
          </Link>
          {status === "authenticated" ? (
            <NavDropDown session={session} />
          ) : (
            <Button
              className="px-4 py-2 rounded-lg bg-backgroundM text-textM-950 hover:bg-primaryM hover:text-textM-50"
              onClick={() => router.push("/api/auth/signin")}
            >
              Sign in <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
