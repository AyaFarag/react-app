import React, { PureComponent } from "react";

import UserContext from "../contexts/user";
import withContext from "../contexts/with-context";

class Logout extends PureComponent {
	componentDidMount() {
		this.props.logout();
	}

	render() {
		return null;
	}
}

export default withContext(Logout, UserContext);