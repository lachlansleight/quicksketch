import { useRef } from "react";
import useElementDimensions from "lib/hooks/useElementDimensions";
import { SetImage } from "lib/types";
import QuickdrawImage from "./QuickdrawImage";

const QuickdrawGallery = ({
    images,
    index,
    padding = 14,
}: {
    images: SetImage[];
    index: number;
    padding?: number;
}): JSX.Element => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { width } = useElementDimensions(containerRef);

    return (
        <div className="w-full" ref={containerRef}>
            <QuickdrawImage
                className="w-full relative"
                image={images[index]}
                style={{
                    height: `min(${Math.round(width)}px, calc(100vh - ${padding}rem))`,
                }}
            />
        </div>
    );
};

export default QuickdrawGallery;
