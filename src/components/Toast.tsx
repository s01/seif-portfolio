import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
    theme?: 'night' | 'morning';
}

function ToastItem({ toast, onClose, theme = 'night' }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const duration = toast.duration || 3000;
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onClose(toast.id), 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
    }, [toast, onClose]);

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
    };

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    const Icon = icons[toast.type];

    const isMorning = theme === 'morning';

    return (
        <div
            className={`
        flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm
        transition-all duration-300
        ${isMorning ? 'border-gray-200 bg-white/95 text-gray-800' : 'border-white/10 bg-black/90 text-white'}
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
        >
            <div className={`rounded-full p-1 ${colors[toast.type]}`}>
                <Icon className="h-4 w-4 text-white" />
            </div>
            <p className={`flex-1 text-sm font-medium ${isMorning ? 'text-gray-800' : 'text-white'}`}>{toast.message}</p>
            <button
                onClick={() => {
                    setIsExiting(true);
                    setTimeout(() => onClose(toast.id), 300);
                }}
                className={`transition ${isMorning ? 'text-gray-400 hover:text-gray-600' : 'text-white/60 hover:text-white'}`}
                aria-label="Close notification"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
    theme?: 'night' | 'morning';
}

export function ToastContainer({ toasts, onClose, theme = 'night' }: ToastContainerProps) {
    return (
        <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onClose={onClose} theme={theme} />
                </div>
            ))}
        </div>
    );
}

// Toast hook for easy usage
export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = 'info', duration?: number) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = { id, message, type, duration };
        setToasts((prev) => [...prev, newToast]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return {
        toasts,
        showToast,
        removeToast,
        success: (message: string, duration?: number) => showToast(message, 'success', duration),
        error: (message: string, duration?: number) => showToast(message, 'error', duration),
        info: (message: string, duration?: number) => showToast(message, 'info', duration),
    };
}
