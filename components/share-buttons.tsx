"use client"

import { Button } from "@/components/ui/button"
import { Share2, MessageCircle, Twitter, Facebook, Linkedin, Mail, Copy, Check } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonsProps {
  url: string
  title: string
  description: string
  size?: "sm" | "lg"
}

export function ShareButtons({ url, title, description, size = "sm" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20-%20${encodedDescription}%0A%0A${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=HematEnergi,EnergiTerbarukan,Lingkungan`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}%20-%20${encodedDescription}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0ABaca selengkapnya: ${encodedUrl}`,
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
        toast({
          title: "Berhasil dibagikan!",
          description: "Artikel telah dibagikan menggunakan sistem bawaan perangkat",
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: "Link disalin!",
        description: "Link artikel telah disalin ke clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Gagal menyalin",
        description: "Tidak dapat menyalin link ke clipboard",
        variant: "destructive",
      })
    }
  }

  const buttonSize = size === "lg" ? "default" : "sm"
  const iconSize = size === "lg" ? "w-5 h-5" : "w-4 h-4"

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Native Share (Mobile) */}
      {typeof navigator !== "undefined" && navigator.share && (
        <Button variant="outline" size={buttonSize} onClick={handleNativeShare}>
          <Share2 className={`${iconSize} mr-2`} />
          Bagikan
        </Button>
      )}

      {/* WhatsApp */}
      <Button variant="outline" size={buttonSize} asChild>
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
          <MessageCircle className={`${iconSize} mr-2`} />
          WhatsApp
        </a>
      </Button>

      {/* Twitter */}
      <Button variant="outline" size={buttonSize} asChild>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className={`${iconSize} mr-2`} />
          Twitter
        </a>
      </Button>

      {/* Facebook */}
      <Button variant="outline" size={buttonSize} asChild>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook className={`${iconSize} mr-2`} />
          Facebook
        </a>
      </Button>

      <Button variant="outline" size={buttonSize} asChild>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className={`${iconSize} mr-2`} />
          LinkedIn
        </a>
      </Button>

      <Button variant="outline" size={buttonSize} asChild>
        <a href={shareLinks.email}>
          <Mail className={`${iconSize} mr-2`} />
          Email
        </a>
      </Button>

      <Button variant="outline" size={buttonSize} onClick={handleCopyLink}>
        {copied ? <Check className={`${iconSize} mr-2 text-green-600`} /> : <Copy className={`${iconSize} mr-2`} />}
        {copied ? "Disalin!" : "Salin Link"}
      </Button>
    </div>
  )
}
