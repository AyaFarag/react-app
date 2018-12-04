import React  from "react";
import Slider from "react-slick";

import Image  from "../components/Image";
import Rating from "../components/Rating";

function Slide({ logo, name, description, average_rating, meta_data }) {

    const image = logo || meta_data?.logo;

	return (
        <div className="slide-fig">
            <div className="slick-slide-img"><Image className="w-100" src={ image } />
            </div>
            <div className="slick-content position-relative w-100 slide-content-block">
                <p className="p-0 m-0 slide-block-desc">{ description }</p>
            </div>
            <div className="slick-content position-relative w-100 slide-content-static">
                <h4 className="font-weight-bold">{ name }</h4>
                <Rating value={ average_rating } readOnly />
            </div>
        </div>
	);
}

function CompaniesSlider({ data }) {
	if (!data) return null;

	return (
		<Slider
            {...{
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 3,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 800,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 550,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            }}
        >
			{ data.map(company => <Slide key={ company.id } { ...company } />) }
        </Slider>
	);
}

export default CompaniesSlider;