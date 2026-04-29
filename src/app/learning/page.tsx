"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, CheckCircle2, MoreVertical, Filter, Loader2, X, BookOpen } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

const SUBJECTS_DATA = [
  { id: 'math-module', name: 'Mathematics', modules: 12 },
  { id: 'science-module', name: 'Science', modules: 8 },
  { id: 'history-module', name: 'History', modules: 15 },
  { id: 'geography-module', name: 'Geography', modules: 10 },
];

const RESOURCES_DATA = [
  { id: 0, title: 'Algebra Fundamentals', subject: 'Mathematics', type: 'Video', size: '124 MB' },
  { id: 1, title: 'Chemical Bonding 101', subject: 'Science', type: 'Module', size: '45 MB' },
  { id: 2, title: 'The Mughal Empire', subject: 'History', type: 'PDF', size: '12 MB' },
  { id: 3, title: 'Map Projections', subject: 'Geography', type: 'Video', size: '89 MB' },
  { id: 4, title: 'Quadratic Equations', subject: 'Mathematics', type: 'PDF', size: '5 MB' },
  { id: 5, title: 'Cell Biology', subject: 'Science', type: 'Video', size: '150 MB' },
];

export default function LearningLibraryPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDownloadedIds(new Set([0, 2]));
  }, []);

  useEffect(() => {
    if (mounted && !isUserLoading && !user) {
      router.push('/login');
    }
  }, [mounted, isUserLoading, user, router]);

  const subjects = useMemo(() => SUBJECTS_DATA.map(s => ({
    ...s,
    image: PlaceHolderImages.find(i => i.id === s.id)?.imageUrl
  })), []);

  const filteredResources = useMemo(() => {
    return RESOURCES_DATA.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [searchQuery, selectedSubject]);

  const handleDownload = (id: number, title: string) => {
    if (downloadedIds.has(id) || downloadingIds.has(id)) return;
    
    setDownloadingIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    
    setTimeout(() => {
      setDownloadingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setDownloadedIds(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      toast({
        title: "Download Complete",
        description: `${title} is now available offline.`,
      });
    }, 1500);
  };

  const toggleSubject = (subjectName: string) => {
    setSelectedSubject(prev => prev === subjectName ? 'All' : subjectName);
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 space-y-12">
        <header className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-headline font-bold text-primary tracking-tight flex items-center gap-3">
                <BookOpen className="h-8 w-8" /> {t('learningContent')}
              </h1>
              <p className="text-muted-foreground mt-1">Access your offline library and download new curriculum modules.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search library..." 
                  className="pl-10 rounded-full bg-white" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button variant="outline" size="icon" className="rounded-full bg-white">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Mathematics', 'Science', 'History', 'Geography'].map((cat) => (
              <Badge 
                key={cat} 
                variant={selectedSubject === cat ? 'default' : 'outline'} 
                className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${selectedSubject === cat ? 'scale-105 shadow-sm' : 'bg-white hover:bg-accent'}`}
                onClick={() => setSelectedSubject(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" /> Subjects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <Card 
                key={subject.id} 
                className={`border-none shadow-sm group hover:shadow-md transition-all cursor-pointer overflow-hidden ring-offset-background bg-white ${selectedSubject === subject.name ? 'ring-2 ring-primary ring-offset-2 scale-[1.02]' : ''}`}
                onClick={() => toggleSubject(subject.name)}
              >
                <div className="relative h-40 w-full bg-muted">
                   <Image 
                     src={subject.image || 'https://picsum.photos/seed/404/400/300'} 
                     alt={subject.name}
                     fill
                     className="object-cover group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                   <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">{subject.modules} Modules</p>
                      <h3 className="font-headline font-bold text-xl">{subject.name}</h3>
                   </div>
                   {selectedSubject === subject.name && (
                     <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg animate-in zoom-in">
                       <CheckCircle2 className="h-4 w-4" />
                     </div>
                   )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold">Resources</h2>
            {(selectedSubject !== 'All' || searchQuery !== '') && (
              <Button variant="link" onClick={() => { setSelectedSubject('All'); setSearchQuery(''); }} className="text-primary h-auto p-0 font-semibold">
                Clear Filters
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.length > 0 ? (
              filteredResources.map((res) => (
                <Card key={res.id} className="border-none shadow-sm flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 bg-white">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-accent text-primary text-[10px] uppercase font-bold px-2 border-none">
                        {res.type}
                      </Badge>
                      <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                    </div>
                    <CardTitle className="text-base leading-tight font-bold group-hover:text-primary transition-colors">{res.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 flex-1">
                    <p className="text-sm text-muted-foreground font-medium">{res.subject}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    {downloadedIds.has(res.id) ? (
                      <Button variant="outline" className="w-full gap-2 border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50" disabled>
                        <CheckCircle2 className="h-4 w-4" /> {t('downloaded')}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full gap-2 shadow-sm" 
                        onClick={() => handleDownload(res.id, res.title)}
                        disabled={downloadingIds.has(res.id)}
                      >
                        {downloadingIds.has(res.id) ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Download ({res.size})
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-24 text-center space-y-4 bg-white/50 rounded-3xl border-2 border-dashed">
                <Search className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                <div className="space-y-1">
                  <p className="text-lg font-medium text-muted-foreground">No resources found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search query or subject filters.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
