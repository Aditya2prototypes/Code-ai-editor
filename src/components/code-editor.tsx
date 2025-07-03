'use client';

import React from 'react';
import Editor, { OnChange } from '@monaco-editor/react';
import { Skeleton } from './ui/skeleton';

interface CodeEditorProps {
  language: string;
  code: string;
  onCodeChange: (value: string | undefined) => void;
}

export function CodeEditor({ language, code, onCodeChange }: CodeEditorProps) {
  return (
    <div className="relative h-full w-full rounded-lg border bg-card font-code shadow-sm overflow-hidden">
      <Editor
        height="100%"
        language={language.toLowerCase()}
        value={code}
        onChange={onCodeChange as OnChange}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Source Code Pro', monospace",
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
        }}
        loading={<Skeleton className="h-full w-full" />}
      />
    </div>
  );
}
