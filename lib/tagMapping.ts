import {
    AgeType,
    BodyType,
    ClothesType,
    GenderType,
    HairColorType,
    HairType,
    PhotoTechnologyType,
    PoseCategoryType,
    PoseType,
    RaceType,
    GroupType,
    HeldObjectType,
} from "./enums";

export const tryJoinTags = (tags: string[]): string[] => {
    const mergeTag = (currentTags: string[], mergedTag: string): string[] => {
        const tagPieces = mergedTag.split("-");
        const contains = tagPieces.reduce((cur, tag) => {
            return cur && currentTags.includes(tag);
        }, true);
        if (!contains) return currentTags;

        return [mergedTag, ...currentTags.filter(t => !tagPieces.includes(t))];
    };
    const deduplicateTags = (currentTags: string[], duplicates: string[]): string[] => {
        let firstIndex = -1;
        for (let i = 0; i < currentTags.length; i++) {
            if (duplicates.includes(currentTags[i])) {
                firstIndex = i;
                break;
            }
        }
        if (firstIndex === -1) return currentTags;
        currentTags = currentTags.filter(t => !duplicates.includes(t));
        currentTags.splice(firstIndex, 0, duplicates[0]);
        return currentTags;
    };

    let newTags = [...tags];

    //merge pose with poses
    newTags = newTags.map(t => (t === "pose" ? "poses" : t));

    //fix typo
    newTags = newTags.map(t => (t === "sterescopic" ? "stereoscopic" : t));

    const mergedTags = [
        "daily-activities",
        "martial-art",
        "gymnastic-poses",
        "yoga-poses",
        "detailed-photos",
        "kneeling-poses-all",
        "kneeling-poses-casual",
        "kneeling-poses",
        "on-both-knees",
        "on-one-knee",
        "laying-poses-all",
        "laying-poses-casual",
        "laying-poses",
        "ninja-crawling",
        "romance-pose",
        "on-back",
        "on-side",
        "on-stomach",
        "moving-poses",
        "perspective-distortion",
        "sitting-poses-all",
        "sitting-poses-casual",
        "sitting-poses",
        "sitting",
        "on-knees",
        "on-both-knees",
        "standing-poses-casual",
        "standing-poses-all",
        "standing-poses",
        "standing",
        "bend-over",
        "knee-bend",
        "hyper-angle-poses",
        "hyper-angle",
        "multi-angle-poses",
        "multi-angles-poses",
        "multi-angle",
        "multi-angles",
        "dynamic-poses",
        "3D-stereoscopic-poses",
        "3D-stereoscopic",
        "standard-photoshoot",
        "standing-poses-casual",
        "keeta-babyfreeze",
        "facial-expressions",
        "facial-expression",
        "little-caprice",
        "poses-standing",
        "chrissy-fox",
        "poses-of",
        "hand-male-poses",
        "hand-female-poses",
        "hand",
        "tied-up",
        "fist-fight",
        "kick-fight",
        "kicking-and-stomping",
        "karate-triple-kick",
        "air-front-kick",
        "aiming-gun",
        "aiming-guns",
        "fighting-without-gun",
        "high-res",
    ];
    mergedTags.forEach(tag => {
        newTags = mergeTag(newTags, tag);
    });

    //merge fighting-with-X
    const fightingIndex = newTags.findIndex(f => f === "fighting");
    if (fightingIndex >= 0 && newTags.length > fightingIndex + 2) {
        if (newTags[fightingIndex + 1] === "with") {
            const finalPart = newTags[fightingIndex + 2];
            if (finalPart === "submachine" && newTags.length > fightingIndex + 3) {
                const finalFinalPart = newTags[fightingIndex + 3];
                newTags = [
                    `fighting-with-${finalPart}-${finalFinalPart}`,
                    ...newTags.filter(
                        t =>
                            t !== "fighting" &&
                            t !== "with" &&
                            t !== finalPart &&
                            t !== finalFinalPart
                    ),
                ];
            } else {
                newTags = [
                    `fighting-with-${finalPart}`,
                    ...newTags.filter(t => t !== "fighting" && t !== "with" && t !== finalPart),
                ];
            }
        }
    }

    //replace "stereoscopic" with "3D-stereoscopic"
    if (newTags.includes("stereoscopic")) {
        if (newTags.includes("3D-stereoscopic"))
            newTags = newTags.filter(t => t !== "stereoscopic");
        else {
            const index = newTags.findIndex(t => t === "stereoscopic");
            newTags[index] = "3D-stereoscopic";
        }
    }

    const purgedTags = [
        "simple",
        "reference",
        "various",
        "jpg",
        "oldwoman",
        "oldman",
        "poses-of",
        "neutral",
        "requested",
        "smax",
        "dual",
        "with",
        "another",
    ];
    newTags = newTags.filter(t => !purgedTags.includes(t));

    //combine synonym tags (first index = the one that is kept in the case of duplicates)
    const deduplicates = [
        ["multi-angle", "multi-angles", "multi-angle-poses", "multi-angles-poses"],
        ["hyper-angle", "hyper-angle-poses"],
        ["3D-stereoscopic", "3D-stereoscopic-poses"],
        ["dancing", "dance"],
        ["aiming", "aiming-gun", "aiming-guns"],
        ["duo", "couple", "fighters"],
        [
            "fighting",
            "punch",
            "kick",
            "air-front-kick",
            "karate-triple-kick",
            "kick-fight",
            "kicking-and-stomping",
            "fight",
            "fighting-without-gun",
        ],
        ["woman", "women", "female", "females"],
        ["man", "men", "male", "males"],
        ["standing-poses-all", "poses-standing"],
        [
            "kneeling",
            "kneeling-poses",
            "kneeling-poses-all",
            "kneeling-poses-casual",
            "on-knees",
            "on-one-knee",
            "on-both-knees",
        ],
        ["standing", "standing-poses-all", "standing-poses-casual", "standing-poses"],
        ["sitting", "sitting-poses", "sitting-poses-all", "sitting-poses-casual"],
        ["laying", "laying-poses", "laying-poses-all", "laying-poses-casual"],
        ["crawling", "ninja-crawl"],
        ["hand", "hand-male-poses", "hand-female-poses"],
        ["dynamic", "dynamic-poses", "moving"],
        ["fighting-with-gun", "fighting-with-submachine-gun"],
        ["facial-expressions", "fe", "facial-expression"],
        ["blond", "blonde"],
        ["pistol", "pistols"],
        ["gun", "guns"],
        ["hand", "hands"],
        ["jumping", "jump"],
        ["christmas", "xmas"],
        ["muscular", "bodybuilder"],
        ["africandance", "africandancehr"],
    ];
    for (let i = 0; i < deduplicates.length; i++) {
        newTags = deduplicateTags(newTags, deduplicates[i]);
    }

    return newTags;
};

const tryMapTag = (
    tag: string,
    enumType: { [key: number]: string },
    label: string
): string | null => {
    for (const enumOption in Object.keys(enumType)) {
        if (tag === enumType[enumOption]) return label;
    }
    return null;
};

export const getTagKey = (tag: string, exclude: string[]): string => {
    return (
        (!exclude.includes("gender") && tryMapTag(tag, Object.keys(GenderType), "gender")) ||
        (!exclude.includes("age") && tryMapTag(tag, Object.keys(AgeType), "age")) ||
        (!exclude.includes("body-type") && tryMapTag(tag, Object.keys(BodyType), "body-type")) ||
        (!exclude.includes("hair") && tryMapTag(tag, Object.keys(HairType), "hair")) ||
        (!exclude.includes("hair-color") &&
            tryMapTag(tag, Object.keys(HairColorType), "hair-color")) ||
        (!exclude.includes("race") && tryMapTag(tag, Object.keys(RaceType), "race")) ||
        (!exclude.includes("pose") && tryMapTag(tag, Object.keys(PoseType), "pose")) ||
        (!exclude.includes("pose-category") &&
            tryMapTag(tag, Object.keys(PoseCategoryType), "pose-category")) ||
        (!exclude.includes("clothes") && tryMapTag(tag, Object.keys(ClothesType), "clothes")) ||
        (!exclude.includes("group-type") && tryMapTag(tag, Object.keys(GroupType), "group-type")) ||
        (!exclude.includes("holding") && tryMapTag(tag, Object.keys(HeldObjectType), "holding")) ||
        (!exclude.includes("photo-technology") &&
            tryMapTag(tag, Object.keys(PhotoTechnologyType), "photo-technology")) ||
        "other"
    );
};

export const transformTagArray = (tags: string[]): { [key: string]: string[] } => {
    const joinedTags = tryJoinTags(tags).filter(
        s => s.length > 1 && s !== "of" && s !== "all" && s !== "and"
    );
    const exclude: string[] = [];
    const tagKeys = joinedTags.map(t => getTagKey(t, exclude));

    const output: { [key: string]: string[] } = {};
    for (let i = 0; i < tagKeys.length; i++) {
        if (!output[tagKeys[i]]) output[tagKeys[i]] = [];
        output[tagKeys[i]].push(joinedTags[i]);
    }
    return output;
};
