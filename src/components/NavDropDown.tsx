import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Palette,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Session } from "@auth/core/types";
import { useTheme } from "next-themes";
interface NavDropDownProps {
  session: Session;
}
const NavDropDown = ({ session }: NavDropDownProps) => {
  const router = useRouter();
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Image
          src={session.user?.image as string}
          alt="user image"
          width={40}
          height={40}
          className="rounded-full border border-slate-5 shadow-sm"
        ></Image>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-backgroundM border-slate-5">
        <div className="flex flex-col gap-y-1 p-1.5">
          {" "}
          <h4 className="text-sm font-semibold">{session.user?.name}</h4>
          <h5 className="text-sm text-slate-9 font-medium">
            {session.user?.email}
          </h5>
        </div>
        <DropdownMenuSeparator className="bg-slate-5"/>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="w-4 h-4 mr-2" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="bg-backgroundM border-slate-5">
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="cursor-pointer"
              >
                <Sun className="w-4 h-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="cursor-pointer"
              >
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavDropDown;
