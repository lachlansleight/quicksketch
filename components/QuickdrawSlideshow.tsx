import { useEffect, useRef, useState } from "react";
import useAnimationFrame from "lib/hooks/useAnimationFrame";
import useKeyboard from "lib/hooks/useKeyboard";
import { SetImage } from "lib/types";
import QuickdrawGallery from "./QuickdrawGallery";

const QuickdrawSlideshow = ({
    images,
    interval,
    onReset,
    runId,
    started = false,
    countdown = 10,
}: {
    images: SetImage[];
    interval: number;
    onReset?: () => void;
    runId: number;
    started?: boolean;
    countdown?: number;
}): JSX.Element => {
    const startTime = useRef(0);
    const changeTime = useRef(0);
    const lastRunning = useRef(false);
    const running = useRef(false);
    const starting = useRef(false);
    const kbSwitch = useRef(false);
    const [index, setIndex] = useState(-1);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const done = useRef(false);

    useAnimationFrame(
        ({ time }) => {
            if (running.current && !lastRunning.current) {
                startTime.current = time;
                changeTime.current = time + (countdown - 1);
                lastRunning.current = true;
                starting.current = true;
            }
            if (!running.current || done.current) return;

            if (starting.current) {
                setTimeRemaining(time - startTime.current + 1);
                if (time > changeTime.current || interval === 0) {
                    starting.current = false;
                    changeTime.current = time + (interval === 0 ? 99999999999 : interval);
                    setIndex(0);
                }
                return;
            }

            if (kbSwitch.current) {
                changeTime.current = time + (interval === 0 ? 99999999999 : interval);
                kbSwitch.current = false;
            }

            if (time > changeTime.current) {
                setIndex(cur => {
                    if (cur === images.length - 1) {
                        done.current = true;
                    }
                    return cur + 1;
                });
                changeTime.current = time + (interval === 0 ? 99999999999 : interval);
            }
            setTimeRemaining(changeTime.current - time);
        },
        [images, interval]
    );

    useKeyboard(({ key }) => {
        if (key === "ArrowRight") {
            setIndex(cur => {
                if (cur === images.length - 1) {
                    done.current = true;
                }
                return cur + 1;
            });
            kbSwitch.current = true;
        } else if (key === "ArrowLeft") {
            setIndex(cur => {
                if (cur === 0) {
                    return 0;
                }
                return cur - 1;
            });
            kbSwitch.current = true;
        }
    }, []);

    const reset = () => {
        startTime.current = 0;
        changeTime.current = 0;
        lastRunning.current = false;
        running.current = false;
        starting.current = false;
        setIndex(-1);
        setTimeRemaining(0);
        done.current = false;
        if (onReset) onReset();
    };

    useEffect(() => {
        if (!started) return;
        running.current = true;
    }, [started]);

    useEffect(() => {
        startTime.current = 0;
        changeTime.current = 0;
        lastRunning.current = false;
        running.current = false;
        starting.current = false;
        setIndex(-1);
        setTimeRemaining(0);
        done.current = false;
    }, [runId]);

    return (
        <div className="w-full">
            {done.current ? (
                <div className="grid place-items-center w-full h-96">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl text-center">Done!</h1>
                        <button className="text-lg border w-48 rounded px-2 py-1" onClick={reset}>
                            Reset
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4 items-center">
                    <QuickdrawGallery images={images} index={index} />
                    {running.current || starting.current ? (
                        <>
                            <div className="h-12 w-full border rounded border-white relative grid place-items-center">
                                <div
                                    className="h-full absolute left-0 top-0 bg-blue-500"
                                    style={{
                                        width:
                                            interval === 0
                                                ? 0
                                                : `${
                                                      (1.0 -
                                                          (timeRemaining -
                                                              (starting.current ? 1 : 0)) /
                                                              (starting.current
                                                                  ? countdown - 1
                                                                  : interval)) *
                                                      100
                                                  }%`,
                                    }}
                                />
                                <p className="relative z-5 text-xl">
                                    {starting.current
                                        ? `Starting in ${
                                              countdown + 1 - Math.round(timeRemaining)
                                          }...`
                                        : `${index + 1} / ${images.length}`}
                                </p>
                            </div>
                            <div className="flex gap-4 justify-center w-full">
                                <button
                                    className="text-lg border w-48 rounded px-2 py-1"
                                    onClick={reset}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="text-lg border w-48 rounded px-2 py-1"
                                    onClick={() => (changeTime.current = 0)}
                                >
                                    Skip
                                </button>
                            </div>
                        </>
                    ) : (
                        // <button className="text-lg bg-blue-500 w-48 rounded px-2 py-1" disabled={!images || images.length === 0} onClick={() => {
                        //     running.current = true;
                        // }}>{images && images.length > 0 ? "Start" : "Loading..."}</button>
                        <div />
                    )}
                </div>
            )}
        </div>
    );
};

export default QuickdrawSlideshow;
