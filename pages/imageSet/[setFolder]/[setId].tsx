/* eslint-disable import/order */

import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ImageSet } from "lib/types";
import { getImageSet } from "pages/api/imageSet/[setFolder]/[setId]";
import Layout from "components/layout/Layout";
import Link from "next/link";
import { useState } from "react";
import QuickdrawGallery from "components/QuickdrawGallery";

const SetPage = ({ imageSet }: { imageSet: ImageSet }): JSX.Element => {
    const [galleryIndex, setGalleryIndex] = useState(-1);

    return (
        <Layout>
            <div className="flex flex-col gap-2">
                <Link href="/explore">
                    <a className="text-lg border w-48 rounded px-2 py-1 text-center">
                        Back to Explore
                    </a>
                </Link>
                <h1 className="text-4xl">Image Set {imageSet.id}</h1>
                <div className="flex flex-wrap gap-2">
                    {Object.keys(imageSet.tags).map(category => {
                        return imageSet.tags[category].map(tag => (
                            <Link
                                key={`${imageSet.id}_${category}/${tag}`}
                                href={`/explore?category=${category}&tag=${tag}`}
                            >
                                <a className="bg-blue-500 bg-opacity-30 rounded px-0.5">
                                    {category}/{tag}
                                </a>
                            </Link>
                        ));
                    })}
                </div>
                {galleryIndex >= 0 ? (
                    <div className="flex flex-col gap-4">
                        <QuickdrawGallery
                            images={imageSet.images?.map(i => ({ set: imageSet, url: i })) || []}
                            index={galleryIndex}
                            padding={24}
                        />
                        <div className="flex justify-center gap-4 text-lg">
                            <button
                                className={`${
                                    galleryIndex === 0
                                        ? "bg-gray-700 text-opacity-50 text-white"
                                        : "bg-transparent"
                                } border w-48 rounded px-2 py-1`}
                                onClick={() => setGalleryIndex(cur => cur - 1)}
                                disabled={galleryIndex === 0}
                            >
                                Previous
                            </button>
                            <button
                                className={`border w-48 rounded px-2 py-1`}
                                onClick={() => setGalleryIndex(-1)}
                            >
                                Show All Images
                            </button>
                            <button
                                className={`${
                                    galleryIndex === (imageSet.images?.length || 0) - 1
                                        ? "bg-gray-700 text-opacity-50 text-white"
                                        : "bg-transparent"
                                } border w-48 rounded px-2 py-1`}
                                disabled={galleryIndex === (imageSet.images?.length || 0) - 1}
                                onClick={() => setGalleryIndex(cur => cur + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : (
                    imageSet.images && (
                        <div className="grid grid-cols-6 gap-2">
                            {imageSet.images.map((image, index) => (
                                <div
                                    key={image}
                                    className="h-72 grid place-items-center border rounded border-white border-opacity-20"
                                    onClick={() => setGalleryIndex(index)}
                                >
                                    <img
                                        className="h-72 grid place-items-center object-contain"
                                        key={image}
                                        src={image}
                                    />
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </Layout>
    );
};

export default SetPage;
export async function getServerSideProps(
    ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ imageSet: ImageSet }>> {
    const imageSet = await getImageSet(Number(ctx.query.setId as string), String(ctx.query.setFolder));
    if (!imageSet) return { notFound: true };
    return {
        props: { imageSet },
    };
}
