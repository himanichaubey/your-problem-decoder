import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Zap, Sparkles, Trophy } from "lucide-react";
import logo from "@/assets/logo.png";
import confetti from "canvas-confetti";

const getLevel = (points: number) => {
  if (points < 5) return 1;
  if (points < 20) return 2;
  return 3;
};

const Index = () => {
  const [problem, setProblem] = useState("");
  const [tone, setTone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [excuse, setExcuse] = useState("");
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    // Load points and level from localStorage
    const savedPoints = localStorage.getItem("escapePoints");
    const savedLevel = localStorage.getItem("escapeLevel");
    
    if (savedPoints) {
      const pts = parseInt(savedPoints, 10);
      setPoints(pts);
      setLevel(getLevel(pts));
    }
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        "https://swadhyay-clothing-01.app.n8n.cloud/webhook/6d8e71bc-9c26-4cf6-8027-82ba071e53a9",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problem: problem.trim(),
            tone: tone,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExcuse(data.output || "");
        
        // Add point and check for level up
        const newPoints = points + 1;
        const oldLevel = level;
        const newLevel = getLevel(newPoints);
        
        setPoints(newPoints);
        setLevel(newLevel);
        
        // Save to localStorage
        localStorage.setItem("escapePoints", newPoints.toString());
        localStorage.setItem("escapeLevel", newLevel.toString());
        
        // Check if leveled up
        if (newLevel > oldLevel) {
          triggerConfetti();
          toast({
            title: `🎉 Level Up! You're now Level ${newLevel}!`,
            description: `Keep escaping those sticky situations!`,
          });
        } else {
          toast({
            title: "Escape route sent! 🚀",
            description: `+1 point! You now have ${newPoints} points.`,
          });
        }
        
        setProblem("");
        setTone("");
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Get Me Outta This Logo" className="w-12 h-12 animate-glow-pulse" />
          <div>
            <h1 className="text-primary font-bold text-xl tracking-tight">Get Me Outta This</h1>
            <p className="text-muted-foreground text-sm">Your escape route finder</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-primary">Stuck? Trapped?</span>
            <br />
            <span className="text-primary">Overwhelmed?</span>
          </h2>
          <p className="text-foreground text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            We'll help you find your way out of any situation – from awkward conversations to life decisions! 🎯
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-gradient-card backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 hover:border-primary/40 transition-all duration-300">
              <Lightbulb className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">Creative Solutions</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-card backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 hover:border-primary/40 transition-all duration-300">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">Instant Help</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-card backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 hover:border-primary/40 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">Multiple Tones</span>
            </div>
          </div>

          {/* Level Display */}
          <div className="flex items-center justify-center gap-3 mb-12 bg-gradient-card backdrop-blur-sm border border-primary/20 rounded-2xl px-8 py-4 max-w-sm mx-auto hover:border-primary/40 transition-all duration-300">
            <Trophy className="w-6 h-6 text-primary animate-glow-pulse" />
            <div className="flex items-center gap-3">
              <span className="text-foreground font-bold text-lg">Level {level}</span>
              <span className="text-muted-foreground">⭐</span>
              <span className="text-primary font-semibold">{points} points</span>
            </div>
          </div>
        </div>

        {/* Problem Submission Form */}
        <div className="max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="bg-gradient-card backdrop-blur-md border border-primary/20 rounded-2xl p-8 shadow-2xl hover:border-primary/30 transition-all duration-300">
            <h3 className="text-3xl font-bold text-primary mb-4">What's Got You Stuck?</h3>
            <p className="text-muted-foreground mb-6">Tell us your problem and we'll help you escape it! 🚀</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tone Selector */}
              <div className="space-y-2">
                <label htmlFor="tone" className="text-sm font-medium text-foreground block">
                  Choose Your Escape Tone
                </label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone" className="bg-secondary/50 border-primary/20 hover:border-primary/40 transition-all duration-300">
                    <SelectValue placeholder="Select a tone..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-primary/20">
                    <SelectItem value="funny">😂 Funny</SelectItem>
                    <SelectItem value="realistic">💼 Realistic</SelectItem>
                    <SelectItem value="outrageous">🎪 Outrageous</SelectItem>
                    <SelectItem value="serious">🎯 Serious</SelectItem>
                    <SelectItem value="sarcastic">😏 Sarcastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Problem Input */}
              <div className="space-y-2">
                <label htmlFor="problem" className="text-sm font-medium text-foreground block">
                  What's the situation?
                </label>
                <Textarea
                  id="problem"
                  placeholder="Describe your predicament here... The more details, the better the escape route!"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="min-h-[180px] bg-secondary/50 border-primary/20 focus:border-primary/60 transition-all duration-300 resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={!problem.trim() || !tone || isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Get Me Outta Here! 🚪"}
              </Button>
            </form>
          </div>

          {/* Excuse Display */}
          {excuse && (
            <div className="mt-8 animate-fade-in">
              <div className="bg-gradient-card backdrop-blur-md border border-primary/30 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Here is your Excuse!
                </h3>
                <p className="text-foreground text-lg leading-relaxed">{excuse}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
