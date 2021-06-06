import { useEffect, useState } from "react";
import { collections } from "../api";

interface ICollection {
    id: number,
    poster_path: string,
    name: string
}

interface Props {
    collection?: ICollection[],
    error?: string
}

export function useCollection(id: number): Props {
    const [collection, setCollection] = useState<ICollection[]>();
    const [error, setError] = useState<string>();

    const getCollection = async () => {
        try {
            const { data: { parts } } = await collections(id);
            setCollection(parts);
        } catch {
            setError("Can't find collections information.");
        }
    }

    useEffect(() => {
        getCollection();
    }, []);

    return { collection, error };
}

