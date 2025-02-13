import type { Delta } from "quill";
import { parse as dateParse } from "date-fns/parse";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale/id";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import parse from "html-react-parser";

export const deltaParse = (data: string): Delta => {
    try {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.ops)) {
            return parsed as Delta;
        }
    } catch (error) {
        console.warn("Invalid Delta format");
    }
    return { ops: [{ insert: "\n" }] } as Delta;
};
export const parseSesiTime = (time: string, currentDate: string | Date): string => {
    const date = dateParse(time, 'HH:mm:ss', new Date(currentDate));
    return format(date, 'HH:mm', {
        locale: localeId
    });
};

export const RenderQuillDelta = ({ delta, imgWidth = 32, className }: {
    delta: Delta;
    imgWidth?: number;
    className?: string;
}) => {
    const ops = Array.isArray(delta.ops) ? delta.ops : [];
    const converter = new QuillDeltaToHtmlConverter(ops, {
        paragraphTag: 'p',
        encodeHtml: false,
        multiLineParagraph: true,
    });
    const htmlContent: string = converter.convert();
    return (
        <>
            <div className={ `flex flex-col items-center justify-center *:*:w-${imgWidth} ${className as string} *:[&_ol]:list-decimal *:[&_ol]:list-inside` }>
                {parse(htmlContent)}
            </div>
        </>
    );
};
