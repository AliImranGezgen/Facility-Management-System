import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    action?: ReactNode; // Sağ üst köşeye buton koymak istersek
}

export const Card = ({ children, className = '', title, action }: CardProps) => {
    return (
        <div className={`bg-dark-card border border-dark-border rounded-xl shadow-sm p-5 ${className}`}>
            {/* Başlık Varsa Göster */}
            {(title || action) && (
                <div className="flex justify-between items-center mb-4">
                    {title && <h3 className="text-gray-100 font-semibold text-lg">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            
            {/* İçerik */}
            <div className="text-gray-300">
                {children}
            </div>
        </div>
    );
};