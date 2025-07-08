
'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Bot } from 'lucide-react';
import { MicoDevLogo } from '@/components/codemuse-logo';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <MicoDevLogo />
        <Button asChild variant="outline">
          <Link href="/editor">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Link>
        </Button>
      </header>
      <main className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
        <div className="space-y-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                Welcome to Mico Dev
            </h1>
            <p className="text-xl text-muted-foreground">
                Your AI-powered coding companion. Here's how to get started.
            </p>
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Features Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>File Management</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>
                      <strong>Add a new file:</strong> Click the "+" icon in the tab bar. You'll be prompted to enter a file name with an extension (e.g., `app.js`, `styles.css`).
                    </li>
                    <li>
                      <strong>Switch between files:</strong> Simply click on the file tab you want to view or edit.
                    </li>
                    <li>
                      <strong>Close a file:</strong> Click the "x" icon on the right side of any file tab. Your work is automatically saved to your browser's local storage.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>AI Assistant</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4 text-muted-foreground">
                    Access the AI Assistant by clicking the <Bot className="inline-block h-4 w-4 align-middle" /> icon in the activity bar. The assistant has four powerful modes:
                  </p>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>
                      <strong>Generate Code:</strong> Select a language, describe what you want to build in the prompt box, and click "Generate Code". The AI will create the code snippet for you in the active file.
                    </li>
                    <li>
                      <strong>Improve Code:</strong> Write or paste your code in the editor, then provide instructions on how to improve it (e.g., "make it more readable", "add error handling"). The AI will refactor your code.
                    </li>
                    <li>
                      <strong>Explain Code:</strong> Have a piece of code you don't understand? The AI can explain it. You can ask specific questions or leave the prompt blank for a general overview.
                    </li>
                    <li>
                      <strong>Generate Component:</strong> Describe a UI component you need (e.g., "a login form with email and password fields"). The AI will generate a complete React component using Tailwind CSS and shadcn/ui.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Code Execution</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Click the "Run" button in the top-right corner to execute the code in your active file. The output will appear in the Console panel at the bottom.
                    <br/><br/>
                    - <strong>JavaScript</strong> code runs directly in your browser.
                    <br/>
                    - <strong>Python</strong> code is executed by an AI-powered simulator, which returns the output.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Sharing Your Code</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Click the "Share" button to create a unique, shareable link to your current file's code and language setting. Anyone with the link can view and run your code in their own browser. It's perfect for collaboration and asking for help.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
