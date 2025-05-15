import { useState } from "react";
import { Link } from "wouter";
import { MenuIcon, BellIcon, MapPinIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  userId: number;
}

export default function Header({ userId }: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-white shadow-md z-10 relative">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPinIcon className="text-primary h-6 w-6" />
          <Link href="/">
            <h1 className="text-xl font-semibold text-neutral-800 cursor-pointer">
              Campus Navigator
            </h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button className="text-neutral-600 hover:text-primary transition">
            <BellIcon className="h-5 w-5" />
          </button>
          <Avatar className="h-8 w-8 bg-primary">
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
        </div>

        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden text-neutral-600 hover:text-primary transition">
              <MenuIcon className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 max-w-[250px]">
            <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
