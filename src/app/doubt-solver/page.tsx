
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, BrainCircuit, RotateCcw, Volume2, Share2 } from 'lucide-react';
import { aiDoubtSolver, type AiDoubtSolverOutput } from '@/ai/flows/ai-doubt-solver';
import { useToast } from '@/hooks/use-toast';

export default function DoubtSolverPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [result, setResult] = useState<AiDoubtSolverOutput | null>(null);

  const handleSolve = async () => {
    if (!input.trim()) return;
    
    setIsSolving(true);
    try {
      const response = await aiDoubtSolver({ doubtText: input });
      setResult(response);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to solve your doubt. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsSolving(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <header className="text-center space-y-3">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BrainCircuit className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-headline font-bold text-primary">{t('doubtSolver')}</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Get clear, step-by-step explanations for your academic doubts instantly using AI.
            </p>
          </header>

          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 bg-white space-y-4">
                <Textarea 
                  placeholder={t('askPlaceholder')}
                  className="min-h-[150px] text-lg border-none focus-visible:ring-0 resize-none p-0"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isSolving}
                />
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 hover:bg-accent text-primary">
                      <Mic className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button 
                    className="rounded-full px-8 h-12 text-lg font-semibold shadow-md transition-all hover:scale-105"
                    disabled={isSolving || !input.trim()}
                    onClick={handleSolve}
                  >
                    {isSolving ? 'Thinking...' : t('askDoubt')}
                    {!isSolving && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-none shadow-md overflow-hidden bg-white">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-headline flex items-center gap-2">
                      <BrainCircuit className="h-5 w-5 text-primary" /> Explanation
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  <div className="prose prose-blue max-w-none">
                    <p className="text-lg leading-relaxed text-foreground/90">
                      {result.explanation}
                    </p>
                  </div>

                  {result.solution && (
                    <div className="bg-accent/30 p-6 rounded-2xl border border-primary/10 space-y-4">
                      <h3 className="font-headline font-bold text-primary flex items-center gap-2">
                        Step-by-Step Solution
                      </h3>
                      <div className="text-foreground/80 whitespace-pre-line leading-relaxed">
                        {result.solution}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center pt-4">
                    <Button variant="outline" className="rounded-full" onClick={handleReset}>
                      <RotateCcw className="mr-2 h-4 w-4" /> Ask another question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
