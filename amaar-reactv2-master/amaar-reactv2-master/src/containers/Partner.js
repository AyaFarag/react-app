import React    from "react";
import { Link } from "react-router-dom";

import Image from "../components/Image";

function Partner({ id, name, description, logo }) {
	return (
		<div className="col-lg-3 col-sm-6 text-center mb-4">
            <div className="shadow p-3 mb-1"><Image className="partners-img" src={ logo } style={{ width : "100%" }} />
                <Link to={ `/company/${id}` }><h4 className="m-0 font-weight-bold">{ name }</h4></Link>
                <p className="m-0">
                    <small>{ description }</small>
                </p>
            </div>
        </div>
	);
}

export default Partner;