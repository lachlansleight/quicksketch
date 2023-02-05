import Link from "next/link";
import numeral from "numeral";
import { useEffect, useMemo, useState } from "react";

const ExploreTagList = ({ tags }: { tags: { [tag: string]: number } }): JSX.Element => {
    const [expanded, setExpanded] = useState<{ [category: string]: boolean }>({});

    const groupedTags = useMemo(() => {
        const groupedTags: { category: string; tags: string[] }[] = [];
        Object.keys(tags).forEach(tag => {
            const [category, t] = tag.split("/");
            let curCategoryIndex = groupedTags.findIndex(g => g.category === category);
            if (curCategoryIndex === -1) {
                groupedTags.push({ category, tags: [] });
                curCategoryIndex = groupedTags.length - 1;
            }
            if (!groupedTags[curCategoryIndex].tags.includes(t))
                groupedTags[curCategoryIndex].tags.push(t);
        });
        groupedTags.sort((a, b) => a.tags.length - b.tags.length);
        return groupedTags;
    }, [tags]);

    useEffect(() => {
        const newExpanded: { [category: string]: boolean } = {};
        groupedTags.filter(g => g.tags.length > 10).forEach(g => (newExpanded[g.category] = false));
        setExpanded(newExpanded);
    }, [groupedTags]);

    return (
        <div className="grid grid-cols-10 gap-y-4 gap-x-6">
            {groupedTags.map(group => (
                <div
                    key={group.category}
                    className={`flex flex-col gap-2 ${
                        group.tags.length === 1
                            ? "col-span-1"
                            : group.tags.length === 2
                            ? "col-span-2"
                            : group.tags.length === 3
                            ? "col-span-3"
                            : group.tags.length === 4
                            ? "col-span-4"
                            : group.tags.length === 5
                            ? "col-span-5"
                            : group.tags.length === 6
                            ? "col-span-6"
                            : group.tags.length === 7
                            ? "col-span-7"
                            : group.tags.length === 8
                            ? "col-span-8"
                            : group.tags.length === 9
                            ? "col-span-9"
                            : "col-span-10"
                    }`}
                >
                    <div className="flex gap-2 items-center">
                        <h2 className="text-md -mb-2">{group.category}</h2>
                        {expanded[group.category] != null && (
                            <div className="flex items-start">
                                <button
                                    className="text-lg border w-18 h-4 rounded px-2 py-1 m-0 relative top-1"
                                    onClick={() => {
                                        setExpanded(cur => ({
                                            ...cur,
                                            [group.category]: !cur[group.category],
                                        }));
                                    }}
                                >
                                    <span className="relative -top-[12.5px] text-sm">
                                        {expanded[group.category] ? "-" : "+"}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                    <div
                        key={group.category}
                        className={`grid text-[0.6rem] gap-1 ${
                            group.tags.length === 1
                                ? "grid-cols-1"
                                : group.tags.length === 2
                                ? "grid-cols-2"
                                : group.tags.length === 3
                                ? "grid-cols-3"
                                : group.tags.length === 4
                                ? "grid-cols-4"
                                : group.tags.length === 5
                                ? "grid-cols-5"
                                : group.tags.length === 6
                                ? "grid-cols-6"
                                : group.tags.length === 7
                                ? "grid-cols-7"
                                : group.tags.length === 8
                                ? "grid-cols-8"
                                : group.tags.length === 9
                                ? "grid-cols-9"
                                : "grid-cols-10"
                        }`}
                    >
                        {(expanded[group.category] == null || expanded[group.category] === true
                            ? group.tags
                            : group.tags.slice(0, 9)
                        ).map(tag => (
                            <Link key={tag} href={`/explore?category=${group.category}&tag=${tag}`}>
                                <a className="flex justify-between items-center border rounded border-white border-opacity-20 h-6">
                                    <span className="px-1 h-full flex items-center leading-[0.5rem]">
                                        {tag}
                                    </span>
                                    <span className="w-10 border-l border-white border-opacity-20 px-1 h-full flex items-center justify-center bg-gray-500 bg-opacity-10">
                                        {numeral(tags[`${group.category}/${tag}`]).format("0,0")}
                                    </span>
                                </a>
                            </Link>
                        ))}
                        {expanded[group.category] != null && expanded[group.category] === false && (
                            <div
                                className="grid place-items-center border rounded border-white border-opacity-20 h-6 select-none cursor-pointer"
                                onClick={() => {
                                    setExpanded(cur => ({
                                        ...cur,
                                        [group.category]: !cur[group.category],
                                    }));
                                }}
                            >
                                <p className="text-white text-opacity-70 italic">
                                    {group.tags.length - 9} more...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExploreTagList;
