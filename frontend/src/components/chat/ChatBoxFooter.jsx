import { useRef, useState } from "react";
import { Paperclip, SendHorizonal, X } from "lucide-react";

import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";

import { toast } from "sonner";
import EmojiPiker from "./EmojiPiker";

const ChatBoxFooter = ({ selectedConver }) => {
  const { user } = useAuthStore();

  const { chatSendDirectMessage,chatSendGroupMessage } = useChatStore();

  const [value, setValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  if (!user) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

const handleSendMessage = async () => {
  if (!value.trim() && !selectedFile) return;
  const currValue = value;
  try {
    const isDirect = selectedConver.type === "direct";

    const conversationId = selectedConver._id;

    const file = selectedFile || null;

    setValue("");

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.currValue = "";
    }

    if (isDirect) {
      const participants = selectedConver.participants;
      const recipient = participants.find((p) => p._id !== user._id);

      await chatSendDirectMessage(recipient._id, currValue, conversationId, file);
    } else {
      await chatSendGroupMessage(conversationId, currValue, file);
    }
  } catch (err) {
    console.log(err);
    toast.error("Failed to send message");
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  return (
    <div className="border-t rounded-b-xl bg-background px-3 py-2">
      {/* FILE PREVIEW */}
      {selectedFile && (
        <div className="mb-2 flex items-center justify-between rounded-2xl bg-muted px-3 py-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <Paperclip className="h-4 w-4 shrink-0 text-blue-500" />

            <p className="truncate text-sm">{selectedFile.name}</p>
          </div>

          <button
            onClick={removeSelectedFile}
            className="rounded-full p-1 hover:bg-background"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* INPUT */}
      <div className="flex items-end gap-2">
        {/* LEFT ACTIONS */}

        {/* MESSAGE INPUT */}
        <div className="flex flex-1 border items-center rounded-xl bg-muted">
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full p-2 transition hover:bg-muted"
            >
              <Paperclip className="h-5 w-5 text-blue-500" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </div>
          <input
            rows={1}
            value={value}
            onKeyDown={handleKeyDown}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Aa"
            className="max-h-48 w-full resize-none bg-transparent text-sm outline-none"
          />

          <div className="flex items-center gap-1 p-2">
            <EmojiPiker onChange={(emoji)=> setValue(`${value}${emoji}`)}/>
          </div>
        </div>
        {/* SEND */}
        <button
          onClick={handleSendMessage}
          disabled={!value.trim() && !selectedFile}
          className="rounded-full p-2 transition hover:bg-muted disabled:opacity-50"
        >
          <SendHorizonal className="h-6 w-6 text-blue-500" />
        </button>
      </div>
    </div>
  );
};

export default ChatBoxFooter;
