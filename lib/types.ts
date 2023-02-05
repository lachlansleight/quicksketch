export interface Metadata {
    folders: string[];
    setCount: number;
    tagCount: number;
    imageCount: number;
    tagCounts: Record<string, number>;
    imageSets: ImageSet[];
}

export interface ImageSet {
    id: number;
    imageCount: number;
    tags: Record<string, string[]>;
    folder: string;
    images?: string[];
}

export interface SetImage {
    url: string;
    set: ImageSet;
}
