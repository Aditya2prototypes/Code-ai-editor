import { BotMessageSquare } from 'lucide-react';
import React from 'react';

export function CodeMuseLogo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <BotMessageSquare className="h-7 w-7 text-primary" />
      <h1 className="text-xl font-bold font-headline text-foreground">
        CodeMuse
      </h1>
    </div>
  );
}
