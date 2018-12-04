import React, { Fragment } from "react";
import { withRouter }      from "react-router";
import {
    Route,
    Switch,
    Redirect
}                          from "react-router-dom";

import ProfileCompanyHeader from "./Header";

import ProfileCompanyData     from "./Data";
import ProfileCompanyAds      from "./Ads/Ads";
import ProfileCompanyProjects from "./Projects/Projects";
import ProfileCompanyWorkDays from "./WorkDays";
import ProfileCompanyComments from "./Comments";
import ChangePassword         from "../../../components/ChangePassword";

function ProfileCompanyRouter({ location : { pathname } }) {
    if (/^\/profile\/?$/.test(pathname)) {
        return <Redirect to="/profile/data" />
    }

    return (
        <section className="w-100 d-block text-center m-0 p-0 align-items-center contact-us">
            <ProfileCompanyHeader />
            <Switch>
                <Route path="/profile/projects/:id?" component={ ProfileCompanyProjects } />
                <Route path="/profile/ads/:id?" component={ ProfileCompanyAds } />
                <Route path="/profile/data" component={ ProfileCompanyData } />
                <Route path="/profile/work-days" component={ ProfileCompanyWorkDays } />
                <Route path="/profile/comments" component={ ProfileCompanyComments } />
                <Route path="/profile/change-password" component={ ChangePassword } />
            </Switch>
        </section>
    );
}

export default withRouter(ProfileCompanyRouter);