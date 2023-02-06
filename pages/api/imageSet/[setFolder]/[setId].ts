import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import cachedMetadata from "lib/cachedMetadata";
import { getMetadata } from "../../generateMetadata";

export const getSetImages = (id: number, folder: string) => {
    const setPath = path.join(process.env.FILE_PATH as string, folder, id.toString());
    const files = fs.readdirSync(setPath).filter(fn => fn.split(".").slice(-1)[0] === "jpg");
    return files.map(f => `${process.env.NEXT_PUBLIC_LOCAL_PATH}${folder}/${id.toString()}/${f}`);
};

export const getImageSet = async (id: number, folder: string) => {
    const metadata =
        process.env.NEXT_PUBLIC_NO_CACHE === "true" ? await getMetadata() : cachedMetadata;
    const imageSet = metadata.imageSets.find(set => set.id === id && set.folder === folder);
    if (!imageSet) return undefined;
    imageSet.images = getSetImages(id, folder);
    return imageSet;
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    let statusCode = 200;

    try {
        if (req.method === "GET") {
            const setId = Number(req.query.setId as string);
            const setFolder = String(req.query.setFolder);
            const set = await getImageSet(setId, setFolder);
            if (!set) {
                statusCode = 404;
                throw new Error("Image set " + setId + " not found");
            }
            res.status(200).json(set);
        } else {
            statusCode = 405;
            throw new Error(`${req.method} not supported for /example`);
        }
    } catch (error: any) {
        console.error(`Failed to ${req.method} example`, error.message);
        res.status(statusCode).json({ success: false, error: error.message });
    }
};
