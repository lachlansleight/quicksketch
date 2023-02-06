import metadataJson from "./quickSketchFullMetadata.json";
import { ImageSet, Metadata } from "./types";

const metadata: Metadata = metadataJson as any;
export const getFilteredMetadata = (
    requireCategory: string,
    requireTag: string,
    imageCount?: number
): Metadata => {
    if (!requireCategory && !requireTag) return metadata;
    const filteredSets: ImageSet[] = metadata.imageSets.filter(set => {
        if (!Object.keys(set.tags).includes(requireCategory)) return false;
        if (!set.tags[requireCategory].includes(requireTag)) return false;
        return true;
    });
    const newTagCounts: Record<string, number> = {};
    filteredSets.forEach(set => {
        Object.keys(set.tags).forEach(category => {
            set.tags[category].forEach(tag => {
                const combined = category + "/" + tag;
                if (!newTagCounts[combined]) newTagCounts[combined] = 0;
                newTagCounts[combined]++;
            });
        });
    });
    const folders = filteredSets.reduce((acc, set) => {
        if (!acc.includes(set.folder)) acc.push(set.folder);
        return acc;
    }, [] as string[]);
    const filteredMetadata: Metadata = {
        folders,
        imageCount: filteredSets.reduce((acc, cur) => acc + cur.imageCount, 0),
        imageSets: filteredSets.map(imageSet => {
            if (!imageCount) return imageSet;
            return {
                ...imageSet,
                images: imageSet.images?.slice(0, imageCount) || [],
            };
        }),
        setCount: filteredSets.length,
        tagCount: filteredSets.reduce((acc, cur) => acc + Object.keys(cur.tags).length, 0),
        tagCounts: newTagCounts,
    };

    return filteredMetadata;
};

export default metadata;
