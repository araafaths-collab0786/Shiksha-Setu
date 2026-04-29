"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Navbar } from '@/components/layout/Navbar';
import { ProgressOverview } from '@/components/dashboard/ProgressOverview';
import { PersonalizedPath } from '@/components/dashboard/PersonalizedPath';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, HelpCircle, GraduationCap, ArrowRight, Download, BrainCircuit, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isUserLoading && !user) {
      router.push('/login');
    }
  }, [mounted, isUserLoading, user, router]);

  const quickLinks = useMemo(() => [
    { title: t('doubtSolver'), icon: BrainCircuit, href: '/doubt-solver', description: 'Ask questions & get solutions instantly', color: 'bg-primary' },
    { title: t('learningContent'), icon: BookOpen, href: '/learning', description: 'Access textbooks and videos offline', color: 'bg-secondary' },
    { title: t('quizzes'), icon: HelpCircle, href: '/quizzes', description: 'Test your knowledge with practice sets', color: 'bg-blue-400' },
  ], [t]);

  const handleDownloadAll = () => {
    toast({
      title: "Sync Started",
      description: "Downloading all pending curriculum updates for offline use.",
    });
  };

  if (!mounted || isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight text-primary">
              {t('welcome')}, {user.displayName || user.email?.split('@')[0] || 'Student'}!
            </h1>
            <p className="text-muted-foreground mt-1">Keep track of your progress and start where you left off.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="flex items-center gap-2 bg-white" onClick={handleDownloadAll}>
                <Download className="h-4 w-4" /> Download All
             </Button>
             <Button asChild className="flex items-center gap-2 shadow-md">
               <Link href="/learning">
                 Resume Learning <ArrowRight className="h-4 w-4" />
               </Link>
             </Button>
          </div>
        </header>

        <ProgressOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-headline font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /> Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickLinks.map((link, idx) => (
                  <Link key={idx} href={link.href} className="block group">
                    <Card className="h-full border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer bg-white">
                      <CardContent className="pt-6">
                        <div className={`${link.color} text-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <link.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{link.title}</h3>
                        <p className="text-sm text-muted-foreground leading-snug">{link.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-headline font-bold mb-4 flex items-center gap-2">
                Recent Lessons
              </h2>
              <div className="space-y-3">
                {[
                  { title: 'Basic Algebra', subject: 'Mathematics', initial: 'M', href: '/learning' },
                  { title: 'Ecosystems', subject: 'Science', initial: 'S', href: '/learning' }
                ].map((lesson, i) => (
                  <Link key={i} href={lesson.href}>
                    <Card className="border-none shadow-sm group cursor-pointer hover:bg-accent/30 transition-colors bg-white mt-3">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold text-lg group-hover:bg-primary group-hover:text-white transition-all">
                            {lesson.initial}
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{lesson.title}</h4>
                            <p className="text-xs text-muted-foreground">{lesson.subject} • 45m left</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Continue
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <PersonalizedPath />
            
            <Card className="border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-headline">Offline Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Storage Used</span>
                    <span className="font-semibold">1.2 GB / 4 GB</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Algebra.mp4</span>
                      <span className="text-green-600 font-medium">Downloaded</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Physics_Ch3.pdf</span>
                      <span className="text-green-600 font-medium">Downloaded</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <footer className="border-t py-8 bg-white/50">
        <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-headline font-bold text-primary">ShikshaSetu</span>
            <span className="text-sm text-muted-foreground ml-2">© 2024. Empowering students everywhere.</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Help Center</Link>
            <Link href="#" className="hover:text-primary">Terms of Use</Link>
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
