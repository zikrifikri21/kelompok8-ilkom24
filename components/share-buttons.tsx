"use client";

import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Twitter, Facebook, Linkedin, Mail, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
  size?: "sm" | "lg";
}

export function ShareButtons({ url, title, description, size = "sm" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const { toast } = useToast();

  // Cek apakah navigator.share tersedia setelah mount
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.share) {
      setCanShare(true);
    }
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20-%20${encodedDescription}%0A%0A${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=HematEnergi,EnergiTerbarukan,Lingkungan`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}%20-%20${encodedDescription}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0ABaca selengkapnya: ${encodedUrl}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        toast({
          title: "Berhasil dibagikan!",
          description: "Artikel telah dibagikan menggunakan sistem bawaan perangkat",
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link disalin!",
        description: "Link artikel telah disalin ke clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Gagal menyalin",
        description: "Tidak dapat menyalin link ke clipboard",
        variant: "destructive",
      });
    }
  };

  const buttonSize = size === "lg" ? "default" : "sm";
  const iconClasses = size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
      {canShare && (
        <Button 
          variant="outline" 
          size={buttonSize} 
          onClick={handleNativeShare} 
          className="min-h-[44px] text-xs sm:text-sm bg-transparent"
        >
          <Share2 className={`${iconClasses} mr-1 sm:mr-2`} />
          <span className="hidden sm:inline">Bagikan</span>
        </Button>
      )}

      <Button variant="outline" size={buttonSize} className="min-h-[44px] min-w-[44px] text-xs sm:text-sm bg-transparent" asChild>
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
          <MessageCircle className={`${iconClasses} sm:mr-2`} />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </Button>

      <Button variant="outline" size={buttonSize} className="min-h-[44px] min-w-[44px] text-xs sm:text-sm bg-transparent" asChild>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className={`${iconClasses} sm:mr-2`} />
          <span className="hidden sm:inline">Twitter</span>
        </a>
      </Button>

      <Button variant="outline" size={buttonSize} className="min-h-[44px] min-w-[44px] text-xs sm:text-sm bg-transparent" asChild>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook className={`${iconClasses} sm:mr-2`} />
          <span className="hidden sm:inline">Facebook</span>
        </a>
      </Button>

      <Button variant="outline" size={buttonSize} className="min-h-[44px] min-w-[44px] text-xs sm:text-sm bg-transparent" asChild>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className={`${iconClasses} sm:mr-2`} />
          <span className="hidden sm:inline">LinkedIn</span>
        </a>
      </Button>

      <Button variant="outline" size={buttonSize} className="min-h-[44px] min-w-[44px] text-xs sm:text-sm bg-transparent" asChild>
        <a href={shareLinks.email}>
          <Mail className={`${iconClasses} sm:mr-2`} />
          <span className="hidden sm:inline">Email</span>
        </a>
      </Button>

      <Button 
        variant="outline" 
        size={buttonSize} 
        onClick={handleCopyLink} 
        className="min-h-[44px] min-w-[44px] text-xs sm:text-sm bg-transparent"
      >
        {copied ? 
          <Check className={`${iconClasses} text-green-600 sm:mr-2`} /> : 
          <Copy className={`${iconClasses} sm:mr-2`} />
        }
        <span className="hidden sm:inline">{copied ? "Disalin!" : "Salin Link"}</span>
      </Button>
    </div>
  );
}