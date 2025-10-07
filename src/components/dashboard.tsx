"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { getSuggestedPrompt, generateImageAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Film, Feather, Palette, Download, Sparkles, Image as ImageIcon, History, Users, Crown, Zap, CheckCircle2 } from "lucide-react";

type StylePreset = "Cinematic" | "Minimalist" | "Anime";

const communityImages = [
  { src: "https://placehold.co/1024x576.png", prompt: "A hyper-realistic portrait of a cyborg philosopher", hint: "cyborg philosopher" },
  { src: "https://placehold.co/1024x576.png", prompt: "Ancient library in a futuristic city, raining outside", hint: "library city" },
  { src: "https://placehold.co/1024x576.png", prompt: "A tranquil scene of bioluminescent mushrooms in a dark forest", hint: "bioluminescent mushrooms" },
  { src: "https://placehold.co/1024x576.png", prompt: "A majestic steampunk airship soaring through clouds", hint: "steampunk airship" },
];

export default function AetherSynthDashboard() {
  const [prompt, setPrompt] = useState("A futuristic cityscape with neon lights, 8k resolution, detailed, cinematic lighting");
  const [style, setStyle] = useState<StylePreset>("Cinematic");
  const [resolution, setResolution] = useState([1024]);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [imageUrl, setImageUrl] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const { toast } = useToast();

  useEffect(() => {
    // Set an initial image on mount
    const initialImageUrl = "https://placehold.co/1024x576.png";
    setImageUrl(initialImageUrl);
    // Preload image
    const img = new window.Image();
    img.src = initialImageUrl;
  }, []);

  const [isPending, startTransition] = useTransition();
  
  const handleGenerate = () => {
    startTransition(async () => {
      setIsGenerating(true);
      setProgress(0); // Reset progress

      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const result = await generateImageAction({
        prompt,
        style,
        resolution: resolution[0],
        aspectRatio,
      });

      clearInterval(interval);
      setProgress(100);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Image Generation Failed",
          description: result.error,
        });
      } else if (result.imageUrl) {
        setImageUrl(result.imageUrl);
        setHistory(prev => [result.imageUrl!, ...prev]);
      }
      setIsGenerating(false);
    });
  };

  const getGlassmorphismStyle = () => ({
    background: 'rgba(37, 47, 64, 0.2)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  });

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-2">
          <Sparkles className="text-accent w-7 h-7" />
          Girish AI
        </h1>
        <PlansDialog />
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-xl shadow-2xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/20" style={getGlassmorphismStyle()}>
            <CardHeader>
              <CardTitle>Create your vision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., An astronaut riding a horse on Mars"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-primary/50 text-base"
                  rows={5}
                />
              </div>
              <PromptAssistDialog setPrompt={setPrompt} />
            </CardContent>
          </Card>
          
          <Card className="rounded-xl shadow-2xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/20" style={getGlassmorphismStyle()}>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Style Presets</Label>
                <div className="flex gap-2 flex-wrap">
                  <PresetButton icon={Film} label="Cinematic" currentStyle={style} setStyle={setStyle} />
                  <PresetButton icon={Feather} label="Minimalist" currentStyle={style} setStyle={setStyle} />
                  <PresetButton icon={Palette} label="Anime" currentStyle={style} setStyle={setStyle} />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="resolution">Resolution: {resolution[0]}px</Label>
                <Slider
                  id="resolution"
                  min={512}
                  max={8192}
                  step={64}
                  value={resolution}
                  onValueChange={setResolution}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger id="aspect-ratio" className="w-full bg-primary/50">
                    <SelectValue placeholder="Select ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_0px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_30px_5px_hsl(var(--accent)/0.6)]"
            onClick={handleGenerate}
            disabled={isGenerating || isPending}
          >
            {isGenerating || isPending ? "Generating..." : "Generate"}
          </Button>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-primary/50">
              <TabsTrigger value="preview"><ImageIcon className="mr-2" />Preview</TabsTrigger>
              <TabsTrigger value="history"><History className="mr-2" />History</TabsTrigger>
              <TabsTrigger value="community"><Users className="mr-2" />Community</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="flex-grow">
              <Card className="rounded-xl shadow-2xl h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-accent/20" style={getGlassmorphismStyle()}>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>Preview</CardTitle>
                  <Button variant="ghost" size="icon" disabled={isGenerating || !imageUrl || imageUrl.startsWith('https://placehold.co')}>
                    <Download className="w-5 h-5" />
                    <span className="sr-only">Download</span>
                  </Button>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center relative aspect-[16/9] bg-primary/20 rounded-b-xl overflow-hidden">
                  {(isGenerating || isPending) && progress < 100 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center">
                      <div className="w-full max-w-md p-4">
                        <p className="text-lg mb-2 text-gray-300">Generating your masterpiece...</p>
                        <Progress value={progress} className="w-full h-2 bg-primary/50 [&>div]:bg-accent" />
                        <p className="text-sm mt-2 text-gray-400">{progress}% complete</p>
                      </div>
                    </div>
                  ) : imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={prompt}
                        width={1024}
                        height={576}
                        className="object-contain w-full h-full animate-in fade-in zoom-in-95 duration-500"
                        data-ai-hint="futuristic cityscape"
                        key={imageUrl}
                      />
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                        <ImageIcon size={48} />
                        <p>Your generated image will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="flex-grow">
              <Card className="rounded-xl shadow-2xl h-full flex flex-col" style={getGlassmorphismStyle()}>
                  <CardHeader><CardTitle>Your Creations</CardTitle></CardHeader>
                  <CardContent className="flex-grow overflow-auto">
                    {history.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {history.map((imgSrc, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                             <Image src={imgSrc} alt={`Generated image ${index + 1}`} layout="fill" className="object-cover" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <Button variant="ghost" size="icon"><Download /></Button>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground pt-10">No images generated yet.</div>
                    )}
                  </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="community" className="flex-grow">
              <Card className="rounded-xl shadow-2xl h-full flex flex-col" style={getGlassmorphismStyle()}>
                <CardHeader><CardTitle>Community Gallery</CardTitle></CardHeader>
                <CardContent className="flex-grow overflow-auto">
                   <div className="grid grid-cols-2 gap-4">
                      {communityImages.map((img, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                           <Image src={img.src} alt={img.prompt} data-ai-hint={img.hint} layout="fill" className="object-cover" />
                           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs truncate">{img.prompt}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function PromptAssistDialog({ setPrompt }: { setPrompt: (prompt: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [basicPrompt, setBasicPrompt] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSuggestion = () => {
    startTransition(async () => {
      setSuggestion("");
      const result = await getSuggestedPrompt(basicPrompt);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else if (result.suggestedPrompt) {
        setSuggestion(result.suggestedPrompt);
      }
    });
  };
  
  const useSuggestion = () => {
    setPrompt(suggestion);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-primary/50 border-accent/50 text-accent hover:bg-accent/10 hover:text-accent transition-all transform hover:scale-105">
          <Wand2 className="mr-2 h-4 w-4" />
          Prompt Assist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-primary border-border" style={{background: 'hsl(var(--primary))'}}>
        <DialogHeader>
          <DialogTitle>Prompt Assistant</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="basic-prompt">Describe your image</Label>
          <Input
            id="basic-prompt"
            value={basicPrompt}
            onChange={(e) => setBasicPrompt(e.target.value)}
            placeholder="e.g., a knight in a forest"
          />
          <Button onClick={handleSuggestion} disabled={isPending || !basicPrompt}>
            {isPending ? "Thinking..." : "Get Suggestion"}
          </Button>
          {suggestion && (
            <div className="space-y-2">
                <Label>Suggestion</Label>
                <p className="text-sm p-3 bg-secondary rounded-md">{suggestion}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={useSuggestion} disabled={!suggestion}>Use Suggestion</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PresetButton({ icon: Icon, label, currentStyle, setStyle }: { icon: React.ElementType, label: StylePreset, currentStyle: StylePreset, setStyle: (style: StylePreset) => void }) {
  const isActive = currentStyle === label;
  return (
    <Button
      variant={isActive ? "default" : "secondary"}
      onClick={() => setStyle(label)}
      className={`flex-1 transition-all transform hover:scale-105 ${isActive ? 'bg-accent text-accent-foreground' : 'bg-primary/50'}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

function PlansDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-accent border-accent backdrop-blur-sm bg-primary/30 hover:bg-accent/10 hover:text-accent transition-all transform hover:scale-105">
          <Crown className="mr-2 h-4 w-4" />
          Upgrade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-primary border-border" style={{background: 'hsl(var(--primary))'}}>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Unlock more features and take your creations to the next level.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
          <PlanCard
            title="Pro"
            price="$15"
            period="/month"
            features={[
              "Up to 4K resolution",
              "Priority generation queue",
              "Access to all style presets",
              "Commercial license",
            ]}
            cta="Upgrade to Pro"
            recommended={true}
          />
          <PlanCard
            title="Free"
            price="$0"
            period="/month"
            features={[
              "Up to 1024px resolution",
              "Standard generation speed",
              "Limited style presets",
              "Personal use only",
            ]}
            cta="Current Plan"
            disabled={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PlanCard({ title, price, period, features, cta, recommended = false, disabled = false }: {
  title: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  recommended?: boolean;
  disabled?: boolean;
}) {
  return (
    <Card className={`rounded-xl shadow-lg transition-all ${recommended ? 'border-accent shadow-accent/20' : ''}`} style={{background: 'hsl(var(--secondary))'}}>
      <CardHeader>
        {recommended && <Badge variant="outline" className="w-fit text-accent border-accent">Recommended</Badge>}
        <CardTitle className="text-2xl font-bold pt-2">{title}</CardTitle>
        <div>
          <span className="text-4xl font-extrabold">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button className="w-full text-lg" disabled={disabled} variant={recommended ? 'default' : 'outline'}>
          {cta}
        </Button>
      </CardContent>
    </Card>
  )
}
