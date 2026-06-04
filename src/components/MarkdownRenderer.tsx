import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

export function MarkdownRenderer({ text }: MarkdownRendererProps) {
  if (!text) return null;

  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  
  // Track consecutive list items to group them inside <ul> or <ol>
  let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;

  const commitList = (index: number) => {
    if (currentList) {
      if (currentList.type === 'ul') {
        renderedElements.push(
          <ul key={`ul-${index}`} className="list-disc pl-5 my-3 space-y-1.5 text-slate-800 dark:text-slate-300">
            {currentList.items}
          </ul>
        );
      } else {
        renderedElements.push(
          <ol key={`ol-${index}`} className="list-decimal pl-5 my-3 space-y-1.5 text-slate-800 dark:text-slate-300">
            {currentList.items}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const parseInlineStyles = (lineText: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = lineText;
    let index = 0;

    while (remaining.length > 0) {
      const boldIndex = remaining.indexOf('**');
      if (boldIndex !== -1) {
        if (boldIndex > 0) {
          parts.push(<span key={`text-${index++}`}>{remaining.substring(0, boldIndex)}</span>);
        }
        remaining = remaining.substring(boldIndex + 2);
        const endBoldIndex = remaining.indexOf('**');
        if (endBoldIndex !== -1) {
          parts.push(
            <strong 
              key={`bold-${index++}`} 
              className="font-bold text-slate-950 dark:text-sky-300 px-0.5"
            >
              {remaining.substring(0, endBoldIndex)}
            </strong>
          );
          remaining = remaining.substring(endBoldIndex + 2);
        } else {
          parts.push(<span key={`text-err-${index++}`}>**{remaining}</span>);
          break;
        }
      } else {
        parts.push(<span key={`text-end-${index++}`}>{remaining}</span>);
        break;
      }
    }
    return parts;
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    // Check for headers (like ###, ##, #)
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
    if (headerMatch) {
      commitList(lineIdx);
      const level = headerMatch[1].length;
      const headerText = headerMatch[2];
      const parsedContent = parseInlineStyles(headerText);
      
      const className = level <= 3
        ? "font-display font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3 border-b border-slate-200 dark:border-slate-800/80 pb-1.5 text-[12px] uppercase tracking-wider flex items-center gap-1.5"
        : "font-display font-bold text-slate-850 dark:text-slate-200 mt-4 mb-2 text-[11px] uppercase tracking-wide";
      
      renderedElements.push(
        <h4 key={`h-${lineIdx}`} className={className}>
          {parsedContent}
        </h4>
      );
      return;
    }

    // Check for bullet list item: starts with "-", "*", "•"
    const bulletMatch = trimmed.match(/^([-\*•])\s+(.*)/);
    if (bulletMatch) {
      const itemText = bulletMatch[2];
      const parsedContent = parseInlineStyles(itemText);
      if (!currentList || currentList.type !== 'ul') {
        commitList(lineIdx);
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(
        <li key={`li-${lineIdx}-${currentList.items.length}`} className="leading-relaxed text-xs">
          {parsedContent}
        </li>
      );
      return;
    }

    // Check for numbered list/indents item: starts with e.g. "1. ", "a) "
    const enumMatch = trimmed.match(/^(\d+[\.\)]|[a-zA-Z][\.\)])\s+(.*)/);
    if (enumMatch) {
      const marker = enumMatch[1];
      const itemText = enumMatch[2];
      const parsedContent = parseInlineStyles(itemText);
      if (!currentList || currentList.type !== 'ol') {
        commitList(lineIdx);
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(
        <li 
          key={`li-${lineIdx}-${currentList.items.length}`} 
          style={{ listStyleType: isNaN(parseInt(marker)) ? 'lower-alpha' : 'decimal' }} 
          className="leading-relaxed text-xs ml-1"
        >
          {parsedContent}
        </li>
      );
      return;
    }

    // Empty line
    if (trimmed === '') {
      commitList(lineIdx);
      renderedElements.push(<div key={`br-${lineIdx}`} className="h-2" />);
      return;
    }

    // Standard paragraph
    commitList(lineIdx);
    renderedElements.push(
      <p key={`p-${lineIdx}`} className="leading-relaxed mb-3 text-slate-800 dark:text-slate-300 text-xs">
        {parseInlineStyles(trimmed)}
      </p>
    );
  });

  // Finalize any lists left
  commitList(lines.length);

  return <div className="space-y-1.5">{renderedElements}</div>;
}
