import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaInfoCircle, FaTimes, FaTrash } from "react-icons/fa";
import Layout from "components/layout/Layout";
import QuickdrawSlideshow from "components/QuickdrawSlideshow";
import { SetImage } from "lib/types";
import TagSelection from "components/TagSelection";
import packageJson from "package.json";

const HomePage = (): JSX.Element => {
    const [setImages, setSetImages] = useState<SetImage[]>([]);
    const [imageCount, setImageCount] = useState(20);
    const [interval, setInterval] = useState(120);
    const [ready, setReady] = useState(false);
    const [started, setStarted] = useState(false);
    const [excludeTags, setExcludeTags] = useState<(string | null)[]>([
        "photo-technology/3D-stereoscopic",
        "photo-technology/multi-angle",
        "pose-category/detailed-photos",
        "pose-category/hand",
        "pose-category/facial-expressions",
    ]);
    const [includeTags, setIncludeTags] = useState<(string | null)[]>([]);
    const [showingTagSelection, setShowingTagSelection] = useState(false);
    const [showingHelp, setShowingHelp] = useState(false);
    const [runId, setRunId] = useState(0);

    useEffect(() => {
        if (window.localStorage.getItem("tagFilters")) {
            const filters = JSON.parse(
                window.localStorage.getItem("tagFilters") || "{includeTags: [], excludeTags: []}"
            );
            setExcludeTags(filters.excludeTags);
            setIncludeTags(filters.includeTags);
        }
    }, []);

    const getImages = useCallback(async () => {
        setReady(false);
        setStarted(false);
        setRunId(cur => cur + 1);
        const include: Record<string, string[]> = {};
        for (let i = 0; i < includeTags.length; i++) {
            const t = includeTags[i];
            if (!t) continue;
            const [category, tag] = t.split("/");
            if (!include[category]) include[category] = [];
            include[category].push(tag);
        }
        const exclude: Record<string, string[]> = {};
        for (let i = 0; i < excludeTags.length; i++) {
            const t = excludeTags[i];
            if (!t) continue;
            const [category, tag] = t.split("/");
            if (!exclude[category]) exclude[category] = [];
            exclude[category].push(tag);
        }
        const responseData = (
            await axios.post("/api/getImages", {
                count: imageCount,
                include,
                exclude,
            })
        ).data;
        setSetImages(responseData.chosenSetImages);
        setReady(true);
    }, [imageCount, includeTags, excludeTags]);

    useEffect(() => {
        getImages();
    }, [getImages]);

    useEffect(() => {
        console.log(setImages);
    }, [setImages]);

    return (
        <Layout>
            <div className="flex flex-col gap-2 items-center w-full">
                <div className="flex w-full justify-between gap-2">
                    <Link href="/explore">
                        <a className="text-lg bg-transparent border w-72 rounded px-2 py-1 text-center">
                            Explore Image Sets & Tags
                        </a>
                    </Link>
                    <button
                        onClick={() => setShowingHelp(cur => !cur)}
                        className="border rounded w-12 grid place-items-center text-2xl"
                    >
                        <FaInfoCircle />
                    </button>
                    <button
                        disabled={started}
                        onClick={() => setShowingTagSelection(cur => !cur)}
                        className={`text-lg bg-transparent border w-72 rounded px-2 py-1 text-center ${
                            started
                                ? "border-white border-opacity-30 text-white text-opacity-30"
                                : ""
                        }`}
                    >
                        Configure tag filters
                    </button>
                </div>
                <div className="w-full grid grid-cols-3">
                    <div className="flex items-center gap-2">
                        <label>Number of Images</label>
                        <select
                            value={imageCount}
                            className="bg-neutral-800 text-white text-lg px-2 py-1 w-24"
                            onChange={e => {
                                setImageCount(parseInt(e.target.value));
                            }}
                        >
                            <option value={1}>1</option>
                            <option value={3}>3</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="text-lg bg-blue-500 w-48 rounded px-2 py-1"
                            disabled={!ready}
                            onClick={() => {
                                if (started) {
                                    getImages();
                                } else {
                                    setStarted(true);
                                    setShowingTagSelection(false);
                                }
                            }}
                        >
                            {started ? "Stop & Reset" : ready ? "Start" : "Loading"}
                        </button>
                    </div>
                    <div className="flex gap-8 justify-end">
                        <div className="flex items-center gap-2">
                            <label>Interval</label>
                            <select
                                value={interval}
                                className="bg-neutral-800 text-white text-lg px-2 py-1 w-72"
                                onChange={e => {
                                    setInterval(parseInt(e.target.value));
                                }}
                            >
                                <option value={30}>30 Seconds</option>
                                <option value={60}>1 Minutes</option>
                                <option value={120}>2 Minutes</option>
                                <option value={300}>5 Minutes</option>
                                <option value={600}>10 Minutes</option>
                                <option value={0}>Unlimited</option>
                            </select>
                        </div>
                    </div>
                </div>
                {showingTagSelection ? (
                    <div
                        className="flex flex-col gap-4 mt-8"
                        style={{
                            width: "calc(100vw - 8rem)",
                        }}
                    >
                        <div className="flex flex-col gap-2 w-full">
                            <h2>Sets must include...</h2>
                            {includeTags.map((_, i) => (
                                <div key={i} className="flex gap-6">
                                    <TagSelection
                                        value={includeTags[i]}
                                        onChange={val => {
                                            setIncludeTags(cur =>
                                                cur.map((t, j) => (i === j ? val : t))
                                            );
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            setIncludeTags(cur => cur.filter((t, j) => i !== j));
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                className="border rounded px-2"
                                onClick={() => setIncludeTags(cur => [...cur, ""])}
                            >
                                Add included tag
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <h2>Sets must not include...</h2>
                            {excludeTags.map((_, i) => (
                                <div key={i} className="flex gap-6">
                                    <TagSelection
                                        value={excludeTags[i]}
                                        onChange={val => {
                                            setExcludeTags(cur =>
                                                cur.map((t, j) => (i === j ? val : t))
                                            );
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            setExcludeTags(cur => cur.filter((t, j) => i !== j));
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                className="border rounded px-2"
                                onClick={() => setExcludeTags(cur => [...cur, ""])}
                            >
                                Add excluded tag
                            </button>
                        </div>
                        <button
                            className="border rounded bg-transparent transition-colors active:bg-green-800 active:transition-none duration-500"
                            onClick={() => {
                                window.localStorage.setItem(
                                    "tagFilters",
                                    JSON.stringify({ includeTags, excludeTags })
                                );
                            }}
                        >
                            Set as Defaults
                        </button>
                    </div>
                ) : (
                    <QuickdrawSlideshow
                        runId={runId}
                        images={setImages}
                        onReset={getImages}
                        started={started}
                        interval={interval}
                    />
                )}
                {showingHelp && (
                    <div
                        className="fixed top-36 border rounded px-8 py-4 flex flex-col gap-4"
                        style={{
                            width: "calc(100vw - 8rem)",
                            margin: "0 auto",
                        }}
                    >
                        <div className="flex justify-between">
                            <h1 className="text-2xl">QuickSketch v{packageJson.version}</h1>
                            <button onClick={() => setShowingHelp(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <p>
                            This is a little app I wrote to make it easy to setup varied quicksketch
                            drawing sessions. I scraped over half a million images from several
                            drawing reference sites that offered free thumbnail gallery previews, so
                            there is a massive variety of poses, subjects, etc. The drawback is that
                            the image quality is terrible, but hey it is what it is.
                        </p>
                        <p>
                            Use the two dropdowns above to select how many images you&apos;d like in
                            your session and how long each image should appear for. Then, click
                            Start!
                            <br />
                            You can use the keyboard keys to jump back and forth within the
                            randomly-generated image gallery.
                        </p>
                        <p>
                            If you like, you can click &apos;Configure tag filters&apos; to have
                            more fine-grained control on the type of images you&apos;d like to see.
                            I&apos;ve set up some useful defaults.
                        </p>
                        <p>
                            Finally, you can browse the entire image database by clicking on the
                            &apos;Explore Image Sets &amp; Tags&apos; button in the top-left.
                        </p>
                        <p>Happy sketching!</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default HomePage;

/*
//Leaving this here so that I don't have to keep looking up the syntax...
import { GetServerSidePropsContext } from "next/types";
export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: any }> {
    return {
        props: {  },
    };
}
*/
