"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ShareButtons } from "@/components/share-buttons";
import { useMemo } from "react";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  thumbnail_url?: string;
  category: string;
  tags: string[];
  created_at: string;
}

interface ContentGridProps {
  contents: ContentItem[];
}

export function ContentGrid({ contents }: ContentGridProps) {
  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Belum Ada Konten</h3>
        <p className="text-muted-foreground">Konten edukasi akan segera tersedia</p>
      </div>
    );
  }

  const siteUrl = useMemo(() => (process.env.NEXT_PUBLIC_SITE_URL || "https://energicerdas.com").trim(), []);

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      rumah_tangga: "Rumah Tangga",
      energi_terbarukan: "Energi Terbarukan",
      lingkungan: "Lingkungan",
      teknologi: "Teknologi",
      general: "Umum",
    };
    return categoryMap[category] || category;
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} menit baca`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{contents.length} artikel ditemukan</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {contents.map((content) => (
          <Card key={content.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            {content.thumbnail_url && (
              <div className="aspect-video relative overflow-hidden">
                <Image src={content.thumbnail_url || "/placeholder.svg"} alt={content.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {getCategoryLabel(content.category)}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {getReadingTime(content.content)}
                </div>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">{content.title}</CardTitle>
              <CardDescription className="line-clamp-3">{content.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {content.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {content.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{content.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    {new Date(content.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-8 sm:h-9" asChild>
                      <Link href={`/content/${content.id}`}>
                        Baca Selengkapnya
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">Bagikan artikel:</span>
                    <ShareButtons url={`${siteUrl}/content/${content.id}`} title={content.title} description={content.summary} size="sm" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
