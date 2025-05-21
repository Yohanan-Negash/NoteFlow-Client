'use client';

import { useEffect, useState } from 'react';
import snarkdown from 'snarkdown';

const markdownStyles = `
  .markdown-preview {
    line-height: 1.3;
  }

  .markdown-preview h1, 
  .markdown-preview h2, 
  .markdown-preview h3, 
  .markdown-preview h4, 
  .markdown-preview h5, 
  .markdown-preview h6 {
    line-height: 1;
    margin-top: 1.2rem;
    margin-bottom: 1rem;
    color: #1e40af;
  }

  .markdown-preview h1 {
    font-size: 1.6rem;
    font-weight: 700;
  }
  
  .markdown-preview h2 {
    font-size: 1.4rem;
    font-weight: 600;
  }
  
  .markdown-preview h3 {
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  .markdown-preview h4, .markdown-preview h5, .markdown-preview h6 {
    font-size: 1rem;
    font-weight: 600;
  }
  
  .markdown-preview p {
    margin-top: 0;
    margin-bottom: 0.1rem;
    line-height: 1.3;
  }
  
  .markdown-preview * + p {
    margin-top: 0.1rem;
  }
  
  .markdown-preview h1 + p,
  .markdown-preview h2 + p,
  .markdown-preview h3 + p,
  .markdown-preview h4 + p,
  .markdown-preview h5 + p,
  .markdown-preview h6 + p {
    margin-top: 0;
  }
  
  .markdown-preview strong {
    font-weight: 700;
  }
  
  .markdown-preview em {
    font-style: italic;
  }
  
  .markdown-preview a {
    color: #2563eb;
    text-decoration: underline;
  }
  
  .markdown-preview ul, .markdown-preview ol {
    padding-left: 1.5rem;
    margin-top: 0;
    margin-bottom: 0.1rem;
  }
  
  .markdown-preview ul {
    list-style-type: disc;
  }
  
  .markdown-preview ol {
    list-style-type: decimal;
  }
  
  .markdown-preview li {
    margin-bottom: 0.05rem;
  }
  
  .markdown-preview blockquote {
    border-left: 3px solid #e5e7eb;
    padding-left: 0.75rem;
    font-style: italic;
    color: #4b5563;
    margin-top: 0;
    margin-bottom: 0.1rem;
  }
  
  .markdown-preview code {
    font-family: monospace;
    background-color: #f3f4f6;
    padding: 0.15rem 0.3rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }
  
  .markdown-preview pre {
    background-color: #f3f4f6;
    padding: 0.5rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin-top: 0;
    margin-bottom: 0.1rem;
  }
  
  .markdown-preview pre code {
    background-color: transparent;
    padding: 0;
    display: block;
    white-space: pre;
    color: #374151;
  }
  
  .markdown-preview hr {
    height: 1px;
    background-color: #e5e7eb;
    border: none;
    margin: 0.2rem 0;
  }
  
  .markdown-preview img {
    max-width: 100%;
    height: auto;
    border-radius: 0.375rem;
    margin: 0.1rem 0;
  }
  
  .markdown-preview table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 0;
    margin-bottom: 0.1rem;
  }
  
  .markdown-preview th, .markdown-preview td {
    border: 1px solid #e5e7eb;
    padding: 0.2rem;
  }
  
  .markdown-preview th {
    background-color: #f9fafb;
    font-weight: 600;
  }
  
  .markdown-preview > p:first-child {
    margin-top: 0;
  }
  
  .markdown-preview > :last-child {
    margin-bottom: 0;
  }
`;

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [renderedHtml, setRenderedHtml] = useState('');

  useEffect(() => {
    if (!content.trim()) {
      setRenderedHtml('<span class="text-gray-400">Nothing to preview.</span>');
      return;
    }

    let processedContent = processCodeBlocks(content);
    processedContent = fixItalics(processedContent);
    processedContent = fixStrikethrough(processedContent);

    // Handle multi-paragraph content
    const html = processedContent
      .split('\n')
      .map((line) => (line.trim() ? snarkdown(line) : ''))
      .join('\n')
      .replace(/\n\n+/g, '</p><p>');
    // .replace(/\n/g, '<br>');

    setRenderedHtml(`<style>${markdownStyles}</style><div class="markdown-preview">
      <p>${html}</p>
    </div>`);
  }, [content]);

  return (
    <div
      className='text-base text-gray-800'
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}

// Process code blocks before snarkdown processing
function processCodeBlocks(content: string): string {
  // Replace fenced code blocks with placeholders
  const codeBlocks: string[] = [];
  let index = 0;

  // Regex for matching ```lang\n code \n``` blocks
  const blockRegex = /```(\w*)\n([\s\S]*?)\n```/g;

  const processedContent = content.replace(
    blockRegex,
    (match, language, code) => {
      const placeholder = `__CODE_BLOCK_${index}__`;
      codeBlocks[index] = `<pre><code>${escapeHtml(code)}</code></pre>`;
      index++;
      return placeholder;
    }
  );

  // Put the code blocks back in place
  let finalContent = processedContent;
  for (let i = 0; i < codeBlocks.length; i++) {
    finalContent = finalContent.replace(`__CODE_BLOCK_${i}__`, codeBlocks[i]);
  }

  return finalContent;
}

// Fix italics to work with underscores
function fixItalics(content: string): string {
  return content.replace(/__(.*?)__/g, '_$1_');
}

// Fix strikethrough markers (--text--) to HTML del tags
function fixStrikethrough(content: string): string {
  return content.replace(/--(.*?)--/g, '<del>$1</del>');
}

// Escape HTML to prevent XSS in code blocks
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
