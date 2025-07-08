import { BotMessageSquare } from 'lucide-react';
import React from 'react';

export function MicoDevLogo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <BotMessageSquare className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold font-headline text-foreground">
        Mico Dev
      </h1>
    </div>
  );
}
