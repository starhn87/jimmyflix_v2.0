import React, { createContext, useContext, useReducer } from "react";
import homeReducer, { homeInitialState, HomeState, HomeAction } from "../reducers/HomeReducer";


const HomeContext = createContext<{
    state: HomeState,
    dispatch: React.Dispatch<HomeAction>
}>({
    state: homeInitialState,
    dispatch: () => null
});

const HomeProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(homeReducer, homeInitialState);

    return (
        <HomeContext.Provider value={{ state, dispatch }}>
            {children}
        </HomeContext.Provider>
    )
}

export const useHomeDispatch = () => {
    const { dispatch } = useContext(HomeContext);
    return dispatch;
}

export const useHomeState = () => {
    const { state } = useContext(HomeContext);
    return state;
}

export default HomeProvider;

