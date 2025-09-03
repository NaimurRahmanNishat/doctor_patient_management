"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemsProps {
  className?: string;
  onItemClick?: () => void;
}

const navItems = [
  { label: "Home", path: "/" },
  { label: "Patient", path: "/patient" },
  { label: "Doctor", path: "/doctor" },
  { label: "Contact", path: "/contact" },
];

const NavItems = ({ className, onItemClick }: NavItemsProps) => {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-1 md:gap-3", className)}>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.path}
          onClick={onItemClick}
          className={cn(
            "px-3 py-2 text-sm md:text-base font-medium rounded-md transition-colors",
            pathname === item.path
              ? "text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavItems;
