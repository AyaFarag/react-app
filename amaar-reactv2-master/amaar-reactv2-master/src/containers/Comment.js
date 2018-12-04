import React from "react";

import Rating from "../components/Rating";

function Comment({ comment, rating, client : { name } }) {
    return (
        <div className="row pt-2 m-0 border-bottom">
            <div className="col-12">
                <div className="py-2 text-right font-weight-bold">
                    <strong className="searchResult_results_media_body_option font-weight-bold">الإسم:</strong>&nbsp;
                    { name }
                </div>
                <div className="py-2 text-right">
                    <Rating value={ rating } readOnly />
                </div>
            </div>
            <div className="col-12">
                <div className="py-2 text-right">
                    <p>{ comment }</p>
                </div>
            </div>
        </div>
    );
}

export default Comment;