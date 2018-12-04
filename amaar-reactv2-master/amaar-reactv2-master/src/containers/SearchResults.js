import React, {
    Fragment,
    Component
}               from "react";
import { Link } from "react-router-dom";

import Image  from "../components/Image";
import Rating from "../components/Rating";

function SearchResults({ data }) {

    const results = data.map((result) => <SearchResult key={ result.id } { ...result } />);

    return (            
        <div className="row w-100 m-0 search-result">
            { results }
        </div>
    );
}

function SearchResult({
    id,
    average_rating,
    description,
    name,
    specialization,
    meta_data
}) {
    return (
        <div className="col-lg-3 col-sm-6 text-center mb-4">
            <div className="shadow p-0 mb-1">
                <Image className="partners-img w-100" src={ meta_data?.logo } />
                <h4 className="m-0 font-weight-bold text-right p-2">{ name }</h4>
                <div className="row m-0">
                    <div className="col-lg-6 text-right">
                        <p className="w-100 m-0 font-weight-bold">التخصص</p>
                        <p className="w-100 m-0 font-weight-normal">{ specialization?.name }</p>
                    </div>
                    <div className="col-lg-6 text-right">
                        <p className="w-100 m-0 font-weight-bold">تقييم الشركة</p>
                        <Rating value={ average_rating } readOnly />
                    </div>

                </div>
                <p className="m-0 text-right p-2"><small>{ description }</small></p>
                <Link to={ `/company/${id}` } className="btn btn-md w-100 py-2">المزيد...</Link>
            </div>
        </div>
    );
}

export default SearchResults;