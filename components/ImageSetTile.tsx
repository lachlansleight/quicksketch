import Link from "next/link";
import { useState } from "react";
import { ImageSet } from "lib/types";

const ImageSetTile = ({ imageSet }: { imageSet: ImageSet }): JSX.Element => {
    const [hovering, setHovering] = useState(false);

    return (
        <Link href={`/imageSet/${imageSet.folder}/${imageSet.id}`}>
            <a
                className="flex flex-col border rounded border-white border-opacity-20 p-1"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                <div className="flex flex-col">
                    <h2 className="text-lg h-5 relative -top-2">Set {imageSet.id}</h2>
                    <p className="text-[1rem] h-3 italic text-white text-opacity-60 relative -top-2">
                        {imageSet.imageCount} images
                    </p>
                </div>
                <div className="h-36">
                    {hovering ? (
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(imageSet.tags).map(category => {
                                return imageSet.tags[category].map(tag => (
                                    <p
                                        key={`${imageSet.id}_${category}/${tag}`}
                                        className="bg-blue-500 bg-opacity-30 rounded px-0.5"
                                    >
                                        {category}/{tag}
                                    </p>
                                ));
                            })}
                        </div>
                    ) : (
                        <div className="h-full w-full grid place-items-center">
                            {imageSet.images &&
                            !(imageSet.tags["photo-technology"]?.includes("high-res") || false) ? (
                                <img className="object-contain h-36" src={imageSet.images[0]} />
                            ) : (
                                <div className="object-contain h-36" />
                            )}
                        </div>
                    )}
                </div>
            </a>
        </Link>
    );
};

export default ImageSetTile;
