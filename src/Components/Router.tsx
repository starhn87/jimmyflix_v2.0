import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Home from "../Routes/Home";
import TV from "../Routes/TV";
import Search from "../Routes/Search";
import Detail from "../Routes/Detail";
import SearchProvider from "../contexts/SearchContext";

export default () => (
    <Router>
        <Switch>
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/tv">
                <TV />
            </Route>
            <Route path="/search">
                <SearchProvider>
                    <Search />
                </SearchProvider>
            </Route>
            <Route path={["/movie/:id", "/show/:id"]}>
                <Detail />
            </Route>
            <Route path="*">
                <Redirect to="/" />
            </Route>
        </Switch>
    </Router>
)