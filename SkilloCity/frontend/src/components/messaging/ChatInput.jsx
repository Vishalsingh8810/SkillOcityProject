import { useState } from 'react';
import { Send, Paperclip, Smile, Video } from 'lucide-react';

export default function ChatInput({ onSend, onCreateMeetLink, className = '' }) {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text.trim());
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleCreateRoom = () => {
        const roomId = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
        const meetLink = `https://meet.google.com/${roomId}`;
        if (onCreateMeetLink) {
            onCreateMeetLink(meetLink);
        }
    };

    return (
        <div className={`flex items-center gap-2 p-3 bg-white border-t border-border ${className}`}>
            <button className="p-2 text-muted hover:text-primary transition-colors rounded-md hover:bg-primary-light">
                <Paperclip size={18} />
            </button>
            <button
                onClick={handleCreateRoom}
                title="Create Meet Room"
                className="p-2 text-muted hover:text-green-600 transition-colors rounded-md hover:bg-green-50"
            >
                <Video size={18} />
            </button>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 h-10 px-4 border border-border rounded-full text-sm focus:outline-none focus:border-primary focus:shadow-focus"
            />
            <button className="p-2 text-muted hover:text-primary transition-colors rounded-md hover:bg-primary-light">
                <Smile size={18} />
            </button>
            <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send size={16} />
            </button>
        </div>
    );
}
