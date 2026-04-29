
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { CheckCircle2, Clock, BarChart3, TrendingUp } from 'lucide-react';

export function ProgressOverview() {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('modulesCompleted'),
      value: '12',
      total: '20',
      icon: CheckCircle2,
      color: 'text-primary',
      progress: 60
    },
    {
      title: t('averageScore'),
      value: '84%',
      icon: BarChart3,
      color: 'text-secondary',
      progress: 84
    },
    {
      title: t('studyTime'),
      value: `320 ${t('minutes')}`,
      icon: Clock,
      color: 'text-blue-400',
      progress: 75
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-headline font-bold text-foreground mb-4">
              {stat.value}
            </div>
            <Progress value={stat.progress} className="h-1.5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
