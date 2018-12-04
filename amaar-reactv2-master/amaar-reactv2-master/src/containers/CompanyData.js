import React from "react";

function CompanyData({ data }) {
    if (!data) return null;

    const {
        id,
        name,
        description,
        email,
        phone,
        category       : { name : categoryName },
        specialization : { name : specializationName },
        country        : { name : countryName },
        city           : { name : cityName }
    } = data;
    return (
        <div className="row align-items-center">
            <div className="col-12 p-3 mb-3 about-page">
                <div className="searchResult_results_media_body_details">

                    <div className="d-md-flex d-block w-100 navbar p-0 text-right">
                        <div className="py-2"><strong
                                className="searchResult_results_media_body_option font-weight-bold">المدينة :&nbsp;</strong>
                                { cityName }
                        </div>
                        <div className="py-2"><strong
                                className="searchResult_results_media_body_option font-weight-bold">الفئة :&nbsp;</strong>{ categoryName }</div>
                        <div className="py-2"><strong
                                className="searchResult_results_media_body_option font-weight-bold">التخصص :&nbsp;</strong>{ specializationName }</div>
                    </div>
                    <div className="d-md-flex d-block w-100 navbar p-0 text-right">
                        <div className="py-2"><strong
                                className="searchResult_results_media_body_option font-weight-bold">الدولة : &nbsp;</strong>{ countryName }</div>
                        <div className="py-2"><strong
                                className="searchResult_results_media_body_option font-weight-bold">رقم الهاتف :&nbsp;</strong>{ phone }
                        </div>
                        <div className="py-2"><strong
                                className="searchResult_results_media_body_option font-weight-bold">البريد
                            الإلكتروني :&nbsp;</strong>{ email }</div>
                    </div>
                </div>
                <p className="w-100 p-3 font-weight-normal">
                    { description }
                </p>
            </div>
        </div>
    );
}

export default CompanyData;