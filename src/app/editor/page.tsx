
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { runPythonAction } from '@/app/actions';
import { getLanguageFromFileName, getExtensionFromLanguage, getInitialCode } from '@/lib/language-utils';
import Link from 'next/link';

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

import {
  Bot,
  Play,
  Share2,
  LoaderCircle,
  X,
  Code2,
  Plus,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface File {
  id: string;
  name: string;
  language: string;
  code: string;
}

const defaultFile: File = {
  id: '1',
  name: 'script.js',
  language: 'javascript',
  code: `// Welcome to TesDev!
// 1. Click the + to add a new file.
// 2. Use the bot icon for AI assistance.
// 3. Write code and click "Run" to execute.

function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('Developer');
`
};

// --- Reusable Sub-components ---

const ActivityBar = ({
  activePanel,
  setActivePanel,
}: {
  activePanel: 'ai' | null;
  setActivePanel: (panel: 'ai' | null) => void;
}) => {
  const togglePanel = (panel: 'ai') => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const iconStyle = (isActive: boolean) =>
    cn(
      'h-10 w-full flex items-center justify-center cursor-pointer border-l-2',
      isActive
        ? 'border-blue-400 text-neutral-100'
        : 'border-transparent text-neutral-400 hover:text-neutral-100'
    );

  return (
    <div className="flex w-12 flex-col items-center justify-between border-r border-neutral-700 bg-[#333333] py-4">
      <div className="flex w-full flex-col items-center gap-2">
        <button
          onClick={() => togglePanel('ai')}
          className={iconStyle(activePanel === 'ai')}
          title="AI Assistant"
        >
          <Bot className="h-6 w-6" />
        </button>
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        <Link
          href="/documentation"
          className={iconStyle(false)}
          title="Documentation"
        >
          <BookOpen className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};


// --- Editor Page ---

export default function EditorPage() {
  const [files, setFiles] = useLocalStorage<File[]>('tesdev-files-v3', [defaultFile]);
  const [activeFileId, setActiveFileId] = useState<string>(defaultFile.id);
  const [output, setOutput] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activePanel, setActivePanel] = useState<'ai' | null>(null);
  const { toast } = useToast();

  const activeFile = files.find(f => f.id === activeFileId) || files[0] || null;

  useEffect(() => {
    if (!activeFile && files.length > 0) {
      setActiveFileId(files[0].id);
    } else if (files.length === 0) {
       // If all files are closed, create a new default file
      const newDefaultFile = { ...defaultFile, id: Date.now().toString() };
      setFiles([newDefaultFile]);
      setActiveFileId(newDefaultFile.id);
    }
  }, [activeFile, files, setFiles]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const searchParams = new URLSearchParams(window.location.search);
    const codeParam = searchParams.get('code');
    const langParam = searchParams.get('lang');

    if (codeParam) {
      try {
        const decodedCode = atob(codeParam.replace(/ /g, '+'));
        const language = getLanguageFromFileName(`file.${langParam || 'js'}`);
        const newFile: File = {
          id: Date.now().toString(),
          name: `shared-code${getExtensionFromLanguage(language)}`,
          language,
          code: decodedCode,
        };
        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
      } catch (e) {
        toast({ variant: 'destructive', title: 'Error loading shared code' });
      }
    }
    if (codeParam || langParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRunCode = async () => {
    if (!activeFile) return;
    setOutput('');
    setIsRunning(true);
    if (activeFile.language === 'javascript') {
      const logMessages: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (...args: any[]) => {
        logMessages.push(
          args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')
        );
      };
      
      try {
        new Function(activeFile.code)();
        setOutput(logMessages.join('\n') || '> Code executed successfully. No output logged.');
      } catch (error: any) {
        setOutput(`Error: ${error.message}`);
      } finally {
        console.log = originalConsoleLog;
        setIsRunning(false);
      }
    } else if (activeFile.language === 'python') {
      const result = await runPythonAction(activeFile.code);
      setOutput(result.error ? `Error: ${result.error}` : result.output || '> No output from script.');
      setIsRunning(false);
    } else {
      setOutput(`> Running for language "${activeFile.language}" is not supported yet.`);
      setIsRunning(false);
    }
  };

  const handleShare = () => {
    if (!activeFile) return;
    try {
      const encodedCode = btoa(activeFile.code);
      const url = `${window.location.origin}${window.location.pathname}?code=${encodedCode}&lang=${activeFile.language}`;
      navigator.clipboard.writeText(url);
      toast({ title: 'Link Copied!', description: 'A shareable link is on your clipboard.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not create a shareable link.' });
    }
  };

  const handleCodeChange = (newCode: string = '') => {
    if (!activeFile) return;
    setFiles(prevFiles => prevFiles.map(f => f.id === activeFileId ? { ...f, code: newCode } : f));
  };
  
  const handleLanguageChange = useCallback((newLang: string) => {
    if (!activeFile) return;
    setFiles(prevFiles => prevFiles.map(f => {
        if (f.id === activeFileId) {
            const newExtension = getExtensionFromLanguage(newLang);
            const baseName = f.name.includes('.') ? f.name.substring(0, f.name.lastIndexOf('.')) : f.name;
            const newName = `${baseName}${newExtension}`;
            return { ...f, language: newLang, name: newName, code: getInitialCode(newName, newLang) };
        }
        return f;
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFile, setFiles]);
  
  const handleAddFile = () => {
    const name = prompt('Enter a file name (e.g., app.js, style.css):', `untitled-${files.length + 1}.js`);
    if (!name) return;
  
    const language = getLanguageFromFileName(name);
  
    const newFile: File = {
      id: Date.now().toString(),
      name,
      language,
      code: getInitialCode(name, language),
    };
  
    setFiles(prevFiles => [...prevFiles, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleCloseFile = (fileIdToClose: string) => {
    setFiles(prevFiles => {
      const fileToCloseIndex = prevFiles.findIndex(f => f.id === fileIdToClose);
      if (fileToCloseIndex === -1) {
        return prevFiles;
      }
      const newFiles = prevFiles.filter(f => f.id !== fileIdToClose);

      if (activeFileId === fileIdToClose) {
         if (newFiles.length > 0) {
            const newActiveIndex = Math.max(0, fileToCloseIndex - 1);
            setActiveFileId(newFiles[newActiveIndex].id);
         } else {
            setActiveFileId('');
         }
      }
      
      return newFiles;
    });
  };
  
  const handleCodeGenerated = (generatedCode: string) => {
    if (!activeFile) return;
    setFiles(prevFiles => prevFiles.map(f => f.id === activeFileId ? { ...f, code: generatedCode } : f));
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e] font-sans text-sm text-neutral-300">
      <ActivityBar activePanel={activePanel} setActivePanel={setActivePanel} />
      
      <aside className={cn(
          "bg-[#252526] text-neutral-300 transition-all duration-200 ease-in-out overflow-hidden",
          activePanel ? "w-80" : "w-0"
      )}>
        {activePanel === 'ai' && activeFile && (
          <AiSidebar
            key={activeFile.id}
            code={activeFile.code}
            onCodeGenerated={handleCodeGenerated}
            onExplanationGenerated={setExplanation}
            language={activeFile.language}
            onLanguageChange={handleLanguageChange}
          />
        )}
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex h-10 flex-shrink-0 items-center justify-between border-b border-neutral-700 bg-[#2d2d2d] pr-2">
          <div className="flex items-center h-full overflow-x-auto">
            {files.map(file => (
              <button
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={cn(
                  'flex h-full items-center gap-2 px-4 border-r border-neutral-700 text-neutral-400 hover:bg-[#3f3f3f]',
                  file.id === activeFileId ? 'bg-[#1e1e1e] text-neutral-100' : 'bg-[#2d2d2d]'
                )}
              >
                <Code2 className="h-4 w-4 shrink-0 text-blue-400" />
                <span className="whitespace-nowrap">{file.name}</span>
                <X
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseFile(file.id);
                  }}
                  className="ml-2 h-4 w-4 shrink-0 cursor-pointer rounded p-0.5 text-neutral-400 hover:bg-neutral-600"
                />
              </button>
            ))}
             <Button onClick={handleAddFile} variant="ghost" size="icon" className="h-full w-10 rounded-none hover:bg-[#3f3f3f]">
                <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleShare} variant="ghost" size="sm" className="hover:bg-neutral-700">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button onClick={handleRunCode} disabled={isRunning || !activeFile} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              {isRunning ? <LoaderCircle className="animate-spin mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              Run
            </Button>
          </div>
        </div>
        
        <main className="grid flex-grow grid-rows-1 md:grid-rows-[minmax(0,5fr)_minmax(0,3fr)] gap-0 min-h-0">
          <div className="min-h-0">
            {activeFile ? (
               <CodeEditor 
                 key={activeFile.id}
                 language={activeFile.language} 
                 code={activeFile.code} 
                 onCodeChange={handleCodeChange}
               />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-500">
                Click the '+' to create a file.
              </div>
            )}
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
