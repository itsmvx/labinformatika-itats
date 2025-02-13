import { useState, useEffect, useCallback, useMemo } from 'react'

export function useTypewriter(
    paragraphs: string[],
    speed: number,
    pauseBetweenParagraphs: number
) {
    const [displayText, setDisplayText] = useState<string[]>([])
    const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0)
    const [currentCharIndex, setCurrentCharIndex] = useState(0)

    const isTypingComplete = useMemo(() => {
        return currentParagraphIndex === paragraphs.length
    }, [currentParagraphIndex, paragraphs.length])

    const typeNextCharacter = useCallback(() => {
        if (currentParagraphIndex < paragraphs.length) {
            const currentParagraph = paragraphs[currentParagraphIndex]

            if (currentCharIndex < currentParagraph.length) {
                setDisplayText(prev => {
                    const newText = [...prev]
                    if (!newText[currentParagraphIndex]) {
                        newText[currentParagraphIndex] = ''
                    }
                    newText[currentParagraphIndex] += currentParagraph[currentCharIndex]
                    return newText
                })
                setCurrentCharIndex(prev => prev + 1)
            } else {
                setCurrentParagraphIndex(prev => prev + 1)
                setCurrentCharIndex(0)
            }
        }
    }, [currentParagraphIndex, currentCharIndex, paragraphs])

    useEffect(() => {
        if (!isTypingComplete) {
            const timer = setTimeout(() => {
                typeNextCharacter()
            }, currentCharIndex === 0 && currentParagraphIndex > 0 ? pauseBetweenParagraphs : speed)

            return () => clearTimeout(timer)
        }
    }, [currentParagraphIndex, currentCharIndex, isTypingComplete, pauseBetweenParagraphs, speed, typeNextCharacter])

    return { displayText, currentParagraphIndex, isTypingComplete }
}
