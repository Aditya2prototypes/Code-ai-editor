'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { TesDevLogo } from '@/components/codemuse-logo';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 overflow-hidden relative">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-1/4 w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob [animation-delay:2s]"></div>
      <div className="absolute -bottom-8 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob [animation-delay:4s]"></div>

      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center sm:p-6 z-10">
        <TesDevLogo />
      </header>
      
      <main className="text-center flex flex-col items-center z-10">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-headline tracking-tighter">
          Your AI Coding Companion
        </h1>
        <p className="mt-6 max-w-xl md:max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
          Write, understand, and debug code faster than ever. TesDev generates functional code snippets, explains logic, and refactors messy code with the power of AI.
        </p>
        
        <div className="mt-12">
          <Button asChild size="lg" className="text-base sm:text-lg h-14 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105">
            <Link href="/editor">
              Start Coding
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="absolute bottom-4 text-xs sm:text-sm text-muted-foreground z-10">
        © {new Date().getFullYear()} Tesdev. All rights reserved.
      </footer>
    </div>
  );
}
