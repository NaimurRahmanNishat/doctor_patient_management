"use client";
import { useEffect, useState } from "react";
import { Menu, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import NavItems from "./NavItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Image from "next/image";

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getDashboardPath = () => {
    if (user?.role === "DOCTOR") return "/doctor/dashboard";
    if (user?.role === "PATIENT") return "/patient/dashboard";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 max-w-screen-xl mx-auto">
        {/* Logo Section */}
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-tight">
          DAMS
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavItems />
        </div>

        {/* Actions Section */}
        <div className="flex items-center cursor-pointer gap-2 md:gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center cursor-pointer gap-2">
                {user.photo_url ? (
                  <Image
                    src={user.photo_url}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border"
                  />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {user.role === "PATIENT" ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/patient/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/patient/appointments">Appointments</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardPath()}>Dashboard</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm md:text-base font-medium hover:text-primary transition-colors px-4 py-1.5 border rounded-md hover:bg-accent"
              >
                Login
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium border rounded-md hover:bg-accent transition-colors">
                  Register
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/patient-register">Patient</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/doctor-register">Doctor</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[75%] sm:w-[300px]">
              <SheetTitle className="mt-6 text-center text-lg font-semibold">
                DAMS
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navigate through the available pages.
              </SheetDescription>
              <div className="mt-6 flex flex-col space-y-4">
                <NavItems
                  className="flex flex-col space-y-4"
                  onItemClick={() => setIsOpen(false)}
                />
                {!user && (
                  <div className="mt-6 flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full rounded-md px-3 py-2 text-center text-sm font-medium border hover:bg-accent transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/patient-register"
                      onClick={() => setIsOpen(false)}
                      className="block w-full rounded-md px-3 py-2 text-center text-sm font-medium border hover:bg-accent transition-colors"
                    >
                      Register as Patient
                    </Link>
                    <Link
                      href="/doctor-register"
                      onClick={() => setIsOpen(false)}
                      className="block w-full rounded-md px-3 py-2 text-center text-sm font-medium border hover:bg-accent transition-colors"
                    >
                      Register as Doctor
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
