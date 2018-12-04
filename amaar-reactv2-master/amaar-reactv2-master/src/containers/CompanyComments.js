import React, { Fragment } from "react";

import Comment from "./Comment";

function CompanyComments({ data, hasMore, loadMore, isMoreLoading }) {
    if (!data) return null;

    if (!data.length) {
        return (
            <div className="row w-100 m-0 search-result">
                <h4 className="col-12 text-center text-danger mt-5 mb-5">لا يوجد تعليقات</h4>
            </div>
        );
    }

    return (
    	<Fragment>
	    	{ data.map(comment => <Comment key={ comment.id } { ...comment } />) }
	    	<div className="search-result">
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

export default CompanyComments;