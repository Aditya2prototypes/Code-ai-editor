'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { generateCodeAction, improveCodeAction, explainCodeAction } from '@/app/actions';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SidebarContent as SidebarContentWrapper, SidebarGroup, SidebarGroupLabel } from './ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BotMessageSquare, Languages, LoaderCircle, Sparkles, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialGenerateState = { code: '', error: undefined };
const initialImproveState = { improvedCode: '', error: undefined };
const initialExplainState = { explanation: '', error: undefined };

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
  const [generateState, generateFormAction] = useFormState(generateCodeAction, initialGenerateState);
  const [improveState, improveFormAction] = useFormState(improveCodeAction, initialImproveState);
  const [explainState, explainFormAction] = useFormState(explainCodeAction, initialExplainState);

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

  return (
    <SidebarContentWrapper className="flex flex-col p-0">
      <Tabs defaultValue="generate" className="flex flex-col flex-grow">
        <div className="p-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate"><Sparkles className="mr-1 h-4 w-4" />Generate</TabsTrigger>
            <TabsTrigger value="improve"><BotMessageSquare className="mr-1 h-4 w-4" />Improve</TabsTrigger>
            <TabsTrigger value="explain"><Lightbulb className="mr-1 h-4 w-4" />Explain</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-grow flex flex-col min-h-0">
          <TabsContent value="generate" className="flex-grow flex flex-col m-0">
            <form action={generateFormAction} className="flex flex-col gap-4 flex-grow p-0">
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-2 text-sm">
                  <Languages /> Language
                </SidebarGroupLabel>
                <Select name="language" value={language} onValueChange={onLanguageChange} required>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                  </SelectContent>
                </Select>
              </SidebarGroup>
              <SidebarGroup className="flex-grow flex flex-col">
                <Textarea name="prompt" placeholder="e.g., create a function that returns the fibonacci sequence" className="flex-grow min-h-[150px] font-body" value={prompt} onChange={(e) => setPrompt(e.target.value)} required />
              </SidebarGroup>
              <div className="mt-auto p-2"><SubmitButton>Generate Code</SubmitButton></div>
            </form>
          </TabsContent>

          <TabsContent value="improve" className="flex-grow flex flex-col m-0">
             <form action={improveFormAction} className="flex flex-col gap-4 flex-grow p-0">
                <input type="hidden" name="code" value={code} />
                <input type="hidden" name="language" value={language} />
                <SidebarGroup className="flex-grow flex flex-col">
                    <SidebarGroupLabel className="flex items-center gap-2 text-sm">Improvement Instructions</SidebarGroupLabel>
                    <Textarea name="prompt" placeholder="e.g., improve efficiency, add comments, or convert to an arrow function" className="flex-grow min-h-[150px] font-body" value={prompt} onChange={(e) => setPrompt(e.target.value)} required />
                </SidebarGroup>
                <div className="mt-auto p-2"><SubmitButton>Improve Code</SubmitButton></div>
             </form>
          </TabsContent>

          <TabsContent value="explain" className="flex-grow flex flex-col m-0">
            <form action={explainFormAction} className="flex flex-col gap-4 flex-grow p-0">
              <input type="hidden" name="code" value={code} />
              <input type="hidden" name="language" value={language} />
              <SidebarGroup className="flex-grow flex flex-col">
                <SidebarGroupLabel className="flex items-center gap-2 text-sm">What do you want to know?</SidebarGroupLabel>
                <Textarea name="prompt" placeholder="e.g., What is the time complexity? (Leave blank for a general explanation)" className="flex-grow min-h-[150px] font-body" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
              </SidebarGroup>
              <div className="mt-auto p-2"><SubmitButton>Explain Code</SubmitButton></div>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </SidebarContentWrapper>
  );
}
