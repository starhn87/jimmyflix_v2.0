import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Home from "../Routes/Home";
import TV from "../Routes/TV";
import Search from "../Routes/Search";
import Detail from "../Routes/Detail";

function BasicRouter() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/tv" exact>
                    <TV />
                </Route>
                <Route path="/search">
                    <Search />
                </Route>
                <Route path={["/movie/:id", "/tv/:id"]}>
                    <Detail />
                </Route>
                <Route path="*">
                    <Redirect to="/" />
                </Route>
            </Switch>
        </Router>

    )
}

export default BasicRouter;