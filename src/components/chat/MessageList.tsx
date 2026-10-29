import React from 'react';
import DOMPurify from 'dompurify';
import { FileText, Download, CheckCircle2, User, Sparkles, ExternalLink } from 'lucide-react';
import type { ChatMessage } from '../../types/crm';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  darkMode: boolean;
}

export function MessageList({ messages, currentUserId, darkMode }: MessageListProps) {
  const sanitizeMarkdownHtml = (content: string): string => {
    // Replace **bold** with <strong> and newlines with <br />
    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');

    return DOMPurify.sanitize(formatted, {
      ALLOWED_TAGS: ['strong', 'em', 'br', 'span', 'p', 'b', 'i', 'code'],
      ALLOWED_ATTR: ['class'],
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      {/* Date badge */}
      <div className="flex justify-center my-2 select-none">
        <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Direct Encrypted Thread
        </span>
      </div>

      {messages.map((msg) => {
        const isUser = msg.role === 'user';

        return (
          <div
            key={msg.id}
            className={`flex items-end gap-2.5 max-w-[85%] md:max-w-[70%] ${
              isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                isUser
                  ? 'bg-gradient-to-tr from-[#00c853] to-emerald-400 text-black'
                  : 'bg-slate-800 text-white border border-slate-700'
              }`}
            >
              {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-[#00c853]" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-3.5 px-4 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm transition-all ${
                isUser
                  ? 'bg-[#00c853] text-black font-medium rounded-br-none'
                  : darkMode
                  ? 'bg-[#202024] text-slate-100 border border-slate-800/80 rounded-bl-none'
                  : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-none'
              }`}
            >
              {/* Sanitized Message Text */}
              <div
                className="prose-xs break-words"
                dangerouslySetInnerHTML={{ __html: sanitizeMarkdownHtml(msg.content) }}
              />

              {/* Attachment if present */}
              {msg.attachment && (
                <div
                  className={`mt-2.5 p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                    isUser
                      ? 'bg-black/10 border-black/15 text-black'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 shrink-0 text-[#00c853]" />
                    <span className="font-semibold truncate text-[11px]">{msg.attachment.filename}</span>
                    <span className="text-[10px] opacity-70">({msg.attachment.size})</span>
                  </div>

                  {msg.attachment.url && (
                    <a
                      href={msg.attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={msg.attachment.filename}
                      className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold shrink-0 cursor-pointer"
                      title="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`text-[9px] mt-1 text-right font-medium tracking-wide ${
                  isUser ? 'text-black/60' : 'text-slate-400'
                }`}
              >
                {msg.timestamp || 'Just now'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default MessageList;
