"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, Wand2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';

interface GeneratedContent {
  title: string;
  summary: string;
  content: string;
  tags: string;
}

interface AIContentGeneratorProps {
  onContentGenerated: (content: GeneratedContent) => void;
}

export function AIContentGenerator({ onContentGenerated }: AIContentGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("general");
  const [style, setStyle] = useState("informatif");
  const { toast } = useToast();

  const categories = [
    { value: "general", label: "Umum" },
    { value: "rumah_tangga", label: "Rumah Tangga" },
    { value: "energi_terbarukan", label: "Energi Terbarukan" },
    { value: "lingkungan", label: "Lingkungan" },
    { value: "teknologi", label: "Teknologi" },
  ];

  const styles = [
    { value: "informatif", label: "Informatif dan Mudah Dipahami" },
    { value: "praktis", label: "Praktis dengan Tips Langsung" },
    { value: "ilmiah", label: "Ilmiah dengan Data dan Fakta" },
    { value: "storytelling", label: "Bercerita dengan Contoh Nyata" },
  ];

  const topicSuggestions = [
    "Tips menghemat listrik di rumah",
    "Cara mengurangi tagihan air",
    "Manfaat panel surya untuk rumah tangga",
    "Energi terbarukan di Indonesia",
    "Cara mengurangi jejak karbon",
    "Tips hemat energi untuk apartemen",
    "Teknologi smart home untuk efisiensi energi",
    "Cara memilih peralatan hemat energi",
    "Manfaat lampu LED vs lampu biasa",
    "Tips hemat energi di kantor",
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Silakan masukkan topik yang ingin dibahas",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
          category,
          style,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const generatedContent = await response.json();

      onContentGenerated(generatedContent);
      setIsOpen(false);
      setTopic("");

      toast({
        title: "Berhasil!",
        description: "Konten berhasil dihasilkan dengan AI",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Gagal menghasilkan konten. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Sparkles className="w-4 h-4" />
          <p className="hidden md:block">
            Generate dengan AI
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Generator Konten AI
          </DialogTitle>
          <DialogDescription>Gunakan AI untuk membuat konten edukasi tentang hemat energi secara otomatis</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[600px] sm:h-[400px] w-full">
          <div className="space-y-6 m-1">
            {/* Topic Input */}
            <div className="space-y-2">
              <Label htmlFor="topic">Topik yang ingin dibahas</Label>
              <Textarea id="topic" placeholder="Contoh: Tips menghemat listrik di rumah untuk keluarga Indonesia" value={topic} onChange={(e) => setTopic(e.target.value)} rows={3} />
            </div>

            {/* Topic Suggestions */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Saran Topik
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {topicSuggestions.slice(0, 6).map((suggestion, index) => (
                  <Button key={index} variant="outline" size="sm" className="justify-start text-left h-auto p-2 text-xs" onClick={() => handleSuggestionClick(suggestion)}>
                    <p className="truncate">{suggestion}</p>
                  </Button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="style">Gaya Penulisan</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih gaya" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {styles.map((styleOption) => (
                      <SelectItem key={styleOption.value} value={styleOption.value}>
                        {styleOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Info Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">Tips untuk hasil terbaik:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Gunakan topik yang spesifik dan jelas</li>
                      <li>• Sertakan konteks Indonesia jika relevan</li>
                      <li>• Pilih kategori yang sesuai dengan topik</li>
                      <li>• AI akan menghasilkan artikel 500-800 kata</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isGenerating}>
            Batal
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating || !topic.trim()}>
            {isGenerating ? (
              <>
                {/* <Sparkles className="w-4 h-4 mr-2 animate-spin" /> */}
                <Image
                  src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXlzejdrcnAyY3FhdGlxcGw0bzZoY3lnNGYxN3Vlb2ppNm9nMzVveiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/fvT2uzkzsSWmmkvl5g/giphy.webp"
                  alt="sparkle"
                  width={30}
                  height={30}
                />
                Menghasilkan...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Konten
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
