import path from "path";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import cachedMetadata from "lib/cachedMetadata";
import { ImageSet, SetImage } from "../../lib/types";
import { getMetadata } from "./generateMetadata";

const filterImageSet = (
    setTags: { [key: string]: string[] },
    include: { [key: string]: string[] },
    exclude: { [key: string]: string[] },
    includeKeys: string[],
    excludeKeys: string[]
): boolean => {
    if (includeKeys.length === 0 && excludeKeys.length === 0) return true;

    const tagKeys = Object.keys(setTags);
    for (let i = 0; i < includeKeys.length; i++) {
        if (!tagKeys.includes(includeKeys[i])) return false;

        for (let j = 0; j < include[includeKeys[i]].length; j++) {
            if (!setTags[includeKeys[i]].includes(include[includeKeys[i]][j])) return false;
        }
    }
    for (let i = 0; i < excludeKeys.length; i++) {
        if (!tagKeys.includes(excludeKeys[i])) continue;

        for (let j = 0; j < exclude[excludeKeys[i]].length; j++) {
            if (setTags[excludeKeys[i]].includes(exclude[excludeKeys[i]][j])) return false;
        }
    }

    return true;
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    let statusCode = 200;

    try {
        if (req.method === "POST") {
            const { count = 10, include, exclude } = req.body;
            const includeFilterKeys = !include ? [] : Object.keys(include);
            const excludeFilterKeys = !exclude ? [] : Object.keys(exclude);

            const metadata = process.env.NEXT_PUBLIC_NO_CACHE ? cachedMetadata : getMetadata();
            console.log("Filtering " + metadata.imageSets.length + " sets...");
            const imageSets: ImageSet[] = metadata.imageSets.filter(set => {
                return filterImageSet(
                    set.tags,
                    include,
                    exclude,
                    includeFilterKeys,
                    excludeFilterKeys
                );
            });
            imageSets.sort(() => Math.random() - 0.5);
            console.log("Choosing " + count + " sets from " + imageSets.length + " candidates...");

            //choose ten random sets and place in new array
            const chosenSetImages: SetImage[] = imageSets.slice(0, count).map(set => {
                const files = fs.readdirSync(
                    path.join(process.env.FILE_PATH as string, set.folder, set.id.toString())
                );
                const chosenUrl = files[Math.floor(Math.random() * files.length)];
                const setImage: SetImage = {
                    url: `${process.env.NEXT_PUBLIC_LOCAL_PATH}${set.folder}/${
                        set.id
                    }/${chosenUrl.replace(/\\/g, "/")}`,
                    set,
                };
                return setImage;
            });
            console.log(
                "Chosen images:",
                chosenSetImages.map(
                    img =>
                        img.set.folder +
                        "/" +
                        img.set.id +
                        "/" +
                        img.url.split("/").slice(-1)[0].split("_")[0]
                )
            );

            res.status(200).json({ chosenSetImages });
        } else {
            statusCode = 405;
            throw new Error(`${req.method} not supported for /getImages`);
        }
    } catch (error: any) {
        console.error(`Failed to ${req.method} getImages`, error.message);
        res.status(statusCode).json({ success: false, error: error.message });
    }
};
