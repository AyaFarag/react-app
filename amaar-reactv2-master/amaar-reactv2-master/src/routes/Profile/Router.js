import React, { Fragment } from "react";
import { Route, Redirect } from "react-router-dom";

import ProfileClientRouter  from "./Client/Router";
import ProfileCompanyRouter from "./Company/Router";

import UserContext from "../../contexts/user";
import withContext from "../../contexts/with-context";

function Profile({ isLoggedIn, user, pathname }) {
    if (!isLoggedIn) return <Redirect to={ `/login?redirect=${location.pathname}` } />;
    if (user.status === false) return <Redirect to={ `/activate?redirect=${location.pathname}` } />

    return user.role === "company"
        ? <ProfileCompanyRouter />
        : <ProfileClientRouter />;
}

export default withContext(Profile, UserContext);