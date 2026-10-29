import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, FileText, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { supabase } from '../../supabase';
import type { ChatMessage, ChatThread } from '../../types/crm';
import { MessageList } from './MessageList';
import { ChatInputBar } from './ChatInputBar';
import { MeetingModal } from '../modals/MeetingModal';
import { QuotationBuilderModal } from './QuotationBuilderModal';

interface ChatWindowProps {
  userId: string;
  userName?: string;
  darkMode: boolean;
  isAdmin?: boolean;
  onBackToThreads?: () => void;
  triggerToast?: (msg: string) => void;
}

export function ChatWindow({
  userId,
  userName = 'DigiWorku Client Partner',
  darkMode,
  isAdmin = false,
  onBackToThreads,
  triggerToast,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversation messages isolated by current userId
  const fetchThreadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('[Chat] Failed to load messages:', error.message);
        return;
      }

      if (data && Array.isArray(data)) {
        const mapped: ChatMessage[] = data.map((row: any) => ({
          id: row.id,
          role: row.role === 'admin' ? 'assistant' : row.role,
          content: row.content,
          timestamp: new Date(row.created_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          attachment: row.attachment_url
            ? {
                filename: row.attachment_url.split('/').pop() || 'Attachment',
                size: 'Cloud File',
                type: (row.attachment_type as any) || 'other',
                url: row.attachment_url,
              }
            : undefined,
        }));
        setMessages(mapped);
      }
    } catch (err: any) {
      console.error('[Chat] fetchThreadMessages error:', err);
    }
  };

  useEffect(() => {
    fetchThreadMessages();

    // Isolated Realtime subscription for ONLY this user's channel (stops global broadcast storm)
    const channelName = `messages:user_id=eq.${userId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          const newRow = payload.new;
          if (newRow) {
            const newMsg: ChatMessage = {
              id: newRow.id,
              role: newRow.role === 'admin' ? 'assistant' : newRow.role,
              content: newRow.content,
              timestamp: new Date(newRow.created_at || Date.now()).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }),
              attachment: newRow.attachment_url
                ? {
                    filename: newRow.attachment_url.split('/').pop() || 'Attachment',
                    size: 'Cloud File',
                    type: (newRow.attachment_type as any) || 'other',
                    url: newRow.attachment_url,
                  }
                : undefined,
            };
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .subscribe((status: string) => {
        setIsConnecting(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (
    text: string,
    attachment?: { filename: string; size: string; type: any; url?: string }
  ) => {
    const timeFormatted = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const role = isAdmin ? 'admin' : 'user';

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      role: isAdmin ? 'assistant' : 'user',
      content: text,
      timestamp: timeFormatted,
      attachment,
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const dbRecord: any = {
        user_id: userId,
        content: text,
        role,
        attachment_url: attachment?.url || null,
        attachment_type: attachment?.type || null,
      };

      const { data, error } = await supabase.from('messages').insert(dbRecord).select().single();

      if (error) {
        console.error('[Chat] Message insert error:', error.message);
        if (triggerToast) triggerToast(`⚠️ Could not save message: ${error.message}`);
      } else if (data) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: data.id } : m))
        );
      }
    } catch (err: any) {
      console.error('[Chat] Failed to send message:', err);
    }
  };

  const handleSendDynamicQuote = (quote: { title: string; formattedText: string; budget: string; timeline: string }) => {
    handleSendMessage(quote.formattedText);
    if (triggerToast) triggerToast(`📄 Proposal "${quote.title}" posted to client channel!`);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fafafc] dark:bg-[#121214]">
      {/* Header */}
      <div className="p-3.5 md:p-4 px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] flex items-center justify-between z-10 shadow-xs">
        <div className="flex items-center gap-3">
          {onBackToThreads && (
            <button
              onClick={onBackToThreads}
              className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00c853] to-emerald-400 text-black flex items-center justify-center font-black text-sm shadow-xs">
              DW
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00c853] ring-2 ring-white dark:ring-[#18181b]" />
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
              <span>{userName}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full font-bold">
                VERIFIED
              </span>
            </h4>
            <span className="text-[10px] text-[#00c853] font-bold block tracking-wider uppercase">
              🟢 LIVE REALTIME
            </span>
          </div>
        </div>

        {/* Action Call & Video buttons */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {isAdmin && (
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="py-1.5 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-[#00c853] font-extrabold text-xs flex items-center gap-1.5 hover:bg-[#00c853] hover:text-black transition-colors cursor-pointer"
              title="Build Custom Dynamic Quote"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quote</span>
            </button>
          )}

          <button
            onClick={() => setIsMeetingModalOpen(true)}
            className="p-2 text-slate-500 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
            title="Direct Voice Call"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMeetingModalOpen(true)}
            className="p-2 text-slate-500 hover:text-[#00c853] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
            title="Google Meet Video Call"
          >
            <Video className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <MessageList messages={messages} currentUserId={userId} darkMode={darkMode} />
      <div ref={messagesEndRef} />

      {/* Input Bar */}
      <ChatInputBar
        onSendMessage={handleSendMessage}
        isAdmin={isAdmin}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
      />

      {/* Meeting Modal */}
      <MeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        darkMode={darkMode}
        clientName={userName}
      />

      {/* Quotation Builder Modal */}
      <QuotationBuilderModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        darkMode={darkMode}
        onSendQuote={handleSendDynamicQuote}
      />
    </div>
  );
}
export default ChatWindow;
