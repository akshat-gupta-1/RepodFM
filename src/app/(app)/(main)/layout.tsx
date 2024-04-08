import NavBar from "@/components/NavBar";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <div className="font-inter max-w-screen-xl  px-8 mx-auto">{children}</div>
    </>
  );
}
