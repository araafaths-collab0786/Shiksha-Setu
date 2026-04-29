"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function QuizzesPage() {
  const { t } = useLanguage();

  const activeQuizzes = [
    { title: 'Algebraic Identities', subject: 'Mathematics', questions: 15, time: '20 mins', difficulty: 'Medium' },
    { title: 'Photosynthesis Deep Dive', subject: 'Science', questions: 10, time: '15 mins', difficulty: 'Easy' },
    { title: 'World War II Timeline', subject: 'History', questions: 20, time: '30 mins', difficulty: 'Hard' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-headline font-bold text-primary">{t('quizzes')}</h1>
          <p className="text-muted-foreground text-lg">Challenge yourself and track your learning progress.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeQuizzes.map((quiz, idx) => (
            <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-all group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                    {quiz.subject}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {quiz.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold">{quiz.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 pt-2">
                  <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3" /> {quiz.questions} Qs</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {quiz.time}</span>
                </CardDescription>
              </CardHeader>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button className="w-full group-hover:bg-primary transition-colors">
                  {t('startQuiz')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>

        <Card className="border-none shadow-sm bg-accent/30 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <CheckCircle2 className="h-12 w-12 text-secondary" />
            </div>
            <div className="space-y-2 text-center md:text-left flex-1">
              <h2 className="text-2xl font-headline font-bold">Practice makes perfect</h2>
              <p className="text-muted-foreground">Complete quizzes to unlock personalized learning recommendations from your AI tutor.</p>
            </div>
            <Button variant="outline" className="rounded-full">View History</Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
