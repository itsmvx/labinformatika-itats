import type { Delta } from "quill";
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
export const RenderQuillDelta = ({ delta, imgWidth = 32, className }: {
    delta: Delta;
    imgWidth?: number;
    className?: string;
}) => {
    const ops = Array.isArray(delta.ops) ? delta.ops : [];
    const converter = new QuillDeltaToHtmlConverter(ops, {
        paragraphTag: 'div',
        encodeHtml: false,
        multiLineParagraph: true,
    });
    const htmlContent: string = converter.convert();
    return (
        <>
            <div className={ `flex flex-col items-center justify-center *:*:w-${imgWidth} ${className ?? ''} *:[&_ol]:list-decimal *:[&_ol]:list-inside *:[&_a]:text-blue-600 *:[&_a]:font-medium` }>
                {parse(htmlContent)}
            </div>
        </>
    );
};
