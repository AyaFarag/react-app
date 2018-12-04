import React, { Fragment } from "react";
import { withRouter }      from "react-router";
import { Route, Redirect } from "react-router-dom";

import ProfileClientData from "./Data";

function ProfileClientRouter({ location : { pathname } }) {
    if (/^\/profile\/?$/.test(pathname)) {
        return <Redirect to="/profile/data" />
    }

    return (
        <section className="w-100 d-block text-center m-0 p-0 align-items-center contact-us">
            <Route exact path="/profile/data" component={ ProfileClientData } />
        </section>
    );
}

export default withRouter(ProfileClientRouter);