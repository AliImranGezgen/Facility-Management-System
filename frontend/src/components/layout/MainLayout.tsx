import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-dark-bg flex">
            {/* Sol Menü */}
            <Sidebar />

            {/* Ana İçerik Alanı */}
            <div className="flex-1 flex flex-col ml-64">
                {/* Üst Menü */}
                <Header />

                {/* Değişen İçerik (Dashboard vs.) */}
                <main className="flex-1 p-6 mt-16 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};