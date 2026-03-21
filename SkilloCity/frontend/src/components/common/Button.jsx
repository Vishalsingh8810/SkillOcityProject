import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-primary text-white border border-transparent hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-950',
    outline: 'bg-white text-text border border-border hover:bg-zinc-50 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-950',
    ghost: 'bg-transparent text-muted hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-950',
    danger: 'bg-danger text-white border border-transparent hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600'
};

const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-8 text-base',
};

export default function Button({
    children, variant = 'primary', size = 'md', loading = false,
    disabled = false, icon: Icon, fullWidth = false, className = '', ...props
}) {
    // Pure minimal interaction: subtle translate, no obnoxious scale
    const interactionClass = disabled || loading ? '' : 'active:translate-y-[1px]';
    
    return (
        <button
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center gap-2 font-medium rounded-md
                transition-colors outline-none shrink-0 shadow-sm
                ${variants[variant]} ${sizes[size]}
                ${fullWidth ? 'w-full' : ''}
                ${disabled || loading ? 'opacity-50 cursor-not-allowed shadow-none' : interactionClass}
                ${className}
            `}
            {...props}
        >
            {loading ? <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin shrink-0" /> : Icon && <Icon size={size === 'sm' ? 14 : 16} className="shrink-0" />}
            {/* Truncate text logic guarantees no weird stretching if flex parent forces squeeze */}
            <span className="truncate">{children}</span>
        </button>
    );
}
