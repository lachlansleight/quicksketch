import path from "path";
import fs from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import { transformTagArray } from "lib/tagMapping";
import { ImageSet, Metadata } from "lib/types";
import { getSetImages } from "./imageSet/[setFolder]/[setId]";

const getMetadataFromFolder = async (
    folder: string,
    requireCategory?: string,
    requireTag?: string
): Promise<Metadata> => {
    const localPath = path.join(path.resolve(process.env.FILE_PATH as string), folder);
    const folderNames = await fs.readdir(localPath);
    process.stdout.write("Getting metadata from " + folder + " - Getting tags");
    const ids = folderNames.map(s => Number(s)).filter(n => !isNaN(n));
    const folders = ids.map(f => path.join(localPath, f.toString()));
    const folderFiles = await Promise.all(folders.map(f => fs.readdir(f)));
    const tags = folderFiles.map(f => {
        try {
            let tagFile = f.find(fn => fn.substring(0, 4) === "TAGS");
            if (!tagFile) tagFile = f[0];
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
        process.stdout.write(
            "\r                                                                               \r"
        );
        process.stdout.write(
            "Getting metadata from " +
                folder +
                " - Getting images " +
                (i + 1) +
                "/" +
                ids.length +
                ""
        );
        const id = Number(ids[i]);
        const tags = finalTags[id];
        if (requireCategory && requireTag) {
            if (!tags[requireCategory]?.includes(requireTag)) continue;
        }
        const imageCount = folderFiles.length;
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
    process.stdout.write("\n");

    return {
        folders: [folder],
        setCount: imageSets.length,
        tagCount: Object.keys(tagCounts).length,
        imageCount: imageSets.reduce((acc, set) => acc + set.imageCount, 0),
        tagCounts,
        imageSets,
    };
};

export const getMetadata = async (
    requireCategory?: string,
    requireTag?: string,
    imageCount?: number
): Promise<Metadata> => {
    const folders = (await fs.readdir(process.env.FILE_PATH as string)).filter(
        f => !f.includes(".")
    );
    const subMetadatas: Metadata[] = [];
    for (let i = 0; i < folders.length; i++) {
        const newMetadata = await getMetadataFromFolder(folders[i], requireCategory, requireTag);
        subMetadatas.push(newMetadata);
    }

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
        folders: subMetadatas.reduce(
            (acc, subMetadata) => acc.concat(subMetadata.folders),
            [] as string[]
        ),
        setCount: subMetadatas.reduce((acc, subMetadata) => acc + subMetadata.setCount, 0),
        tagCount: Object.keys(combinedTags).length,
        imageCount: subMetadatas.reduce((acc, subMetadata) => acc + subMetadata.imageCount, 0),
        tagCounts: combinedTags,
        imageSets: subMetadatas
            .reduce((acc, subMetadata) => acc.concat(subMetadata.imageSets), [] as ImageSet[])
            .map(imageSet => {
                if (!imageCount) return imageSet;
                return {
                    ...imageSet,
                    images: imageSet.images?.slice(0, imageCount) || [],
                };
            }),
    };
    return combinedMetadata;
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    let statusCode = 200;

    try {
        if (req.method === "GET") {
            const metadata = await getMetadata();
            console.log("Writing metadata.json");
            await fs.writeFile(
                path.join(
                    (process.env.FILE_PATH as string).replace("public/", "lib/"),
                    "quickSketchFullMetadata.json"
                ),
                JSON.stringify(metadata)
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { imageSets, ...restMetadata } = metadata;
            res.status(200).json(restMetadata);
        } else {
            statusCode = 405;
            throw new Error(`${req.method} not supported for /generateMetadata`);
        }
    } catch (error: any) {
        console.error(`Failed to ${req.method} generateMetadata`, error.message);
        res.status(statusCode).json({ success: false, error: error.message });
    }
};
