import React, { Component, Fragment } from "react";
import Axios                          from "axios";

import LoadableContainer from "../containers/LoadableContainer";

import { PAGE } from "../api/urls";
import axios    from "../api/axios";

class Privacy extends Component {
    state = {
        isLoading : true,
        data      : null
    };

    rct = null;

    componentDidMount() {
        this.fetchData().catch(console.log);
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    async fetchData() {
        if (this.rct)
            this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { data : { data : { title, content } } } = await axios({ ...PAGE("privacy"), cancelToken : this.rct.token });

        this.setState((state) => {
            state.data = content;
            state.isLoading = false;
            return state;
        });
    }

    render() {
        const { data, isLoading } = this.state;

        return (
            <Fragment>
                <section className="w-100 d-block pt-5 text-center m-0 align-items-center contact-us">
                    <div className="pt-4 w90 m-auto text-right">
                        <div className="col-12 search-head">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">سياسة الخصوصية</h2>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-md-8 py-2">
                                <LoadableContainer isLoading={ isLoading }>
                                    <div className="col-12 py-3">
                                        <p dangerouslySetInnerHTML={{ __html : data }} className="w-100 p-3 font-weight-normal about-page">
                                        </p>

                                    </div>
                                </LoadableContainer>
                            </div>
                            <div className="col-md-4 py-2">
                                <img className="w-100" src="images/privacy-policy.png"/>
                            </div>


                        </div>

                    </div>
                </section>

                <div className="clearfix"></div>

                <section className="news w-100 pb-5">
                    <div className="row m-0 align-items-center w90 mx-auto" style={{ overflow : "hidden" }}>
                        <div className="col-12 search-head my-4">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">الشركات المميزة</h2>
                        </div>
                        <div className="row m-0 team w-100 privacy">
                            <div className="col-md-6">
                                <div className="slide-fig">
                                    <div className="slick-slide-img"><img className="w-100" src="images/privacy1.jpg"/>
                                    </div>
                                    <div className="slick-content position-relative w-100 slide-content-static">
                                        <h4 className="font-weight-bold">نوع المعلومات التي يحتاجها الموقع</h4>
                                        <p className="font-weight-normal font-weight-bold">يقوم موقع “المقاول” بتجميع معلومات معينة عنك عند كل زيارة تقوم بها للموقع. هذه المعلومات ليست لها علاقة بهويتك بل نستخدمها فقط من أجل تحسين جودة الموقع، وتعديل تصميمه و محتواه حسب نوعية الزوار ومتطلباتهم وطرق استخدامهم و تصفحهم للموقع. كما نستخدمها من أجل تحسين طرقنا التسويقية و نوعية وجودة الخدمات والمنتجات التي نقدمها من خلال الموقع. ومن بين هذه المعلومات التي نقوم بتجميعها عنك</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="slide-fig">
                                    <div className="slick-slide-img"><img className="w-100" src="images/privacy2.jpg"/>
                                    </div>
                                    <div className="slick-content position-relative w-100 slide-content-static">
                                        <h4 className="font-weight-bold">خصوصية الزوار ومستخدمي الموقع</h4>
                                        <p className="font-weight-normal font-weight-bold">يقوم موقع “المقاول” بتجميع معلومات معينة عنك عند كل زيارة تقوم بها للموقع. هذه المعلومات ليست لها علاقة بهويتك بل نستخدمها فقط من أجل تحسين جودة الموقع، وتعديل تصميمه و محتواه حسب نوعية الزوار ومتطلباتهم وطرق استخدامهم و تصفحهم للموقع. كما نستخدمها من أجل تحسين طرقنا التسويقية و نوعية وجودة الخدمات والمنتجات التي نقدمها من خلال الموقع. ومن بين هذه المعلومات التي نقوم بتجميعها عنك</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Fragment>
        );
    }
}

export default Privacy;