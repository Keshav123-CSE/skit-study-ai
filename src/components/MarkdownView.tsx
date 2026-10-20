'use client';

import React from 'react';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  // Simple, clean markdown-to-HTML parser that handles headers, bold, tables, lists, alerts, and math notation safely
  const formatMarkdown = (text: string) => {
    // Process code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const code = lang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 font-mono text-xs">
            {lang && (
              <div className="bg-slate-800/80 px-3 py-1 text-[11px] text-slate-400 font-semibold border-b border-slate-700">
                {lang}
              </div>
            )}
            <pre className="p-3 text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Process standard markdown lines
      const lines = part.split('\n');
      const renderedLines: React.ReactNode[] = [];
      let inTable = false;
      let tableRows: string[][] = [];

      const flushTable = (keyPrefix: string) => {
        if (tableRows.length > 0) {
          const headers = tableRows[0];
          const body = tableRows.slice(2); // Skip separator row
          renderedLines.push(
            <div key={`${keyPrefix}-tbl`} className="my-3 overflow-x-auto rounded-lg border border-slate-700">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800 text-slate-200 uppercase font-semibold">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="px-3 py-2 border-b border-slate-700">
                        {h.trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                  {body.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/40">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 text-slate-300 font-mono">
                          {renderInline(cell.trim())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          tableRows = [];
          inTable = false;
        }
      };

      lines.forEach((line, lIdx) => {
        const trimmed = line.trim();

        // Check if table row
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          inTable = true;
          const cells = trimmed
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim());
          tableRows.push(cells);
          return;
        } else if (inTable) {
          flushTable(`tbl-${lIdx}`);
        }

        // Horizontal rules
        if (trimmed === '---' || trimmed === '***') {
          renderedLines.push(<hr key={lIdx} className="my-4 border-slate-800" />);
          return;
        }

        // Headers
        if (trimmed.startsWith('#### ')) {
          renderedLines.push(
            <h4 key={lIdx} className="text-sm font-semibold text-amber-300 mt-4 mb-1">
              {renderInline(trimmed.slice(5))}
            </h4>
          );
          return;
        }
        if (trimmed.startsWith('### ')) {
          renderedLines.push(
            <h3 key={lIdx} className="text-base font-bold text-slate-100 mt-5 mb-2 flex items-center gap-1.5">
              {renderInline(trimmed.slice(4))}
            </h3>
          );
          return;
        }
        if (trimmed.startsWith('## ')) {
          renderedLines.push(
            <h2 key={lIdx} className="text-lg font-bold text-white mt-6 mb-2 border-b border-slate-800 pb-1">
              {renderInline(trimmed.slice(3))}
            </h2>
          );
          return;
        }
        if (trimmed.startsWith('# ')) {
          renderedLines.push(
            <h1 key={lIdx} className="text-xl font-extrabold text-white mt-4 mb-3">
              {renderInline(trimmed.slice(2))}
            </h1>
          );
          return;
        }

        // Blockquotes / Alerts
        if (trimmed.startsWith('> [!NOTE]') || trimmed.startsWith('> [!TIP]')) {
          renderedLines.push(
            <div key={lIdx} className="my-2 p-3 bg-sky-950/30 border-l-4 border-sky-500 rounded-r-lg text-sky-200 text-xs">
              <span className="font-bold uppercase tracking-wider block mb-1">SKIT Faculty Note</span>
              {renderInline(trimmed.replace(/^> \[[!A-Z]+\]\s*/, ''))}
            </div>
          );
          return;
        }
        if (trimmed.startsWith('> [!WARNING]') || trimmed.startsWith('> [!CAUTION]')) {
          renderedLines.push(
            <div key={lIdx} className="my-2 p-3 bg-amber-950/30 border-l-4 border-amber-500 rounded-r-lg text-amber-200 text-xs">
              <span className="font-bold uppercase tracking-wider block mb-1">RTU Exam Warning</span>
              {renderInline(trimmed.replace(/^> \[[!A-Z]+\]\s*/, ''))}
            </div>
          );
          return;
        }
        if (trimmed.startsWith('> ')) {
          renderedLines.push(
            <blockquote key={lIdx} className="my-2 pl-3 border-l-2 border-amber-500/60 text-slate-300 italic text-xs">
              {renderInline(trimmed.slice(2))}
            </blockquote>
          );
          return;
        }

        // Bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          renderedLines.push(
            <li key={lIdx} className="ml-4 list-disc text-slate-300 my-0.5 text-xs sm:text-sm">
              {renderInline(trimmed.slice(2))}
            </li>
          );
          return;
        }

        // Numbered lists
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          renderedLines.push(
            <li key={lIdx} className="ml-4 list-decimal text-slate-300 my-0.5 text-xs sm:text-sm">
              {renderInline(numMatch[2])}
            </li>
          );
          return;
        }

        // Empty line
        if (!trimmed) {
          renderedLines.push(<div key={lIdx} className="h-2" />);
          return;
        }

        // Regular paragraph
        renderedLines.push(
          <p key={lIdx} className="text-slate-300 my-1 leading-relaxed text-xs sm:text-sm">
            {renderInline(trimmed)}
          </p>
        );
      });

      if (inTable) {
        flushTable('final');
      }

      return <div key={index}>{renderedLines}</div>;
    });
  };

  const renderInline = (str: string): React.ReactNode => {
    // Process math symbols: $...$ or $$...$$
    // Process bold **...**
    // Process inline code `...`
    const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$|`[^`]+`|\*\*[^*]+\*\*)/g;
    const tokens = str.split(regex);

    return tokens.map((token, i) => {
      if (!token) return null;

      // Display math $$...$$
      if (token.startsWith('$$') && token.endsWith('$$')) {
        return (
          <span key={i} className="inline-block px-2 py-0.5 my-0.5 bg-slate-800/80 text-amber-300 font-mono text-xs rounded border border-slate-700">
            {token.slice(2, -2).trim()}
          </span>
        );
      }

      // Inline math $...$
      if (token.startsWith('$') && token.endsWith('$')) {
        return (
          <span key={i} className="px-1 py-0.2 bg-slate-800 text-amber-300 font-mono text-xs rounded">
            {token.slice(1, -1).trim()}
          </span>
        );
      }

      // Inline code `...`
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 bg-slate-800 text-sky-300 font-mono text-xs rounded border border-slate-700/60">
            {token.slice(1, -1)}
          </code>
        );
      }

      // Bold **...**
      if (token.startsWith('**') && token.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-100">
            {token.slice(2, -2)}
          </strong>
        );
      }

      return token;
    });
  };

  return <div className={`text-slate-300 space-y-1 ${className}`}>{formatMarkdown(content)}</div>;
};
