'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

type Item = {
    label: string;
    description?: string;
    value: string;
}

type ValueChange = {
    selected: Item[];
    unselected: Item[];
}

interface TransferListBoxProps {
    unSelectedTitle?: string
    selectedTitle?: string
    unSelectedDescription?: string
    selectedDescription?: string
    initialValue: ValueChange
    onValueChange?: (value: ValueChange) => void
    isUnSelectedOnLoad?: boolean
}

const SkeletonItem = () => (
    <div className="p-3 m-2 *:duration-1000">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
    </div>
)

export function TransferListBox({ unSelectedTitle = "Unselected Items", selectedTitle = "Selected Items", unSelectedDescription = "Items available for selection", selectedDescription = "Items currently selected", initialValue, onValueChange, isUnSelectedOnLoad = false }: TransferListBoxProps) {
    const [unselectedItems, setUnselectedItems] = useState<Item[]>(initialValue.unselected)
    const [selectedItems, setSelectedItems] = useState<Item[]>(initialValue.selected)
    const [selectedUnselectedItems, setSelectedUnselectedItems] = useState<Item[]>([])
    const [selectedSelectedItems, setSelectedSelectedItems] = useState<Item[]>([])
    const [isLeftAlertOpen, setIsLeftAlertOpen] = useState(false)
    const [isRightAlertOpen, setIsRightAlertOpen] = useState(false)

    useEffect(() => {
        setUnselectedItems(initialValue.unselected);
        setSelectedItems(initialValue.selected);
        setSelectedUnselectedItems([]);
        setSelectedSelectedItems([]);
    }, [initialValue])

    const moveToRight = () => {
        if (selectedUnselectedItems.length > 0) {
            setSelectedItems(prev => [...prev, ...selectedUnselectedItems])
            setUnselectedItems(prev => prev.filter(item => !selectedUnselectedItems.includes(item)))
            setSelectedUnselectedItems([])
        }
    }

    const moveToLeft = () => {
        if (selectedSelectedItems.length > 0) {
            setUnselectedItems(prev => [...prev, ...selectedSelectedItems])
            setSelectedItems(prev => prev.filter(item => !selectedSelectedItems.includes(item)))
            setSelectedSelectedItems([])
        }
    }

    const moveAllToRight = () => {
        setSelectedItems(prev => [...prev, ...unselectedItems])
        setUnselectedItems([])
        setSelectedUnselectedItems([])
        setIsRightAlertOpen(false)
    }

    const moveAllToLeft = () => {
        setUnselectedItems(prev => [...prev, ...selectedItems])
        setSelectedItems([])
        setSelectedSelectedItems([])
        setIsLeftAlertOpen(false)
    }

    const toggleItemSelection = (item: Item, list: 'unselected' | 'selected') => {
        if (list === 'unselected') {
            setSelectedUnselectedItems(prev =>
                prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
            )
        } else {
            setSelectedSelectedItems(prev =>
                prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
            )
        }
    }

    useEffect(() => {
        if (onValueChange) {
            if (onValueChange) {
                const newValue = { selected: selectedItems, unselected: unselectedItems }
                onValueChange(newValue)
            }
        }
    }, [ selectedItems, unselectedItems ]);

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 py-6 rounded-sm shadow-lg min-w-max">
                <Card className="w-full md:min-w-[26rem] max-w-md my-card !border-[1.5px]">
                    <CardHeader>
                        <CardTitle>{ unSelectedTitle }</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">Jumlah Soal belum dipilih : { unselectedItems.length }</p>
                        <CardDescription>{ unSelectedDescription }</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] w-full rounded-md border">
                        {isUnSelectedOnLoad ? (
                                Array(5).fill(0).map((_, index) => <SkeletonItem key={index} />)
                            ) : (
                                unselectedItems.map(item => (
                                    <div
                                        key={item.value}
                                        className={`cursor-pointer p-3 m-2 rounded-md transition-colors ${selectedUnselectedItems.includes(item) ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                                        onClick={() => toggleItemSelection(item, 'unselected')}
                                    >
                                        <p className="line-clamp-3 text-ellipsis">{item.label}</p>
                                        {item.description && (
                                            <div className={`text-sm line-clamp-1 text-ellipsis ${selectedUnselectedItems.includes(item) ? 'text-white' : 'text-muted-foreground/90'}`}>
                                                {item.description}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
                <div className="flex md:flex-col justify-center space-y-0 space-x-4 md:space-x-0 md:space-y-4">
                    <Button onClick={moveToRight} disabled={isUnSelectedOnLoad || selectedUnselectedItems.length === 0} className="w-12 h-12">
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                    <Button onClick={moveToLeft} disabled={isUnSelectedOnLoad || selectedSelectedItems.length === 0} className="w-12 h-12">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <AlertDialog open={isRightAlertOpen} onOpenChange={setIsRightAlertOpen}>
                        <AlertDialogTrigger asChild>
                            <Button
                                onClick={() => setIsRightAlertOpen(true)}
                                disabled={isUnSelectedOnLoad || unselectedItems.length === 0}
                                className="w-12 h-12"
                            >
                                <ChevronsRight className="h-6 w-6" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Pindahkan semua ke bagian kanan?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Aksi ini akan memindahkan semua pilihan ke bagian yang dipilih. Apakah anda yakin?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setIsRightAlertOpen(false)}>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={moveAllToRight}>Lanjutkan</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog open={isLeftAlertOpen} onOpenChange={setIsLeftAlertOpen}>
                        <AlertDialogTrigger asChild>
                            <Button
                                onClick={() => setIsLeftAlertOpen(true)}
                                disabled={isUnSelectedOnLoad || selectedItems.length === 0}
                                className="w-12 h-12"
                            >
                                <ChevronsLeft className="h-6 w-6" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Pindahkan semua ke bagian kiri?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Aksi ini akan memindahkan semua pilihan ke bagian yang tidak dipilih. Apakah anda yakin?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setIsLeftAlertOpen(false)}>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={moveAllToLeft}>Lanjutkan</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <Card className="w-full md:min-w-[26rem] max-w-md my-card !border-[1.5px]">
                    <CardHeader>
                        <CardTitle>{selectedTitle}</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">Jumlah Soal dipilih : { selectedItems.length }</p>
                        <CardDescription>{selectedDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] w-full rounded-md border">
                            {selectedItems.map(item => (
                                <div
                                    key={item.value}
                                    className={`cursor-pointer p-3 m-2 rounded-md transition-colors ${selectedSelectedItems.includes(item) ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                                    onClick={() => toggleItemSelection(item, 'selected')}
                                >
                                    <p className="line-clamp-3 text-ellipsis">{ item.label }</p>
                                    { item.description && (
                                        <p className={`text-sm line-clamp-1 text-ellipsis ${selectedSelectedItems.includes(item) ? 'text-white' : 'text-muted-foreground/90'}`}>
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
