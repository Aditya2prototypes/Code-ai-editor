const languageMap: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  html: 'html',
  css: 'css',
  json: 'json',
  md: 'markdown',
  txt: 'plaintext',
  sh: 'shell',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  cs: 'csharp',
  go: 'go',
  rb: 'ruby',
};

const extensionMap: Record<string, string> = {
  javascript: '.js',
  typescript: '.ts',
  python: '.py',
  html: '.html',
  css: '.css',
  json: '.json',
  markdown: '.md',
  plaintext: '.txt',
  shell: '.sh',
  java: '.java',
  c: '.c',
  cpp: '.cpp',
  csharp: '.cs',
  go: '.go',
  ruby: '.rb',
};

const commentStartMap: Record<string, string> = {
    javascript: '//',
    typescript: '//',
    python: '#',
    shell: '#',
    ruby: '#',
    java: '//',
    c: '//',
    cpp: '//',
    csharp: '//',
    go: '//',
}

export function getLanguageFromFileName(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return languageMap[extension] || 'plaintext';
}

export function getExtensionFromLanguage(language: string): string {
    return extensionMap[language] || '.txt';
}

export function getInitialCode(fileName: string, language: string): string {
    const commentStart = commentStartMap[language];
    if (language === 'html') {
        return `<!-- ${fileName} -->\n`;
    }
    if(language === 'css') {
        return `/* ${fileName} */\n`;
    }
    if (commentStart) {
        return `${commentStart} ${fileName}\n`;
    }
    return `Welcome to ${fileName}\n`;
}
