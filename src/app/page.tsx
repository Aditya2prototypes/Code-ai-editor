'use client';

import { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeMuseLogo } from '@/components/codemuse-logo';
import { CodeEditor } from '@/components/code-editor';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Play } from 'lucide-react';
import { AiSidebar } from '@/components/ai-sidebar';

const initialCode = `// Welcome to CodeMuse!
// 1. Select a language on the left.
// 2. Describe the code you want in the AI Assistant prompt.
// 3. Click "Generate Code".
// Your work is saved automatically to your browser.

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('Developer'));
`;

export default function Home() {
  const [code, setCode] = useLocalStorage<string>('codemuse-code', initialCode);
  const [language, setLanguage] = useLocalStorage<string>('codemuse-language', 'javascript');
  const [output, setOutput] = useState('');

  const handleRunCode = () => {
    setOutput(`Executing ${language} code...\n\n> Mock output: Code execution is not implemented in this demo.\n`);
  };
  
  const handleCodeChange = (newCode: string | undefined) => {
    setCode(newCode || '');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <CodeMuseLogo />
        </SidebarHeader>
        <AiSidebar onCodeGenerated={setCode} language={language} onLanguageChange={setLanguage} />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background p-2 sm:p-4 gap-4">
          <header className="flex items-center justify-between shrink-0 h-12 px-2">
            <SidebarTrigger className="md:hidden"/>
            <div className="hidden md:block w-7 h-7"></div>
            <h2 className="font-headline text-lg font-semibold">Editor</h2>
            <Button onClick={handleRunCode}>
              <Play className="mr-2 h-4 w-4" />
              Run Code
            </Button>
          </header>
          <main className="flex flex-col gap-4 flex-grow min-h-0">
            <div className="flex-grow min-h-0">
               <CodeEditor language={language} code={code} onCodeChange={handleCodeChange} />
            </div>
            <div className="flex-grow min-h-0 flex flex-col max-h-[40vh] md:max-h-full">
              <Card className="h-full flex flex-col">
                <CardHeader className="shrink-0">
                  <CardTitle>Console</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow min-h-0">
                  <pre className="text-sm font-code bg-muted p-4 rounded-md h-full overflow-auto whitespace-pre-wrap">
                    {output || 'Click "Run Code" to see mock output here.'}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
