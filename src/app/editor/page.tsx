'use client';

import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { runPythonAction } from '@/app/actions';

import { AiSidebar } from '@/components/ai-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeEditor } from '@/components/code-editor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  FileText,
  Bot,
  Play,
  Share2,
  LoaderCircle,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  File as FileIcon,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const initialCode = `// Welcome to TesDev!
// 1. Click the file icon to browse files.
// 2. Click the bot icon to use the AI Assistant.
// 3. Write code and click "Run" to execute.

function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('Developer');
`;

// --- Reusable Sub-components for the VS Code UI ---

const ActivityBar = ({
  activePanel,
  setActivePanel,
}: {
  activePanel: 'files' | 'ai' | null;
  setActivePanel: (panel: 'files' | 'ai' | null) => void;
}) => {
  const togglePanel = (panel: 'files' | 'ai') => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const iconStyle = (panel: 'files' | 'ai') =>
    cn(
      'h-10 w-full flex items-center justify-center cursor-pointer border-l-2',
      activePanel === panel
        ? 'border-blue-400 text-neutral-100'
        : 'border-transparent text-neutral-400 hover:text-neutral-100'
    );

  return (
    <div className="flex w-12 flex-col items-center gap-2 border-r border-neutral-700 bg-[#333333] py-4">
      <button onClick={() => togglePanel('files')} className={iconStyle('files')}>
        <FileText className="h-6 w-6" />
      </button>
      <button onClick={() => togglePanel('ai')} className={iconStyle('ai')}>
        <Bot className="h-6 w-6" />
      </button>
    </div>
  );
};

const FileTree = ({ name, children, icon: Icon, level = 0 }: { name: string; children?: React.ReactNode; icon: React.ElementType; level?: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isDir = !!children;
  return (
    <div>
      <div
        className="flex cursor-pointer items-center py-1 pr-2 text-neutral-300 hover:bg-neutral-700/50"
        style={{ paddingLeft: `${level * 1}rem` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isDir ? (
          isOpen ? <ChevronDown className="mr-1 h-4 w-4" /> : <ChevronRight className="mr-1 h-4 w-4" />
        ) : (
          <div className="w-5" /> // Placeholder for alignment
        )}
        <Icon className="mr-2 h-4 w-4 shrink-0" />
        <span>{name}</span>
      </div>
      {isDir && isOpen && <div className="pl-2">{children}</div>}
    </div>
  );
};

const FileExplorer = () => (
  <div className="flex h-full flex-col">
    <h2 className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-neutral-400">Explorer</h2>
    <div className="flex-grow p-2">
      <FileTree name="src" icon={Folder}>
        <FileTree name="app" icon={Folder} level={1}>
          <FileTree name="page.tsx" icon={Code2} level={2} />
        </FileTree>
        <FileTree name="components" icon={Folder} level={1}>
          <FileTree name="button.tsx" icon={Code2} level={2} />
        </FileTree>
      </FileTree>
      <FileTree name="package.json" icon={FileIcon} />
    </div>
  </div>
);

// --- Editor Page ---

export default function EditorPage() {
  const [code, setCode] = useLocalStorage<string>('tesdev-code-v2', initialCode);
  const [language, setLanguage] = useLocalStorage<string>('tesdev-language-v2', 'javascript');
  const [output, setOutput] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activePanel, setActivePanel] = useState<'files' | 'ai' | null>('files');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const searchParams = new URLSearchParams(window.location.search);
    const codeParam = searchParams.get('code');
    const langParam = searchParams.get('lang');

    if (codeParam) {
      try {
        const decodedCode = atob(codeParam.replace(/ /g, '+'));
        setCode(decodedCode);
      } catch (e) {
        toast({ variant: 'destructive', title: 'Error loading shared code' });
      }
    }
    if (langParam) {
      setLanguage(langParam);
    }
    if (codeParam || langParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRunCode = async () => {
    setOutput('');
    setIsRunning(true);
    if (language === 'javascript') {
      const logMessages: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (...args: any[]) => logMessages.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
      try {
        new Function(code)();
        setOutput(logMessages.join('\n') || '> Code executed successfully. No output logged.');
      } catch (error: any) {
        setOutput(`Error: ${error.message}`);
      } finally {
        console.log = originalConsoleLog;
      }
    } else if (language === 'python') {
      const result = await runPythonAction(code);
      setOutput(result.error ? `Error: ${result.error}` : result.output || '> No output from script.');
    }
    setIsRunning(false);
  };

  const handleShare = () => {
    try {
      const encodedCode = btoa(code);
      const url = `${window.location.origin}${window.location.pathname}?code=${encodedCode}&lang=${language}`;
      navigator.clipboard.writeText(url);
      toast({ title: 'Link Copied!', description: 'A shareable link is on your clipboard.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not create a shareable link.' });
    }
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e] font-sans text-sm text-neutral-300">
      <ActivityBar activePanel={activePanel} setActivePanel={setActivePanel} />
      
      <aside className={cn(
          "bg-[#252526] text-neutral-300 transition-all duration-200 ease-in-out overflow-hidden",
          activePanel ? "w-80" : "w-0"
      )}>
        {activePanel === 'files' && <FileExplorer />}
        {activePanel === 'ai' && (
          <AiSidebar
            code={code}
            onCodeGenerated={setCode}
            onExplanationGenerated={setExplanation}
            language={language}
            onLanguageChange={setLanguage}
          />
        )}
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex h-10 flex-shrink-0 items-center justify-between border-b border-neutral-700 bg-[#252526] pr-2">
          {/* Editor Tab */}
          <div className="flex h-full items-center gap-2 border-r border-neutral-700 bg-[#1e1e1e] px-4">
            <Code2 className="h-4 w-4 text-blue-400" />
            <span>{language === 'javascript' ? 'script.js' : 'script.py'}</span>
            <X className="ml-2 h-4 w-4 cursor-pointer rounded p-0.5 text-neutral-400 hover:bg-neutral-600" />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleShare} variant="ghost" size="sm" className="hover:bg-neutral-700">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button onClick={handleRunCode} disabled={isRunning} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              {isRunning ? <LoaderCircle className="animate-spin mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              Run
            </Button>
          </div>
        </div>
        
        <main className="grid flex-grow grid-rows-1 md:grid-rows-[minmax(0,5fr)_minmax(0,3fr)] gap-0 min-h-0">
          <div className="min-h-0">
            <CodeEditor language={language} code={code} onCodeChange={(c) => setCode(c || '')} />
          </div>
          <div className="min-h-0 flex-col border-t border-neutral-700 md:flex">
              <Card className="h-full flex-col rounded-none border-none bg-[#1e1e1e]">
                <CardHeader className="flex-row items-center justify-between shrink-0 p-2 border-b border-neutral-700">
                  <CardTitle className="text-sm font-medium">Console</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-0 min-h-0">
                  <pre className="text-sm font-code h-full overflow-auto whitespace-pre-wrap p-4 text-neutral-400">
                    {output || '> Click "Run" to see output.'}
                  </pre>
                </CardContent>
              </Card>
          </div>
        </main>
      </div>

      <AlertDialog open={!!explanation} onOpenChange={(open) => !open && setExplanation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Code Explanation</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-4">{explanation}</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setExplanation(null)}>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
