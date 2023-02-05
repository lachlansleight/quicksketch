import path from "path";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { transformTagArray } from "lib/tagMapping";
import { ImageSet, Metadata } from "lib/types";
import { getSetImages } from "./imageSet/[setFolder]/[setId]";

const getMetadataFromFolder = (
    folder: string,
    requireCategory?: string,
    requireTag?: string
): Metadata => {
    const localPath = path.join(path.resolve(process.env.FILE_PATH as string), folder);
    const ids = fs
        .readdirSync(localPath)
        .map(s => Number(s))
        .filter(n => !isNaN(n));
    const folders = ids.map(f => path.join(localPath, f.toString()));
    const tags = folders.map(f => {
        try {
            const files = fs.readdirSync(f);
            let tagFile = files.find(fn => fn.substring(0, 4) === "TAGS");
            if(!tagFile) tagFile = files[0];
            else tagFile = tagFile.split(".")[0];
            return tagFile.split("_")[1].split("-");
        } catch (e: any) {
            return [];
        }
    });

    const mappedTags = tags.map(transformTagArray);
    const finalTags: { [key: number]: Record<string, string[]> } = {};
    for (let i = 0; i < ids.length; i++) {
        finalTags[ids[i]] = mappedTags[i];
    }

    const imageSets: ImageSet[] = [];
    const tagCounts: { [tag: string]: number } = {};

    for (let i = 0; i < ids.length; i++) {
        const id = Number(ids[i]);
        const tags = finalTags[id];
        if (requireCategory && requireTag) {
            if (!tags[requireCategory]?.includes(requireTag)) continue;
        }
        const imageCount = fs.readdirSync(path.join(localPath, id.toString())).length;
        imageSets.push({
            id,
            imageCount,
            tags,
            folder,
            images: getSetImages(id, folder),
        });
        Object.keys(finalTags[id]).forEach(tagType => {
            finalTags[id][tagType].forEach(tag => {
                const compositeTag = `${tagType}/${tag}`;
                if (tagCounts[compositeTag] == null) tagCounts[compositeTag] = 0;
                tagCounts[compositeTag]++;
            });
        });
    }

    return {
        folders: [folder],
        setCount: imageSets.length,
        tagCount: Object.keys(tagCounts).length,
        imageCount: imageSets.reduce((acc, set) => acc + set.imageCount, 0),
        tagCounts,
        imageSets,
    };
};

export const getMetadata = (requireCategory?: string, requireTag?: string, imageCount?: number): Metadata => {

    const folders = fs.readdirSync(process.env.FILE_PATH as string).filter(f => !f.includes("."));
    const subMetadatas = folders.map(f => {
        return getMetadataFromFolder(f, requireCategory, requireTag);
    });

    //combine tags of all three folders
    let combinedTags: Record<string, number> = {};
    subMetadatas.forEach(subMetadata => {
        Object.keys(subMetadata.tagCounts).forEach(tag => {
            if (combinedTags[tag] == null) combinedTags[tag] = 0;
            combinedTags[tag] += subMetadata.tagCounts[tag];
        });
    });

    //sort tagCounts by count
    const sortedTagCounts = Object.keys(combinedTags)
        .sort((a, b) => combinedTags[b] - combinedTags[a])
        .map(key => ({ key, count: combinedTags[key] }));
    combinedTags = {};
    sortedTagCounts.forEach(t => {
        combinedTags[t.key] = t.count;
    });

    const combinedMetadata: Metadata = {
        folders: subMetadatas.reduce((acc, subMetadata) => acc.concat(subMetadata.folders), [] as string[]),
        setCount: subMetadatas.reduce((acc, subMetadata) => acc + subMetadata.setCount, 0),
        tagCount: Object.keys(combinedTags).length,
        imageCount: subMetadatas.reduce((acc, subMetadata) => acc + subMetadata.imageCount, 0),
        tagCounts: combinedTags,
        imageSets: subMetadatas.reduce((acc, subMetadata) => acc.concat(subMetadata.imageSets), [] as ImageSet[]).map(imageSet => {
            if(!imageCount) return imageSet;
            return {
                ...imageSet,
                images: imageSet.images?.slice(0, imageCount) || []
            }
        }),
    };
    return combinedMetadata;
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    let statusCode = 200;

    try {
        if (req.method === "GET") {
            const metadata = getMetadata();
            fs.writeFileSync(path.join((process.env.FILE_PATH as string).replace("public/", "lib/"), "quickSketchFullMetadata.json"), JSON.stringify(metadata));
            res.status(200).json(metadata);
        } else {
            statusCode = 405;
            throw new Error(`${req.method} not supported for /generateMetadata`);
        }
    } catch (error: any) {
        console.error(`Failed to ${req.method} generateMetadata`, error.message);
        res.status(statusCode).json({ success: false, error: error.message });
    }
};
