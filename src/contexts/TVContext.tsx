import { createContext, ReactNode, useContext, useReducer } from "react";
import React from "react";
import tvReducer, { tvInitialState } from "../reducers/TVReducer";
import { TVState, TVAction } from "../reducers/TVReducer";


const TVContext = createContext<{
    state: TVState,
    dispatch: React.Dispatch<TVAction>
}>({
    state: tvInitialState,
    dispatch: () => null
});

const TVProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(tvReducer, tvInitialState);

    return (
        <TVContext.Provider value={{ state, dispatch }}>
            {children}
        </TVContext.Provider>
    )
}

export const useTVDispatch = () => {
    const { dispatch } = useContext(TVContext);
    return dispatch;
}

export const useTVState = () => {
    const { state } = useContext(TVContext);
    return state;
}

export default TVProvider;