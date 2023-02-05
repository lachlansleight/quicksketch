export enum GenderType {
    woman,
    man,
    dog,
}

export enum AgeType {
    adult,
    young,
    teenager,
    old,
}

export enum BodyType {
    chubby,
    athletic,
    average,
    muscular,
    overweight,
    pregnant,
    slim,
    underweight,
}

export enum HairType {
    bald,
    dreadlocks,
    long,
    medium,
    short,
}

export enum HairColorType {
    black,
    blond,
    brown,
    colored,
    grey,
    red,
}

export enum RaceType {
    asian,
    black,
    multiracial,
    white,
    latino,
}

export enum PoseType {
    "daily-activities",
    "martial-art",
    "fighting",
    "fighting-with-axe",
    "fighting-with-gun",
    "fighting-with-knife",
    "fighting-with-rifle",
    "fighting-with-spear",
    "fighting-with-sword",
    "fighting-with-submachine-gun",
    "fighting-with-bat",
    "fighting-with-shotgun",
    "fighting-with-pistol",
    "kungfu",
    "kickbox",
    "holding",
    "gymnastic-poses",
    "yoga-poses",
    "capoeira",
    "breakdance",
    "ninja",
    "africandance",
    "execution",
    "tied-up",
    "crawling",
    "stretching-out",
    "dancing",
    "shooting",
    "falling",
    "fist-fight",
    "poledance",
    "aiming",
    "attack",
    "fitness",
    "jumping",
    "moderndance",
}

export enum PoseCategoryType {
    "detailed-photos",
    "kneeling",
    "laying",
    "on-back",
    "on-side",
    "on-stomach",
    "moving-poses",
    "perspective-distortion",
    "sitting",
    "standing",
    "bend-over",
    "knee-bend",
    "facial-expressions",
    "hand",
    "nsfw",
}

export enum ClothesType {
    business,
    casual,
    drape,
    nude,
    sportswear,
    swimsuit,
    underwear,
    steampunk,
    christmas,
    prehistoric,
    pants,
    army,
    coat,
    medieval,
}

export enum GroupType {
    duo,
    trio,
}

export enum HeldObjectType {
    "smartphone",
    "pistol",
    "gun",
    "sword",
    "katana",
    "revolver",
    "rifle",
    "lightsaber",
    "dagger",
}

export enum PhotoTechnologyType {
    "hyper-angle",
    "multi-angle",
    "dynamic",
    "3D-stereoscopic",
    "standard-photoshoot",
    "video",
    "high-res",
}

export const enumMapping: Record<string, string[]> = {
    gender: Object.keys(GenderType).slice(Object.keys(GenderType).length / 2),
    age: Object.keys(AgeType).slice(Object.keys(AgeType).length / 2),
    "body-type": Object.keys(BodyType).slice(Object.keys(BodyType).length / 2),
    hair: Object.keys(HairType).slice(Object.keys(HairType).length / 2),
    "hair-color": Object.keys(HairColorType).slice(Object.keys(HairColorType).length / 2),
    race: Object.keys(RaceType).slice(Object.keys(RaceType).length / 2),
    pose: Object.keys(PoseType).slice(Object.keys(PoseType).length / 2),
    "pose-category": Object.keys(PoseCategoryType).slice(Object.keys(PoseCategoryType).length / 2),
    clothes: Object.keys(ClothesType).slice(Object.keys(ClothesType).length / 2),
    "group-type": Object.keys(GroupType).slice(Object.keys(GroupType).length / 2),
    holding: Object.keys(HeldObjectType).slice(Object.keys(HeldObjectType).length / 2),
    "photo-technology": Object.keys(PhotoTechnologyType).slice(
        Object.keys(PhotoTechnologyType).length / 2
    ),
};
