import React, { Fragment } from "react";
import { Route, Redirect } from "react-router-dom";

import RegisterPicker  from "./Picker";
import RegisterClient  from "./Client";
import RegisterCompany from "./Company";

import UserContext from "../../contexts/user";
import withContext from "../../contexts/with-context";

function RegisterRouter({ isLoggedIn }) {
    if (isLoggedIn) return <Redirect to="/" />

    return (
        <Fragment>
            <Route exact path="/register" component={ RegisterPicker } />
            <Route exact path="/register/client" component={ RegisterClient } />
            <Route exact path="/register/company" component={ RegisterCompany } />
        </Fragment>
    );
}

export default withContext(RegisterRouter, UserContext);