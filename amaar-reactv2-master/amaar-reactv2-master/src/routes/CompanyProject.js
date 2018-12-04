import React, { Component, Fragment } from "react";
import Axios                from "axios";

import LoadableContainer from "../containers/LoadableContainer";

import FileUploadSection from "../components/FileUploadSection";

import { COMPANY_PROJECT } from "../api/urls";
import axios               from "../api/axios";


function Project({ data }) {
	if (!data) return null;
	const { name, description, images } = data;
	return (
		<Fragment>
			<div className="pt-4 w90 m-auto text-right align-items-center ">
		        <div className="row align-items-center">
		            <div className="col-12 p-3 mb-3 about-page">
		                <div className="searchResult_results_media_body_details">
		                     <div className="d-md-flex d-block w-100 navbar p-0 text-right">
		                        <div className="py-2"><strong
		                                className="searchResult_results_media_body_option font-weight-bold">اسم المشروع : </strong>{ data.name }</div>
		                     </div>
		                </div>
		                <p className="w-100 p-3 font-weight-normal">
		                	{ data.description }
		                </p>
		             </div>
		        </div>
			</div>
		    <FileUploadSection
			    urls={ images }
		    	readOnly
		    />
	    </Fragment>
	);
}

class CompanyProject extends Component {
	state = { data : null, isLoading : true };

	rct = null;

    componentDidMount() {
        this.fetchData().catch(console);
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    async fetchData() {
    	const { id, project } = this.props.match.params;

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { data : { data } } = await axios({ cancelToken : this.rct.token, ...COMPANY_PROJECT(id, project) });

        this.setState({ data, isLoading : false });
    }


	render() {
		const { data, isLoading } = this.state;

		return (
			<section className="w-100 d-block pt-5 text-center m-0 align-items-center contact-us">
				<div className="pt-4 w90 m-auto text-right align-items-center">
			        <div className="row">
			            <div className="col-md-6 py-2">
			                <div className="col-12 search-head">
			                    <h2 className="w-100 text-right m-0 p-0 font-weight-bold">بيانات المشروع</h2>
			                </div>
			            </div>
			        </div>
				</div>
				<LoadableContainer isLoading={ isLoading }>
				    <Project data={ data } />
				</LoadableContainer>
			</section>
		);
	}
}

export default CompanyProject;