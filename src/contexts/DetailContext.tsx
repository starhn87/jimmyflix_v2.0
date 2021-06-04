import React, { createContext, useContext, useReducer } from "react";
import detailReducer, { DetailAction, detailInitialState, DetailState } from "../reducers/DetailReducer";

const DetailContext = createContext<{
    state: DetailState,
    dispatch: React.Dispatch<DetailAction>
}>({
    state: detailInitialState,
    dispatch: () => null
});

const DetailProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(detailReducer, detailInitialState);

    return (
        <DetailContext.Provider value={{ state, dispatch }}>
            {children}
        </DetailContext.Provider>
    )
}

export const useDetailDispatch = () => {
    const { dispatch } = useContext(DetailContext);
    return dispatch;
}

export const useDetailState = () => {
    const { state } = useContext(DetailContext);
    return state;
}


export default DetailProvider;
