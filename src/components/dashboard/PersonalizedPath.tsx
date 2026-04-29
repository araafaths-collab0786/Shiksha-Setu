
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Sparkles, ArrowRight, BookOpen, Video, FileText } from 'lucide-react';
import { personalizedLearningPath, type PersonalizedLearningPathOutput } from '@/ai/flows/personalized-learning-path';

export function PersonalizedPath() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState<PersonalizedLearningPathOutput | null>(null);

  useEffect(() => {
    async function loadPath() {
      try {
        const result = await personalizedLearningPath({
          quizPerformance: [
            { topic: "Algebra", score: 65, weaknesses: ["Quadratic Equations", "Factoring"] },
            { topic: "Photosynthesis", score: 92, weaknesses: [] }
          ],
          engagementData: [
            { topic: "Algebra", contentType: "video", progress: 40, timeSpentMinutes: 15 },
            { topic: "History", contentType: "textbook", progress: 80, timeSpentMinutes: 45 }
          ]
        });
        setPath(result);
      } catch (err) {
        console.error("Failed to load learning path", err);
      } finally {
        setLoading(false);
      }
    }
    loadPath();
  }, []);

  if (loading) {
    return (
      <Card className="border-none shadow-sm animate-pulse">
        <div className="h-64 bg-muted/20 rounded-lg"></div>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm bg-primary/5">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="font-headline text-lg">{t('personalizedPath')}</CardTitle>
          <CardDescription className="text-muted-foreground/80">AI-generated based on your performance</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {path?.relevantTopics.map((topic, i) => (
            <Badge key={i} variant="outline" className="bg-white/50 border-primary/20 text-primary">
              {topic}
            </Badge>
          ))}
        </div>

        <div className="grid gap-3">
          {path?.recommendedContent.slice(0, 3).map((content, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-primary/5 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="bg-accent p-2 rounded-lg text-secondary">
                  {content.type === 'video_lecture' ? <Video className="h-4 w-4" /> : 
                   content.type === 'practice_set' ? <FileText className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{content.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{content.reason}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground italic bg-white/40 p-3 rounded-lg border border-dashed border-primary/20">
          "{path?.overallSummary}"
        </p>
      </CardContent>
    </Card>
  );
}
