'use client'

import React, { useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { useTypewriter } from '@/hooks/use-typewriter'

interface TypewriterProps {
    paragraphs: string[]
    speed?: number
    pauseBetweenParagraphs?: number
}

const Typewriter: React.FC<TypewriterProps> = ({ paragraphs, speed = 50, pauseBetweenParagraphs = 1000 }) => {
    const { displayText, currentParagraphIndex, isTypingComplete } = useTypewriter(
        paragraphs,
        speed,
        pauseBetweenParagraphs
    )

    const cursorStyle = useMemo(() => ({
        animation: 'blink 0.7s infinite',
        '@keyframes blink': {
            '0%': { opacity: 0 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0 },
        },
    }), [])

    return (
        <Card className="w-full max-w-2xl mx-auto mt-10">
            <CardContent className="p-6">
                <div className="font-mono text-lg space-y-4">
                    {displayText.map((paragraph, index) => (
                        <p key={index}>
                            {paragraph}
                            {index === currentParagraphIndex && !isTypingComplete && (
                                <span
                                    className="inline-block w-2 h-5 ml-1 bg-current"
                                    style={cursorStyle}
                                ></span>
                            )}
                        </p>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default React.memo(Typewriter);
