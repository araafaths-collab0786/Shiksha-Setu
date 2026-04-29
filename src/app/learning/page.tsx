
"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, CheckCircle2, MoreVertical, Filter, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

export default function LearningLibraryPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set([0, 2])); // Mock pre-downloaded

  const subjects = useMemo(() => [
    { name: 'Mathematics', icon: 'M', modules: 12, image: PlaceHolderImages.find(i => i.id === 'math-module')?.imageUrl },
    { name: 'Science', icon: 'S', modules: 8, image: PlaceHolderImages.find(i => i.id === 'science-module')?.imageUrl },
    { name: 'History', icon: 'H', modules: 15, image: PlaceHolderImages.find(i => i.id === 'history-module')?.imageUrl },
    { name: 'Geography', icon: 'G', modules: 10, image: PlaceHolderImages.find(i => i.id === 'geography-module')?.imageUrl },
  ], []);

  const resources = useMemo(() => [
    { id: 0, title: 'Algebra Fundamentals', subject: 'Mathematics', type: 'Video', size: '124 MB' },
    { id: 1, title: 'Chemical Bonding 101', subject: 'Science', type: 'Module', size: '45 MB' },
    { id: 2, title: 'The Mughal Empire', subject: 'History', type: 'PDF', size: '12 MB' },
    { id: 3, title: 'Map Projections', subject: 'Geography', type: 'Video', size: '89 MB' },
    { id: 4, title: 'Quadratic Equations', subject: 'Mathematics', type: 'PDF', size: '5 MB' },
    { id: 5, title: 'Cell Biology', subject: 'Science', type: 'Video', size: '150 MB' },
  ], []);

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [searchQuery, selectedSubject, resources]);

  const handleDownload = (id: number, title: string) => {
    if (downloadedIds.has(id)) return;
    
    setDownloadingIds(prev => new Set(prev).add(id));
    
    // Simulate download
    setTimeout(() => {
      setDownloadingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setDownloadedIds(prev => new Set(prev).add(id));
      toast({
        title: "Download Complete",
        description: `${title} is now available offline.`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 space-y-12">
        <header className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-headline font-bold text-primary">{t('learningContent')}</h1>
              <p className="text-muted-foreground">Access your offline library and download new modules.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search library..." 
                  className="pl-10 rounded-full" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-full">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Mathematics', 'Science', 'History', 'Geography'].map((cat) => (
              <Badge 
                key={cat} 
                variant={selectedSubject === cat ? 'default' : 'outline'} 
                className="px-4 py-1.5 rounded-full cursor-pointer whitespace-nowrap transition-colors"
                onClick={() => setSelectedSubject(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-headline font-bold">Subjects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, idx) => (
              <Card 
                key={idx} 
                className={`border-none shadow-sm group hover:shadow-md transition-all cursor-pointer overflow-hidden ${selectedSubject === subject.name ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedSubject(subject.name)}
              >
                <div className="relative h-40 w-full bg-muted">
                   <Image 
                     src={subject.image || 'https://picsum.photos/seed/404/400/300'} 
                     alt={subject.name}
                     fill
                     className="object-cover group-hover:scale-105 transition-transform duration-500"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                   <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs opacity-80">{subject.modules} Modules</p>
                      <h3 className="font-headline font-bold text-xl">{subject.name}</h3>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold">Resources</h2>
            {selectedSubject !== 'All' && (
              <Button variant="link" onClick={() => setSelectedSubject('All')} className="text-primary">Clear Filter</Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[200px]">
            {filteredResources.length > 0 ? (
              filteredResources.map((res) => (
                <Card key={res.id} className="border-none shadow-sm flex flex-col animate-in fade-in duration-300">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-accent text-secondary text-[10px] uppercase font-bold px-2">
                        {res.type}
                      </Badge>
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-base leading-tight font-bold">{res.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 flex-1">
                    <p className="text-sm text-muted-foreground mb-4">{res.subject}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    {downloadedIds.has(res.id) ? (
                      <Button variant="outline" className="w-full gap-2 border-green-100 text-green-700 bg-green-50/50 hover:bg-green-50" disabled>
                        <CheckCircle2 className="h-4 w-4" /> {t('downloaded')}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full gap-2 bg-primary" 
                        onClick={() => handleDownload(res.id, res.title)}
                        disabled={downloadingIds.has(res.id)}
                      >
                        {downloadingIds.has(res.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        {downloadingIds.has(res.id) ? 'Downloading...' : `Download (${res.size})`}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center space-y-2">
                <Search className="h-10 w-10 text-muted-foreground mx-auto opacity-20" />
                <p className="text-muted-foreground">No resources found matching your search.</p>
              </div>
            )}
          </div>
        </section>

        <Card className="border-none shadow-sm bg-primary/5 p-8 text-center space-y-4">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Download className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-headline font-bold text-primary">Need more content?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Browse through hundreds of modules curated for your curriculum. Once downloaded, you can study them anytime without an internet connection.
          </p>
          <div className="pt-4">
            <Button className="rounded-full px-8" onClick={() => toast({ title: "Coming Soon", description: "Marketplace is being prepared." })}>
              Browse Marketplace
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
