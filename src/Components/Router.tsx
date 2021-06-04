import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Home from "../Routes/Home";
import TV from "../Routes/TV";
import Search from "../Routes/Search";
import Detail from "../Routes/Detail";
import DetailProvider from "../contexts/DetailContext";
import HomeProvider from "../contexts/HomeContext";
import TVProvider from "../contexts/TVContext";
import SearchProvider from "../contexts/SearchContext";

export default () => (
    <Router>
        <Switch>
            <Route path="/" exact>
                <HomeProvider>
                    <Home />
                </HomeProvider>
            </Route>
            <Route path="/tv">
                <TVProvider>
                    <TV />
                </TVProvider>
            </Route>
            <Route path="/search">
                <SearchProvider>
                    <Search />
                </SearchProvider>
            </Route>
            <Route path={["/movie/:id", "/show/:id"]}>
                <DetailProvider>
                    <Detail />
                </DetailProvider>
            </Route>
            <Route path="*">
                <HomeProvider>
                    <Redirect to="/" />
                </HomeProvider>
            </Route>
        </Switch>
    </Router>
)