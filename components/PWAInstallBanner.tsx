'use client';

import { useState, useEffect } from 'react';
import { usePWAInstall } from '@/lib/hooks/usePWAInstall';
import { X, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PWAInstallBanner() {
    const { isInstallable, isIOS, handleInstallClick } = usePWAInstall();
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Show banner after a short delay to not be too intrusive
        if ((isInstallable || isIOS) && !isDismissed) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isInstallable, isIOS, isDismissed]);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
        // Optionally save to localStorage to not show again for a while
        localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
    };

    useEffect(() => {
        const dismissedAt = localStorage.getItem('pwa-banner-dismissed');
        if (dismissedAt) {
            const oneDay = 24 * 60 * 60 * 1000;
            if (Date.now() - parseInt(dismissedAt) < oneDay) {
                setIsDismissed(true);
            }
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] p-4 animate-in fade-in slide-in-from-top duration-500">
            <div className="max-w-xl mx-auto backdrop-blur-xl bg-white/10 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src="/icon.png" alt="KVideo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">安装 KVideo</h3>
                        <p className="text-xs text-white/60">
                            {isIOS ? '点击浏览器分享按钮，选择“添加到主屏幕”' : '安装到桌面，体验更流畅'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!isIOS && (
                        <Button
                            size="sm"
                            onClick={handleInstallClick}
                            className="bg-white text-black hover:bg-white/90 rounded-full px-4"
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            安装
                        </Button>
                    )}
                    {isIOS && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
                            <Share className="w-4 h-4 text-white" />
                        </div>
                    )}
                    <button
                        onClick={handleDismiss}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-white/40" />
                    </button>
                </div>
            </div>
        </div>
    );
}
