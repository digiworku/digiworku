import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, FileText, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { uploadMediaToStorage } from '../../supabase';

interface ChatInputBarProps {
  onSendMessage: (text: string, attachment?: { filename: string; size: string; type: any; url?: string }) => void;
  disabled?: boolean;
  onOpenCallModal?: () => void;
  onOpenQuoteModal?: () => void;
  isAdmin?: boolean;
}

export function ChatInputBar({
  onSendMessage,
  disabled = false,
  onOpenCallModal,
  onOpenQuoteModal,
  isAdmin = false,
}: ChatInputBarProps) {
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{
    file: File;
    name: string;
    sizeFormatted: string;
    type: 'pdf' | 'image' | 'video' | 'archive' | 'other';
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let type: 'pdf' | 'image' | 'video' | 'archive' | 'other' = 'other';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';
    else if (file.type === 'application/pdf') type = 'pdf';
    else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('tar')) type = 'archive';

    setAttachedFile({
      file,
      name: file.name,
      sizeFormatted: formatFileSize(file.size),
      type,
    });
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !attachedFile) || isUploading || disabled) return;

    let uploadedAttachment = undefined;

    if (attachedFile) {
      setIsUploading(true);
      const { url, error } = await uploadMediaToStorage(attachedFile.file, 'chat-attachments');
      setIsUploading(false);

      if (error) {
        alert(`File upload failed: ${error}`);
        return;
      }

      uploadedAttachment = {
        filename: attachedFile.name,
        size: attachedFile.sizeFormatted,
        type: attachedFile.type,
        url: url || undefined,
      };
    }

    onSendMessage(inputText.trim(), uploadedAttachment);
    setInputText('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 md:p-4 bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800">
      {/* Attached file preview chip */}
      {attachedFile && (
        <div className="mb-2.5 flex items-center gap-2 p-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs w-fit max-w-full">
          <div className="text-[#00c853]">
            {attachedFile.type === 'image' ? (
              <ImageIcon className="w-4 h-4" />
            ) : attachedFile.type === 'video' ? (
              <Video className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </div>
          <span className="font-semibold truncate max-w-[200px]">{attachedFile.name}</span>
          <span className="text-slate-400 text-[10px]">({attachedFile.sizeFormatted})</span>
          <button
            type="button"
            onClick={() => setAttachedFile(null)}
            className="p-1 text-slate-400 hover:text-red-500 cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/mp4,application/pdf,.zip,.rar"
        />

        {/* Attachment button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || disabled}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-[#00c853] hover:border-[#00c853]/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          title="Upload image, video or project file"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Admin Proposal Tool shortcut */}
        {isAdmin && onOpenQuoteModal && (
          <button
            type="button"
            onClick={onOpenQuoteModal}
            className="hidden sm:flex py-2 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-[#00c853] font-extrabold text-[11px] items-center gap-1.5 hover:bg-[#00c853] hover:text-black transition-colors cursor-pointer"
            title="Create Custom Client Proposal"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Quote</span>
          </button>
        )}

        {/* Input box */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message, ask questions, or request scope..."
          disabled={disabled || isUploading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs md:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#00c853] transition-all"
        />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={(!inputText.trim() && !attachedFile) || isUploading || disabled}
          className="p-2.5 px-4 rounded-xl bg-[#00c853] hover:bg-[#00b548] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-40 active:scale-95"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">Send</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
export default ChatInputBar;
