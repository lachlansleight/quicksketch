import { useState, useEffect } from "react";
import { enumMapping } from "lib/enums";

const TagSelection = ({
    value,
    onChange,
}: {
    value: string | null;
    onChange: (newVal: string | null) => void;
}): JSX.Element => {
    const [category, setCategory] = useState(value ? value.split("/")[0] : "");
    const [tag, setTag] = useState(value ? value.split("/")[1] : "");

    useEffect(() => {
        if (value) {
            const [c, t] = value.split("/");
            setCategory(c);
            setTag(t);
        } else {
            setCategory("");
            setTag("");
        }
    }, [value]);

    useEffect(() => {
        const newVal = category && tag ? `${category}/${tag}` : null;
        console.log(newVal);
        if (newVal !== value) onChange(newVal);
    }, [category, tag]);

    return (
        <div className="flex gap-4 flex-grow">
            <select
                className="bg-neutral-800 text-white w-1/2"
                value={category}
                onChange={e => {
                    setCategory(e.target.value);
                    setTag("");
                }}
            >
                <option value="">Select Category</option>
                <option value="gender">Gender</option>
                <option value="age">Age</option>
                <option value="body-type">Body</option>
                <option value="hair">Hair Type</option>
                <option value="hair-color">Hair Color</option>
                <option value="race">Race</option>
                <option value="pose">Pose</option>
                <option value="pose-category">Pose Category</option>
                <option value="clothes">Clothes</option>
                <option value="group-type">Group</option>
                <option value="holding">Held Object</option>
                <option value="photo-technology">Photo Technology</option>
            </select>
            {category === "" ? (
                <div />
            ) : (
                <select
                    className="bg-neutral-800 text-white w-1/2"
                    value={tag}
                    onChange={e => setTag(e.target.value)}
                >
                    <option value="">Select Tag</option>
                    {enumMapping[category].map((t, i) => (
                        <option key={i} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default TagSelection;
