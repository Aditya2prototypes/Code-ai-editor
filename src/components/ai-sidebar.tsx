'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { generateCodeAction } from '@/app/actions';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SidebarContent as SidebarContentWrapper, SidebarGroup, SidebarGroupLabel } from './ui/sidebar';
import { BotMessageSquare, Languages, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState = { code: '', error: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <LoaderCircle className="animate-spin mr-2" />}
      Generate Code
    </Button>
  );
}

export function AiSidebar({
  onCodeGenerated,
  language,
  onLanguageChange,
}: {
  onCodeGenerated: (code: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}) {
  const [state, formAction] = useFormState(generateCodeAction, initialState);
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (state.code) {
      onCodeGenerated(state.code);
      setPrompt(''); 
    }
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: state.error,
      });
    }
  }, [state, onCodeGenerated, toast]);

  return (
    <SidebarContentWrapper className="flex flex-col">
      <form action={formAction} className="flex flex-col gap-4 flex-grow p-0">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-sm">
            <Languages />
            Language
          </SidebarGroupLabel>
          <Select name="language" value={language} onValueChange={onLanguageChange} required>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
        </SidebarGroup>

        <SidebarGroup className="flex-grow flex flex-col">
          <SidebarGroupLabel className="flex items-center gap-2 text-sm">
            <BotMessageSquare />
            AI Assistant
          </SidebarGroupLabel>
          <Textarea
            name="prompt"
            placeholder="e.g., create a function that returns the fibonacci sequence"
            className="flex-grow min-h-[150px] font-body"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </SidebarGroup>
        
        <div className="mt-auto p-2">
          <SubmitButton />
        </div>
      </form>
    </SidebarContentWrapper>
  );
}
