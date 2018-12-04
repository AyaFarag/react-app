import React, { Fragment } from "react";

import SearchForm      from "../components/Search/Form";
import CompaniesSlider from "../components/CompaniesSlider";

function Index() {
    return (
        <Fragment>
            <section className="slideshow w-100 d-block text-center m-0 p-0 align-items-center" id="slideshow">
                <SearchForm />
            </section>
            <section className="news w-100 pb-5">
			    <div className="row m-0 align-items-center w90 mx-auto">
			        <div className="col-12 search-head my-4">
			            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">شركائنا</h2>
			        </div>
			        <div className="your-class w-100 p-0 m-0">
			           <CompaniesSlider type={ CompaniesSlider.PARTNERS } />
			        </div>
			    </div>
			</section>
			<section style={{ background : "url(\"/images/1.jpg\")" }} className="news w-100 pt-1 pb-5">
			    <div className="row m-0 align-items-center w90 mx-auto">
			        <div className="col-12 search-head my-4">
			            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">الشركات المميزة</h2>
			        </div>
			        <div className="w-100 p-0 m-0">
			        	<CompaniesSlider type={ CompaniesSlider.UNIQUE } />
			        </div>
				</div>

			</section>
        </Fragment>
    )
}

export default Index;