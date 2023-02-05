import { CSSProperties, useState } from "react";
import Link from "next/link";
import { FaMinus, FaPlus } from "react-icons/fa";
import { SetImage } from "lib/types";

const QuickdrawImage = ({
    image,
    className = "",
    style = {},
}: {
    image: SetImage;
    className?: string;
    style?: CSSProperties;
}): JSX.Element => {
    const [infoExpanded, setInfoExpanded] = useState(false);

    if (!image) return <div className={className} style={style} />;

    return (
        <div className={className} style={style}>
            <img src={image.url} className={`object-contain ${className}`} style={style} />
            {infoExpanded && (
                <div
                    className={`absolute left-0 top-[1.95rem] bg-neutral-800 p-2 border border-white rounded rounded-tl-none ${
                        infoExpanded ? "w-96" : ""
                    } flex flex-col gap-2`}
                >
                    <div className="flex justify-between items-end">
                        <h2 className="text-lg m-0">
                            Set {image.set.id} -{" "}
                            {(image.set.images?.findIndex(i => i === image.url) || -1) + 1} /{" "}
                            {image.set.images?.length || 0}
                        </h2>
                        <Link href={`/imageSet/${image.set.folder}/${image.set.id}`}>
                            <a className="underline">View Set</a>
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(image.set.tags).map(category => {
                            return image.set.tags[category].map(tag => (
                                <p
                                    key={`${image.set.id}_${category}/${tag}`}
                                    className="bg-blue-500 bg-opacity-30 rounded px-0.5"
                                >
                                    {category}/{tag}
                                </p>
                            ));
                        })}
                    </div>
                </div>
            )}
            <button
                className={`absolute left-0 top-0 bg-neutral-800 border border-white rounded w-8 h-8 grid place-items-center ${
                    infoExpanded ? "rounded-bl-none rounded-br-none border-b-0" : ""
                }`}
                onClick={() => setInfoExpanded(cur => !cur)}
            >
                {infoExpanded ? <FaMinus /> : <FaPlus />}
            </button>
        </div>
    );
};

export default QuickdrawImage;
