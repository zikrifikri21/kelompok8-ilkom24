"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Leaf, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

export default function NavBarLanding() {
  const isMobile = useIsMobile();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 md:border-b-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">EnergiCerdas</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Fitur
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              Tentang
            </Link>
            <Link href="/content" className="text-muted-foreground hover:text-foreground transition-colors">
              Konten Edukasi
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Masuk</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-4 px-4">
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Fitur
                  </Link>
                  <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Tentang
                  </Link>
                  <Link href="/content" className="text-muted-foreground hover:text-foreground transition-colors">
                    Konten Edukasi
                  </Link>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/auth/login">Masuk</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
}
