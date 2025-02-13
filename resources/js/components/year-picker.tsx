import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type YearPickerProps = {
    value: number;
    onValueChange: (value: number) => void;
};

export const YearPicker = ({ value, onValueChange }: YearPickerProps) => {
    const years = Array.from({ length: 2077 - 1977 + 1 }, (_, index) => 1977 + index)

    return (
        <Select value={value.toString()} onValueChange={(value) => onValueChange(parseInt(value, 10))}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
