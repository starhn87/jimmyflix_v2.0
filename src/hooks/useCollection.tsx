import { useEffect, useState } from "react";
import { collections } from "../api";

interface ICollection {
    id: number,
    poster_path: string,
    name: string
}

interface UseCollection {
    (id: number): { collection?: ICollection[], error?: string }
}

export const useCollection: UseCollection = (id: number) => {
    const [collection, setCollection] = useState<ICollection[]>();
    const [error, setError] = useState<string>();

    async function getCollection() {
        try {
            const { data: { parts } } = await collections(id);
            console.log(parts);
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

