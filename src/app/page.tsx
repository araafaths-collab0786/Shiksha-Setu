"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ProgressOverview } from '@/components/dashboard/ProgressOverview';
import { PersonalizedPath } from '@/components/dashboard/PersonalizedPath';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, HelpCircle, GraduationCap, ArrowRight, Download, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { t } = useLanguage();

  const quickLinks = [
    { title: t('doubtSolver'), icon: BrainCircuit, href: '/doubt-solver', description: 'Ask questions & get solutions instantly', color: 'bg-primary' },
    { title: t('learningContent'), icon: BookOpen, href: '/learning', description: 'Access textbooks and videos offline', color: 'bg-secondary' },
    { title: t('quizzes'), icon: HelpCircle, href: '/quizzes', description: 'Test your knowledge with practice sets', color: 'bg-blue-400' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight text-primary">
              {t('welcome')}, Student!
            </h1>
            <p className="text-muted-foreground mt-1">Keep track of your progress and start where you left off.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Download All
             </Button>
             <Link href="/learning">
               <Button className="flex items-center gap-2">
                 Resume Learning <ArrowRight className="h-4 w-4" />
               </Button>
             </Link>
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
                  <Link key={idx} href={link.href}>
                    <Card className="h-full border-none shadow-sm hover:shadow-md transition-all cursor-pointer group">
                      <CardContent className="pt-6">
                        <div className={`${link.color} text-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <link.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">{link.title}</h3>
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
                {[1, 2].map((i) => (
                  <Card key={i} className="border-none shadow-sm group cursor-pointer hover:bg-accent/30 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold text-lg">
                          {i === 1 ? 'M' : 'S'}
                        </div>
                        <div>
                          <h4 className="font-semibold">{i === 1 ? 'Basic Algebra' : 'Ecosystems'}</h4>
                          <p className="text-xs text-muted-foreground">Mathematics • 45m left</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Continue
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <PersonalizedPath />
            
            <Card className="border-none shadow-sm">
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
