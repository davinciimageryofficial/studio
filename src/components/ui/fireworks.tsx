
"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Fireworks() {
    const [fireworks, setFireworks] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                const newFirework = {
                    id: Date.now() + Math.random(),
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    hue: Math.random() * 360,
                };
                setFireworks(fw => [...fw, newFirework]);

                setTimeout(() => {
                    setFireworks(fw => fw.filter(f => f.id !== newFirework.id));
                }, 2000);
            }
        }, 800); // Launch a new firework every 800ms

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
