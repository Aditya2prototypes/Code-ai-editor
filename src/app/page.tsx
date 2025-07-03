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
import { TesDevLogo } from '@/components/codemuse-logo';
import { CodeEditor } from '@/components/code-editor';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Play } from 'lucide-react';
import { AiSidebar } from '@/components/ai-sidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const initialCode = `// Welcome to TesDev!
// 1. Select a language on the left.
// 2. Use the AI Assistant to generate, improve, or explain code.
// 3. Click "Run Code" to execute JavaScript.
// Your work is saved automatically to your browser.

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('Developer'));
`;

export default function Home() {
  const [code, setCode] = useLocalStorage<string>('tesdev-code', initialCode);
  const [language, setLanguage] = useLocalStorage<string>('tesdev-language', 'javascript');
  const [output, setOutput] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleRunCode = () => {
    setOutput('');
    if (language !== 'javascript') {
      setOutput(`> Execution for ${language} is not implemented in this demo.`);
      return;
    }

    const logMessages: string[] = [];
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    const formatArg = (arg: any): string => {
      if (arg === undefined) return 'undefined';
      if (arg === null) return 'null';
      try {
        if (typeof arg === 'object' || Array.isArray(arg)) {
          return JSON.stringify(arg, null, 2);
        }
        return arg.toString();
      } catch {
        return String(arg);
      }
    };

    console.log = (...args) => {
      originalConsoleLog(...args); // Keep logging to the actual console
      const message = args.map(formatArg).join(' ');
      logMessages.push(message);
    };

    console.error = (...args) => {
        originalConsoleError(...args);
        const message = args.map(formatArg).join(' ');
        logMessages.push(`Error: ${message}`);
    }

    try {
      // eslint-disable-next-line no-eval
      eval(code);
      if (logMessages.length > 0) {
        setOutput(logMessages.join('\n'));
      } else {
        setOutput(
          '> Code executed successfully. No output was logged to the console.'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setOutput(`Error: ${error.message}`);
      } else {
        setOutput('An unknown error occurred during execution.');
      }
    } finally {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    }
  };

  const handleCodeChange = (newCode: string | undefined) => {
    setCode(newCode || '');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <TesDevLogo />
        </SidebarHeader>
        <AiSidebar
          code={code}
          onCodeGenerated={setCode}
          onExplanationGenerated={setExplanation}
          language={language}
          onLanguageChange={setLanguage}
        />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background p-2 sm:p-4 gap-4">
          <header className="flex items-center justify-between shrink-0 h-12 px-2">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:block w-7 h-7"></div>
            <h2 className="font-headline text-lg font-semibold">Editor</h2>
            <Button onClick={handleRunCode}>
              <Play className="mr-2 h-4 w-4" />
              Run Code
            </Button>
          </header>
          <main className="grid md:grid-cols-1 gap-4 flex-grow min-h-0 grid-rows-[minmax(0,5fr)_minmax(0,3fr)]">
            <div className="min-h-0">
              <CodeEditor
                language={language}
                code={code}
                onCodeChange={handleCodeChange}
              />
            </div>
            <div className="min-h-0 flex flex-col">
              <Card className="h-full flex flex-col">
                <CardHeader className="shrink-0">
                  <CardTitle>Console</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow min-h-0">
                  <pre className="text-sm font-code bg-muted p-4 rounded-md h-full overflow-auto whitespace-pre-wrap">
                    {output || '> Click "Run Code" to see output here.'}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
      <AlertDialog
        open={!!explanation}
        onOpenChange={(open) => !open && setExplanation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Code Explanation</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-4">
                {explanation}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setExplanation(null)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
