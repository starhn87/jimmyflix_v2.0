import { useEffect } from "react";


export const useSearch = (): void => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
}

