
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: "Welcome to ShikshaSetu",
    dashboard: "Dashboard",
    doubtSolver: "Doubt Solver",
    learningContent: "Learning Content",
    quizzes: "Quizzes",
    personalizedPath: "Your Learning Path",
    offlineStatus: "Offline Mode Ready",
    downloaded: "Downloaded",
    startQuiz: "Start Quiz",
    askDoubt: "Ask a Doubt",
    askPlaceholder: "Type or speak your doubt...",
    overallProgress: "Overall Progress",
    recentActivity: "Recent Activity",
    modulesCompleted: "Modules Completed",
    averageScore: "Average Score",
    studyTime: "Study Time",
    minutes: "mins",
  },
  hi: {
    welcome: "शिक्षासेतु में आपका स्वागत है",
    dashboard: "डैशबोर्ड",
    doubtSolver: "शंका समाधान",
    learningContent: "सीखने की सामग्री",
    quizzes: "क्विज़",
    personalizedPath: "आपका सीखने का पथ",
    offlineStatus: "ऑफलाइन मोड तैयार",
    downloaded: "डाउनलोड किया गया",
    startQuiz: "क्विज़ शुरू करें",
    askDoubt: "शंका पूछें",
    askPlaceholder: "अपनी शंका टाइप करें या बोलें...",
    overallProgress: "कुल प्रगति",
    recentActivity: "हाल की गतिविधि",
    modulesCompleted: "पूरे किए गए मॉड्यूल",
    averageScore: "औसत स्कोर",
    studyTime: "पढ़ाई का समय",
    minutes: "मिनट",
  },
  bn: {
    welcome: "শিক্ষা সেতুতে স্বাগতম",
    dashboard: "ড্যাশবোর্ড",
    doubtSolver: "সন্দেহ নিরসন",
    learningContent: "শিক্ষার বিষয়বস্তু",
    quizzes: "কুইজ",
    personalizedPath: "আপনার শিক্ষার পথ",
    offlineStatus: "অফলাইন মোড প্রস্তুত",
    downloaded: "ডাউনলোড করা হয়েছে",
    startQuiz: "কুইজ শুরু করুন",
    askDoubt: "সন্দেহ জিজ্ঞাসা করুন",
    askPlaceholder: "আপনার সন্দেহ টাইপ করুন বা বলুন...",
    overallProgress: "সামগ্রিক অগ্রগতি",
    recentActivity: "সাম্প্রতিক কার্যকলাপ",
    modulesCompleted: "সম্পন্ন মডিউল",
    averageScore: "গড় স্কোর",
    studyTime: "অধ্যয়নের সময়",
    minutes: "মিনিট",
  },
  te: {
    welcome: "శిక్షాసేతుకు స్వాగతం",
    dashboard: "డాష్‌బోర్డ్",
    doubtSolver: "సందేహ నివృత్తి",
    learningContent: "నేర్చుకునే విషయాలు",
    quizzes: "క్విజ్‌లు",
    personalizedPath: "మీ అభ్యసన మార్గం",
    offlineStatus: "ఆఫ్‌లైన్ మోడ్ సిద్ధంగా ఉంది",
    downloaded: "డౌన్‌లోడ్ చేయబడింది",
    startQuiz: "క్విజ్ ప్రారంభించండి",
    askDoubt: "సందేహం అడగండి",
    askPlaceholder: "మీ సందేహాన్ని టైప్ చేయండి లేదా చెప్పండి...",
    overallProgress: "మొత్తం పురోగతి",
    recentActivity: "ఇటీవలి కార్యకలాపం",
    modulesCompleted: "పూర్తయిన మాడ్యూల్స్",
    averageScore: "సగటు స్కోరు",
    studyTime: "అధ్యయన సమయం",
    minutes: "నిమిషాలు",
  },
  ta: {
    welcome: "சிக்ஷாசதுக்கு வரவேற்கிறோம்",
    dashboard: "டாஷ்போர்டு",
    doubtSolver: "சந்தேக தீர்வு",
    learningContent: "கற்றல் உள்ளடக்கம்",
    quizzes: "வினாடி வினாக்கள்",
    personalizedPath: "உங்கள் கற்றல் பாதை",
    offlineStatus: "ஆஃப்லைன் பயன்முறை தயார்",
    downloaded: "பதிவிறக்கம் செய்யப்பட்டது",
    startQuiz: "வினாடி வினா தொடங்கு",
    askDoubt: "சந்தேகம் கேளுங்கள்",
    askPlaceholder: "உங்கள் சந்தேகத்தை தட்டச்சு செய்யவும் அல்லது பேசவும்...",
    overallProgress: "ஒட்டுமொத்த முன்னேற்றம்",
    recentActivity: "சமீபத்திய செயல்பாடு",
    modulesCompleted: "முடிந்த தொகுதிகள்",
    averageScore: "சராசரி மதிப்பெண்",
    studyTime: "படிப்பு நேரம்",
    minutes: "நிமிடங்கள்",
  },
  mr: {
    welcome: "शिक्षासेतू मध्ये आपले स्वागत आहे",
    dashboard: "डॅशबोर्ड",
    doubtSolver: "शंका निवारण",
    learningContent: "शिकण्याची सामग्री",
    quizzes: "चाचण्या",
    personalizedPath: "तुमचा शिकण्याचा मार्ग",
    offlineStatus: "ऑफलाइन मोड तयार",
    downloaded: "डाउनलोड केले",
    startQuiz: "चाचणी सुरू करा",
    askDoubt: "शंका विचारा",
    askPlaceholder: "तुमची शंका टाईप करा किंवा बोला...",
    overallProgress: "एकूण प्रगती",
    recentActivity: "अलीकडील क्रियाकलाप",
    modulesCompleted: "पूर्ण केलेले मॉड्यूल्स",
    averageScore: "सरासरी स्कोअर",
    studyTime: "अभ्यासाची वेळ",
    minutes: "मिनिटे",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
