import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Plus, Trash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type AnswerOption = {
    value: string;
    label: string;
};
export const AnswersEditor = ({ initialOptions = [], initialCorrectAnswer = "", onSelectCorrectAnswer, onOptionsChange, }: {
    initialOptions?: AnswerOption[];
    initialCorrectAnswer?: string;
    onSelectCorrectAnswer: (value: string) => void;
    onOptionsChange: (options: AnswerOption[]) => void;
}) => {
    const [options, setOptions] = useState<AnswerOption[]>(initialOptions);
    const [correctAnswer, setCorrectAnswer] = useState<string>(initialCorrectAnswer);

    useEffect(() => {
        onOptionsChange(options);
    }, [options]);

    useEffect(() => {
        if (initialCorrectAnswer && initialCorrectAnswer !== correctAnswer) {
            setCorrectAnswer(initialCorrectAnswer);
            onSelectCorrectAnswer(initialCorrectAnswer);
        }
    }, [initialCorrectAnswer, correctAnswer, onSelectCorrectAnswer]);

    const handleAddOption = () => {
        if (options.length >= 5) return;
        const nextValue = String.fromCharCode(65 + options.length);
        setOptions((prev) => [...prev, { value: nextValue, label: "" }]);
    };

    const handleUpdateOption = (index: number, label: string) => {
        setOptions((prev) =>
            prev.map((option, i) =>
                i === index ? { ...option, label } : option
            )
        );
    };

    const handleDeleteOption = (index: number) => {
        setCorrectAnswer("");
        onSelectCorrectAnswer("");
        setOptions((prev) => {
            const updatedOptions = prev.filter((_, i) => i !== index);
            return updatedOptions.map((option, i) => ({
                ...option,
                value: String.fromCharCode(65 + i),
            }));
        });
    };

    const handleSelectCorrectAnswer = (value: string) => {
        setCorrectAnswer(value);
        onSelectCorrectAnswer(value);
    };

    return (
        <Card className="w-full !rounded-none !shadow-none !border-muted-foreground/40">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Pilihan Jawaban</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 divide-y-2 *:pt-4">
                    {options.map((option, index) => (
                        <div
                            key={option.value}
                            className="flex flex-col md:flex-row items-start md:items-center gap-3"
                        >
                            <div className="w-full flex flex-row gap-2 items-center">
                                <p className="text-lg font-bold text-gray-800">
                                    {option.value}.
                                </p>
                                <Textarea
                                    value={option.label}
                                    placeholder={`Isi jawaban untuk ${option.value}`}
                                    onChange={(e) =>
                                        handleUpdateOption(index, e.target.value)
                                    }
                                    className="min-h-24"
                                />
                            </div>
                            <div className="ml-auto md:ml-0 flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant={
                                        correctAnswer === option.value
                                            ? "default"
                                            : "outline"
                                    }
                                    size="icon"
                                    onClick={() =>
                                        handleSelectCorrectAnswer(option.value)
                                    }
                                    className={
                                        correctAnswer === option.value
                                            ? "bg-green-600 hover:bg-green-600"
                                            : "bg-none"
                                    }
                                >
                                    <Key
                                        className={`h-5 w-5 ${
                                            correctAnswer === option.value
                                                ? "text-muted"
                                                : "text-muted-foreground"
                                        }`}
                                    />
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteOption(index)}
                                >
                                    <Trash className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <Button
                    type="button"
                    className="mt-5 w-full md:w-auto"
                    onClick={handleAddOption}
                    disabled={options.length >= 5}
                >
                    <Plus /> Tambah Pilihan Jawaban
                </Button>
                {options.length === 5 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                        Maksimal 5 pilihan jawaban.
                    </p>
                )}
                <p className="mt-4 text-sm">
                    Kunci Jawaban:{" "}
                    {correctAnswer ? (
                        <span className="font-medium text-blue-600">
                            {correctAnswer}
                        </span>
                    ) : (
                        <span className="italic text-muted-foreground">
                            Belum ditentukan
                        </span>
                    )}
                </p>
            </CardContent>
        </Card>
    );
};
