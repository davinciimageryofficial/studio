
"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Fireworks() {
    const [fireworks, setFireworks] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                const now = Date.now();
                const newFireworks = Array.from({ length: 15 }).map((_, index) => ({
                    id: `${now}-${index}`, // Combine timestamp with index for a unique key
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    hue: Math.random() * 360,
                }));
                
                setFireworks(fw => [...fw, ...newFireworks]);

                setTimeout(() => {
                    setFireworks(fw => fw.filter(f => !newFireworks.some(nf => nf.id === f.id)));
                }, 2000);
            }
        }, 1000); // Launch a burst of 15 fireworks every 1000ms (1 second)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {fireworks.map(fw => (
                <div
                    key={fw.id}
                    className="firework"
                    style={{
                        left: `${fw.x}%`,
                        top: `${fw.y}%`,
                        '--hue': fw.hue,
                    } as React.CSSProperties}
                >
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                transform: `rotate(${(i * 30)}deg)`,
                                '--delay': `${i * 0.05}s`
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
