import Link from "next/link";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import numeral from "numeral";
import { useState } from "react";
import Layout from "components/layout/Layout";
import { Metadata } from "lib/types";
import ImageSetTile from "components/ImageSetTile";
import ExploreTagList from "components/ExploreTagList";
import Pagination from "components/Pagination";
import { getFilteredMetadata } from "lib/cachedMetadata";
import { getMetadata } from "./api/generateMetadata";

const Explore = ({
    metadata,
    hasFilter,
}: {
    metadata: Metadata;
    hasFilter: boolean;
}): JSX.Element => {
    const [page, setPage] = useState(0);
    const imagesPerPage = 24;

    return (
        <Layout>
            <div className="flex flex-col gap-2 items-start w-full">
                <div className="flex gap-4">
                    <Link href="/">
                        <a className="text-lg border w-48 rounded px-2 py-1 text-center mb-8">
                            Back Home
                        </a>
                    </Link>
                    {hasFilter && (
                        <Link href="/explore">
                            <a className="text-lg border w-48 rounded px-2 py-1 text-center mb-8">
                                Clear Filter
                            </a>
                        </Link>
                    )}
                </div>
                <div className="w-full flex flex-col gap-4">
                    <div className="flex justify-between">
                        <p className="text-4xl border border-white border-opacity-20 rounded p-2">
                            {numeral(metadata.setCount).format("0,0")} Image Sets
                        </p>
                        <p className="text-4xl border border-white border-opacity-20 rounded p-2">
                            {numeral(metadata.imageCount).format("0,0")} Images
                        </p>
                        <p className="text-4xl border border-white border-opacity-20 rounded p-2">
                            {numeral(metadata.tagCount).format("0,0")} Unique Tags
                        </p>
                    </div>
                    <h2 className="text-4xl">Tags</h2>
                    <ExploreTagList tags={metadata.tagCounts} />
                    <div className="grid grid-cols-6 text-xs gap-2">
                        {metadata.imageSets
                            .slice(page * imagesPerPage, (page + 1) * imagesPerPage)
                            .map(set => (
                                <ImageSetTile key={set.id} imageSet={set} />
                            ))}
                    </div>
                    <Pagination
                        value={page + 1}
                        onChange={v => setPage(v - 1)}
                        totalPages={Math.ceil(metadata.setCount / imagesPerPage)}
                        maxPages={7}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Explore;

export async function getServerSideProps(
    ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ metadata: Metadata; hasFilter: boolean }>> {
    const requireCategory = (ctx.query.category as string) || "";
    const requireTag = (ctx.query.tag as string) || "";
    const hasFilter = !!requireCategory && !!requireTag;
    //const metadata = hasFilter ? getMetadata(requireCategory, requireTag) : getMetadata();
    const filteredMetadata =
        process.env.NEXT_PUBLIC_NO_CACHE === "true"
            ? hasFilter
                ? await getMetadata(requireCategory, requireTag)
                : await getMetadata(undefined, undefined, 1)
            : getFilteredMetadata(requireCategory, requireTag, 1);
    //const filteredMetadata = getFilteredMetadata(requireCategory, requireTag);
    return {
        props: { metadata: filteredMetadata, hasFilter },
    };
}
