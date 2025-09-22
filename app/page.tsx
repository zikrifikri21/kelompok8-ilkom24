"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Leaf, Lightbulb, Sun, Zap, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import ElectricityCalculator from "@/components/electricity-calculator";
import NavbarLanding from "@/components/ui/navbar-landing";
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
    <Head>
        <title>Aplikasi Hemat Energi - Solusi Cerdas untuk Masa Depan Berkelanjutan</title>
        <meta name="description" content="Platform edukasi dan manajemen energi terbarukan untuk kehidupan yang lebih hemat dan berkelanjutan" />
        <meta name="keywords" content="login, green energy, renewable energy, wind turbines, sustainable technology" />

        {/* Open Graph meta tags */}
        <meta property="og:title" content="Login - Green Energy Platform" />
        <meta property="og:description" content="Platform edukasi dan manajemen energi terbarukan untuk kehidupan yang lebih hemat dan berkelanjutan" />
        <meta
          property="og:image"
          content="https://www.omv.com/images/GvflD8YyeyxOOJFgPN1juD8YainJ-lH3HR5e-kVPCCk/c:4000:2250:fp:0.589:0.512/resize:fill-down:768:432/plain/local:///2024/06/9eb4fa9b-6881-65bd-c3e3-d8ca49a106e8/OMV_Energy_Green-Hydrogen_Wind-Turbine-Aerial-View-01_RGB_web.jpg@webp"
        />
        <meta property="og:image:alt" content="Aerial view of wind turbines generating green energy" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login - Green Energy Platform" />
        <meta name="twitter:description" content="Platform edukasi dan manajemen energi terbarukan untuk kehidupan yang lebih hemat dan berkelanjutan" />
        <meta
          name="twitter:image"
          content="https://www.omv.com/images/GvflD8YyeyxOOJFgPN1juD8YainJ-lH3HR5e-kVPCCk/c:4000:2250:fp:0.589:0.512/resize:fill-down:768:432/plain/local:///2024/06/9eb4fa9b-6881-65bd-c3e3-d8ca49a106e8/OMV_Energy_Green-Hydrogen_Wind-Turbine-Aerial-View-01_RGB_web.jpg@webp"
        />
        <meta name="twitter:image:alt" content="Aerial view of wind turbines generating green energy" />

        {/* Additional meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#059669" />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : ""} />
      </Head>
    <div className="min-h-screen bg-background">

      {/* Navigation */}
      <NavbarLanding />
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto text-center relative">
          <div className="animate-fade-in-up">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              🌱 Platform Hemat Energi Terdepan
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair text-retro text-foreground mb-6 text-balance">
              APLIKASI
              <br />
              <span className="text-primary">HEMAT ENERGI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-vintage text-pretty">
              Solusi cerdas untuk mengelola konsumsi energi, belajar tentang energi terbarukan, dan menciptakan masa depan yang lebih berkelanjutan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#calculator">
                <Button size="lg" className="text-lg px-8 py-6 w-full" >
                  Mulai Sekarang
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
                <Link href="/content" >
                    <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent w-full">
                        Konten Edukasi
                    </Button>
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Energy Icons Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            <div className="flex flex-col items-center gap-3 animate-float">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Sun className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Panel Surya</span>
            </div>
            <div className="flex flex-col items-center gap-3 animate-float" style={{ animationDelay: "1s" }}>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-accent" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">LED Hemat Energi</span>
            </div>
            <div className="flex flex-col items-center gap-3 animate-float" style={{ animationDelay: "2s" }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Energi Hijau</span>
            </div>
            <div className="flex flex-col items-center gap-3 animate-float" style={{ animationDelay: "3s" }}>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Efisiensi Energi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Electricity Calculator Section */}
      <section className="py-20 px-4" id="calculator">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair text-retro text-foreground mb-4">Kalkulator Penggunaan Listrik</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-vintage">Hitung konsumsi listrik rumah Anda dan dapatkan rekomendasi hemat energi dari AI</p>
          </div>
          <ElectricityCalculator />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair text-retro text-foreground mb-4">Fitur Unggulan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-vintage">Temukan berbagai fitur canggih yang membantu Anda mengelola energi dengan lebih efisien</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Konten Edukasi</h3>
                <p className="text-muted-foreground text-vintage mb-4">Akses ribuan artikel, video, dan panduan tentang energi terbarukan dan tips hemat energi</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  Pelajari lebih lanjut <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">AI Generator</h3>
                <p className="text-muted-foreground text-vintage mb-4">Buat konten edukasi otomatis dengan bantuan AI untuk tips hemat energi yang personal</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  Coba sekarang <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Komunitas</h3>
                <p className="text-muted-foreground text-vintage mb-4">Bergabung dengan komunitas peduli lingkungan dan berbagi pengalaman hemat energi</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  Gabung komunitas <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-playfair text-retro mb-6">Mulai Perjalanan Hemat Energi Anda</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-vintage">Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat menghemat energi dan berkontribusi untuk planet yang lebih hijau</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Daftar Gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
              Lihat Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-foreground">EnergiCerdas</span>
              </div>
              <p className="text-muted-foreground text-sm text-vintage">Platform terdepan untuk edukasi dan manajemen energi berkelanjutan di Indonesia</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Fitur</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Konten Edukasi
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-foreground transition-colors">
                    AI Generator
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Komunitas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Admin Panel
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Karir
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Dukungan</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Dokumentasi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Syarat Layanan
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EnergiCerdas. Semua hak dilindungi undang-undang.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
