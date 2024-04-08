"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft,Podcast } from "lucide-react";
interface Props {
  formattedStudioName: string;
}
const Header = ({ formattedStudioName }: Props) => {
  const router = useRouter();
  return (
    <div className="py-4 px-6 flex items-center gap-x-3 flex-none">
      <button
        className="text-textM-900 hover:bg-slate-7 rounded-lg p-1"
        onClick={() => router.back()}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <Link
        href={"/dashboard"}
        className="font-bold text-textM-900 cursor-pointer text-base flex items-center gap-x-2"
      >
        <Podcast className="h-5 w-5" />
        RepodFM
      </Link>
      <div className="border-l-2 border-textM-900 h-6" />
      <h4 className="font-semibold text-textM-900">{formattedStudioName}</h4>
    </div>
  );
};

export default Header;
