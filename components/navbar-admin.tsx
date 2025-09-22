"use client";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Leaf, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface AdminUser {
  email: string
  role: string
}
// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
  <svg className={cn("pointer-events-none", className)} width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path d="M4 12H20" className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45" />
    <path d="M4 12H20" className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]" />
  </svg>
);

const UserMenu = ({ userName = "John Doe", userEmail = "john@example.com", userAvatar, onItemClick }: { userName?: string; userEmail?: string; userAvatar?: string; onItemClick?: (item: string) => void }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground">
        <Avatar className="h-7 w-7">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="text-xs">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <ChevronDownIcon className="h-3 w-3 ml-1" />
        <span className="sr-only">User menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{userName}</p>
          <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onItemClick?.("logout")}>
        <LogOut className="mr-2 h-4 w-4" />
            Log out
        </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
// Types
export interface NavbarAdminNavItem {
  href?: string;
  label: string;
}
export interface NavbarAdminProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: NavbarAdminNavItem[];
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
  onNavItemClick?: (href: string) => void;
  onInfoItemClick?: (item: string) => void;
  onNotificationItemClick?: (item: string) => void;
  onUserItemClick?: (item: string) => void;
}
// Default navigation links
const defaultNavigationLinks: NavbarAdminNavItem[] = [
  { href: "#", label: "Admin Panel" },
  { href: "/content", label: "Lihat Website" },
];
export const NavbarAdmin = React.forwardRef<HTMLElement, NavbarAdminProps>(
  (
    {
      className,
      logo = <Leaf />,
      logoHref = "#",
      navigationLinks = defaultNavigationLinks,
      userName = "John Doe",
      userEmail = "john@example.com",
      userAvatar,
      notificationCount = 3,
      onNavItemClick,
      onInfoItemClick,
      onNotificationItemClick,
      onUserItemClick,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const [user, setUser] = useState<AdminUser | null>(null)
    const router = useRouter()
    const supabase = createClient()


    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };
      checkWidth();
      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    useEffect(() => {
        const getUser = async () => {
        const {
            data: { user: authUser },
        } = await supabase.auth.getUser()

        if (authUser) {
            const { data: adminUser } = await supabase
            .from("admin_users")
            .select("email, role")
            .eq("id", authUser.id)
            .single()

            if (adminUser) {
            setUser(adminUser)
            }
        }
        }

        getUser()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );
    return (
      <header ref={combinedRef} className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline", className)} {...props}>
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground" variant="ghost" size="icon">
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-full p-1">
                  <NavigationMenu className="w-full">
                    <NavigationMenuList className="flex-col gap-0 w-full">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <Link
                            href={link.href}
                            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            <div className="flex items-center gap-6">
              <button onClick={(e) => e.preventDefault()} className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer">
                <div className="text-2xl">{logo}</div>
                <span className="hidden font-bold text-xl sm:inline-block">EnergiCerdas</span>
              </button>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuLink
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault();
                            if (onNavItemClick && link.href) onNavItemClick(link.href);
                          }}
                          className="text-muted-foreground hover:text-primary font-medium transition-colors cursor-pointer group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* User menu */}
            {user && (
            <UserMenu userName={user?.email} userEmail={user?.role} userAvatar={user?.email.charAt(0).toUpperCase()} onItemClick={handleLogout} />
            )}
          </div>
        </div>
      </header>
    );
  }
);
NavbarAdmin.displayName = "NavbarAdmin";
export { Leaf, HamburgerIcon, UserMenu };
