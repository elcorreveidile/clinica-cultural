'use client';

import Link from 'next/link';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

/** Renderiza el markdown del Doctor: enlaces internos clicables, tablas, listas… */
export default function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed break-words [overflow-wrap:anywhere] [&_p]:m-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_code]:bg-clinic-blue/10 [&_code]:px-1 [&_code]:rounded [&_pre]:whitespace-pre-wrap [&_pre]:break-words">
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ href, children }) => {
            const url = href ?? '#';
            if (url.startsWith('/')) {
              return (
                <Link href={url} className="text-clinic-red font-semibold underline">
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-clinic-red font-semibold underline"
              >
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-clinic-gray px-2 py-1 text-left bg-clinic-gray/40">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-clinic-gray px-2 py-1">{children}</td>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
