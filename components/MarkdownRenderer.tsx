'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-bold text-navy-950 mt-2 mb-5 border-b border-silver-300 pb-3" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-3" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold text-navy-900 mt-6 mb-2" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-[15px] leading-7 text-slate-700 mb-4" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-6 mb-4 space-y-1.5 text-slate-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-slate-700" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mb-4 rounded-r-lg border-l-4 border-primary-500 bg-primary-50/70 px-4 py-3 text-slate-700 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
  a: ({ children, href = '', ...props }) => {
    const isExternal = href.startsWith('http://') || href.startsWith('https://')
    return (
      <a
        href={href}
        className="font-medium text-primary-700 underline decoration-primary-300 underline-offset-2 hover:text-primary-800"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    )
  },
  table: ({ children, ...props }) => (
    <div className="mb-5 overflow-x-auto rounded-lg border border-silver-300">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-silver-200/70 text-slate-800" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-silver-300 px-3 py-2 text-left font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-silver-300 px-3 py-2 align-top text-slate-700" {...props}>
      {children}
    </td>
  ),
  hr: (props) => <hr className="my-8 border-silver-300" {...props} />,
  code: ({ className, children, ...props }) => {
    const codeContent = String(children).replace(/\n$/, '')
    if (className?.includes('language-')) {
      return (
        <pre className="mb-5 overflow-x-auto rounded-lg bg-slate-900 p-4 text-slate-100">
          <code className={className} {...props}>
            {codeContent}
          </code>
        </pre>
      )
    }

    return (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-slate-800" {...props}>
        {children}
      </code>
    )
  }
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
