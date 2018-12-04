import React, { Fragment } from "react";
import { Link }            from "react-router-dom";

import Image from "../components/Image";

function Project({ id, name, description, images, companyId }) {
	return (
		<div className="col-lg-3 col-sm-6 text-center mb-4">
            <div className="shadow p-0 mb-1">
                <Image className="partners-img w-100" src={ images[0] || "(unknown)" }/>
                <h4 className="m-0 font-weight-bold text-right p-2">{ name }</h4>
                <div className="row m-0">
                    <div className="col-lg-12 text-right">
                        <p className="w-100 my-2">{ description.slice(0, 150) }</p>
                    </div>
                </div>

                <div className="row m-0 pb-3">
                    <div className="col-12">
                        <Link to={ `/company/${companyId}/project/${id}` } className="btn btn-sm w-100 py-1">المزيد عن المشروع</Link>
                    </div>
                </div>
            </div>
        </div>
	);
}

function CompanyProjects({ loadMore, hasMore, isMoreLoading, data, companyId }) {
	if (!data) return null;

	if (!data.length) {
        return (
            <div className="row w-100 m-0 search-result">
                <h4 className="col-12 text-center text-danger mt-5 mb-5">لا يوجد مشاريع</h4>
            </div>
        );
    }

	return (
		<Fragment>
	        <div className="row w-100 search-result m-0">
	        	{ data.map(project => <Project key={ project.id } companyId={ companyId } { ...project } />) }
    	        {
    	        	hasMore && (
    			        <div className="col-md-12 text-center py-2">
    			            <button disabled={ isMoreLoading } className="btn btn-md px-3" onClick={ loadMore }>المزيد</button>
    			        </div>
    	            )
    	        }
            </div>
	    </Fragment>
	);
}

export default CompanyProjects;