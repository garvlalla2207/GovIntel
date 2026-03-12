// src/components/ui/StatCard.jsx
import React from 'react';
import { Plus, Check, AlertCircle, ChevronUp, Clock, Activity } from 'lucide-react';

export default function StatCard({ variant, title, value, subtext }) {
    // Define the exact styles and watermark icons based on the image
    const styles = {
        blue: {
            wrapper: 'bg-[#143B5A] border-[2px] md:border-[3px] border-[#143B5A] text-white',
            title: 'text-blue-100/80 tracking-[0.1em] md:tracking-[0.15em]',
            value: 'text-white',
            pill: 'bg-white/10 text-blue-50 flex items-center gap-1 rounded-full px-2 md:px-3 py-1 md:py-1.5 text-[10px] sm:text-xs font-medium w-max backdrop-blur-sm',
            watermark: 'text-white/10 absolute -bottom-4 md:-bottom-6 -right-4 rotate-12 scale-75 md:scale-100 origin-bottom-right',
            shadow: 'shadow-[0_8px_20px_-8px_rgba(20,59,90,0.4)] md:shadow-[0_12px_30px_-10px_rgba(20,59,90,0.5)]',
            Icon: Plus,
        },
        green: {
            wrapper: 'bg-white border-[2px] md:border-[3px] border-[#6A9A6B]',
            title: 'text-[#6A9A6B] tracking-[0.1em] md:tracking-[0.15em]',
            value: 'text-[#202E39]',
            bottomText: 'text-[#6A9A6B] text-[10px] sm:text-xs font-bold truncate',
            watermark: 'text-[#6A9A6B]/10 absolute -bottom-6 md:-bottom-8 -right-4 rotate-12 scale-75 md:scale-100 origin-bottom-right',
            shadow: 'shadow-[0_8px_20px_-8px_rgba(106,154,107,0.2)] md:shadow-[0_12px_30px_-10px_rgba(106,154,107,0.3)]',
            Icon: Check,
        },
        red: {
            wrapper: 'bg-white border-[2px] md:border-[3px] border-[#C55650]',
            title: 'text-[#C55650] tracking-[0.1em] md:tracking-[0.15em]',
            value: 'text-[#202E39]',
            bottomText: 'text-[#C55650] text-[10px] sm:text-xs font-bold truncate',
            watermark: 'text-[#C55650]/5 absolute -bottom-6 md:-bottom-8 -right-6 rotate-[15deg] scale-75 md:scale-100 origin-bottom-right',
            shadow: 'shadow-[0_8px_20px_-8px_rgba(197,86,80,0.2)] md:shadow-[0_12px_30px_-10px_rgba(197,86,80,0.3)]',
            Icon: AlertCircle,
        },
        amber: {
            wrapper: 'bg-white border-[2px] md:border-[3px] border-[#D97706]',
            title: 'text-[#D97706] tracking-[0.1em] md:tracking-[0.15em]',
            value: 'text-[#202E39]',
            bottomText: 'text-[#D97706] text-[10px] sm:text-xs font-bold truncate',
            watermark: 'text-[#D97706]/10 absolute -bottom-6 md:-bottom-8 -right-4 rotate-12 scale-75 md:scale-100 origin-bottom-right',
            shadow: 'shadow-[0_8px_20px_-8px_rgba(217,119,6,0.2)] md:shadow-[0_12px_30px_-10px_rgba(217,119,6,0.3)]',
            Icon: Clock,
        },
        purple: {
            wrapper: 'bg-white border-[2px] md:border-[3px] border-[#966B9D]',
            title: 'text-[#966B9D] tracking-[0.1em] md:tracking-[0.15em]',
            value: 'text-[#202E39]',
            bottomText: 'text-[#966B9D] text-[10px] sm:text-xs font-bold truncate',
            watermark: 'text-[#966B9D]/10 absolute -bottom-6 md:-bottom-8 -right-4 rotate-12 scale-75 md:scale-100 origin-bottom-right',
            shadow: 'shadow-[0_8px_20px_-8px_rgba(150,107,157,0.2)] md:shadow-[0_12px_30px_-10px_rgba(150,107,157,0.3)]',
            Icon: Activity,
        },
    };

    const currentStyle = styles[variant] || styles.blue;
    const WatermarkIcon = currentStyle.Icon;

    return (
        <div className={`relative overflow-hidden rounded-2xl md:rounded-[28px] p-4 sm:p-5 md:p-6 min-h-[130px] md:h-[160px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 ${currentStyle.wrapper} ${currentStyle.shadow}`}>

            {/* Background Watermark Icon */}
            <div className={currentStyle.watermark}>
                <WatermarkIcon size={120} strokeWidth={4} />
            </div>

            <div className="relative z-10">
                <h3 className={`font-bold text-[10px] sm:text-[11px] uppercase ${currentStyle.title} truncate`}>
                    {title}
                </h3>
                <p className={`text-4xl sm:text-5xl lg:text-[42px] xl:text-[52px] leading-[1.1] font-extrabold mt-1 tracking-tight truncate ${currentStyle.value}`}>
                    {value}
                </p>
            </div>

            <div className="relative z-10">
                {variant === 'blue' ? (
                    <div className={currentStyle.pill}>
                        <ChevronUp size={14} strokeWidth={3} className="shrink-0 hidden sm:block md:hidden lg:block" />
                        <span className="truncate">{subtext}</span>
                    </div>
                ) : (
                    <p className={currentStyle.bottomText}>{subtext}</p>
                )}
            </div>

        </div>
    );
}