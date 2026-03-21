import Avatar from '../common/Avatar';
import { formatTime } from '../../utils/formatters';

export default function MessageBubble({ message, isSent, senderName }) {
    return (
        <div className={`flex gap-2 mb-3 ${isSent ? 'flex-row-reverse' : ''}`}>
            {!isSent && <Avatar name={senderName} size={32} className="mt-1" />}
            <div className={`max-w-[70%] ${isSent ? 'items-end' : ''}`}>
                {message.urgency && (
                    <div className="mb-1">
                        <span className="text-xs font-semibold text-danger bg-red-50 px-2 py-0.5 rounded-full">🔴 Urgent</span>
                    </div>
                )}
                <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isSent
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-gray-100 text-text rounded-bl-md'
                        } ${message.urgency ? 'border-l-2 border-danger' : ''}`}
                >
                    {message.text}
                </div>
                <div className={`flex items-center gap-1 mt-1 ${isSent ? 'justify-end' : ''}`}>
                    <span className="text-[11px] text-muted">{formatTime(message.timestamp)}</span>
                    {isSent && (
                        <span className={`text-[11px] ${message.read ? 'text-cyan-500' : 'text-muted'}`}>
                            ✓✓
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
