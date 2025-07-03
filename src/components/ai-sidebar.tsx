'use client';

import { useActionState, useEffect, useState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { generateCodeAction, improveCodeAction, explainCodeAction, generateComponentAction } from '@/app/actions';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BotMessageSquare, Languages, LayoutTemplate, LoaderCircle, Sparkles, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialGenerateState = { code: '', error: undefined };
const initialImproveState = { improvedCode: '', error: undefined };
const initialExplainState = { explanation: '', error: undefined };
const initialComponentState = { code: '', error: undefined };

function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <LoaderCircle className="animate-spin mr-2" />}
      {children}
    </Button>
  );
}

export function AiSidebar({
  code,
  onCodeGenerated,
  onExplanationGenerated,
  language,
  onLanguageChange,
}: {
  code: string;
  onCodeGenerated: (code: string) => void;
  onExplanationGenerated: (explanation: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}) {
  const [generateState, generateFormAction] = useActionState(generateCodeAction, initialGenerateState);
  const [improveState, improveFormAction] = useActionState(improveCodeAction, initialImproveState);
  const [explainState, explainFormAction] = useActionState(explainCodeAction, initialExplainState);
  const [componentState, componentFormAction] = useActionState(generateComponentAction, initialComponentState);

  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (generateState.code) {
      onCodeGenerated(generateState.code);
      setPrompt('');
    }
    if (generateState.error) {
      toast({ variant: 'destructive', title: 'AI Error', description: generateState.error });
    }
  }, [generateState, onCodeGenerated, toast]);

  useEffect(() => {
    if (improveState.improvedCode) {
      onCodeGenerated(improveState.improvedCode);
      setPrompt('');
    }
    if (improveState.error) {
      toast({ variant: 'destructive', title: 'AI Error', description: improveState.error });
    }
  }, [improveState, onCodeGenerated, toast]);

  useEffect(() => {
    if (explainState.explanation) {
      onExplanationGenerated(explainState.explanation);
      setPrompt('');
    }
    if (explainState.error) {
      toast({ variant: 'destructive', title: 'AI Error', description: explainState.error });
    }
  }, [explainState, onExplanationGenerated, toast]);
  
  useEffect(() => {
    if (componentState.code) {
      onCodeGenerated(componentState.code);
      setPrompt('');
    }
    if (componentState.error) {
      toast({ variant: 'destructive', title: 'AI Error', description: componentState.error });
    }
  }, [componentState, onCodeGenerated, toast]);


  return (
    <div className="flex h-full flex-col">
      <h2 className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-neutral-400">AI Assistant</h2>
      <Tabs defaultValue="generate" className="flex flex-grow flex-col">
        <div className="px-2">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="generate"><Sparkles className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="improve"><BotMessageSquare className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="explain"><Lightbulb className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="component"><LayoutTemplate className="h-4 w-4" /></TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-grow flex flex-col min-h-0 p-2">
          <TabsContent value="generate" className="flex-grow flex flex-col m-0">
            <form action={generateFormAction} className="flex flex-col gap-4 flex-grow">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Languages /> Language
                </label>
                <Select name="language" value={language} onValueChange={onLanguageChange} required>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="shell">Shell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-grow flex flex-col">
                <Textarea name="prompt" placeholder="e.g., create a function that returns the fibonacci sequence" className="flex-grow min-h-[150px] font-body bg-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} required />
              </div>
              <div className="mt-auto"><SubmitButton>Generate Code</SubmitButton></div>
            </form>
          </TabsContent>

          <TabsContent value="improve" className="flex-grow flex flex-col m-0">
             <form action={improveFormAction} className="flex flex-col gap-4 flex-grow">
                <input type="hidden" name="code" value={code} />
                <input type="hidden" name="language" value={language} />
                <div className="flex-grow flex flex-col">
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">Improvement Instructions</label>
                    <Textarea name="prompt" placeholder="e.g., improve efficiency, add comments, or convert to an arrow function" className="flex-grow min-h-[150px] font-body bg-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} required />
                </div>
                <div className="mt-auto"><SubmitButton>Improve Code</SubmitButton></div>
             </form>
          </TabsContent>

          <TabsContent value="explain" className="flex-grow flex flex-col m-0">
            <form action={explainFormAction} className="flex flex-col gap-4 flex-grow">
              <input type="hidden" name="code" value={code} />
              <input type="hidden" name="language" value={language} />
              <div className="flex-grow flex flex-col">
                <label className="flex items-center gap-2 text-sm font-medium mb-2">What do you want to know?</label>
                <Textarea name="prompt" placeholder="e.g., What is the time complexity? (Leave blank for a general explanation)" className="flex-grow min-h-[150px] font-body bg-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
              </div>
              <div className="mt-auto"><SubmitButton>Explain Code</SubmitButton></div>
            </form>
          </TabsContent>

          <TabsContent value="component" className="flex-grow flex flex-col m-0">
            <form action={componentFormAction} className="flex flex-col gap-4 flex-grow">
              <div className="flex-grow flex flex-col">
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">Component Description</label>
                  <Textarea name="prompt" placeholder="e.g., a login form with email, password, and a submit button" className="flex-grow min-h-[150px] font-body bg-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} required />
              </div>
              <div className="mt-auto"><SubmitButton>Generate Component</SubmitButton></div>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
