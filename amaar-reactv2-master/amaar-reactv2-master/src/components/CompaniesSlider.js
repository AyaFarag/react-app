import React, { Component } from "react";
import Axios                from "axios";

import LoadableContainer from "../containers/LoadableContainer";
import CompaniesSlider   from "../containers/CompaniesSlider";

import {
	PARTNERS,
	UNIQUE
}            from "../api/urls";
import axios from "../api/axios";

class CompaniesSliderComponent extends Component {
	state = { data : null, isLoading : true };

	rct = null;

	componentDidMount() {
		this.fetchData().catch(console.log);
	}

	componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

	async fetchData() {
		if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();
        const type = this.props.type === CompaniesSliderComponent.PARTNERS ? PARTNERS() : UNIQUE();

        const { data : { data } } = await axios({ ...type, cancelToken : this.rct.token });

        this.setState({ data, isLoading : false });
	}

	render() {
		const { data, isLoading } = this.state;

		return (
			<LoadableContainer isLoading={ isLoading }>
				<CompaniesSlider
					data={ data }
				/>
			</LoadableContainer>
		);
	}
}

CompaniesSliderComponent.PARTNERS = Symbol("partners");
CompaniesSliderComponent.UNIQUE   = Symbol("unique");

export default CompaniesSliderComponent;