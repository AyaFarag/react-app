import React, { Component, Fragment } from "react";
import Axios                          from "axios";

import LoadableContainer from "../containers/LoadableContainer";

import { PAGE } from "../api/urls";
import axios    from "../api/axios";

class About extends Component {
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
        this.rct = Axios.CancelToken.source();

        const { data : { data : { title, content } } } = await axios({ ...PAGE("about_us"), cancelToken : this.rct.token });

        this.setState((state) => {
            state.data      = content;
            state.isLoading = false;
            return state;
        });
    }

    render() {
        const { isLoading, data } = this.state;

        return (
            <section className="w-100 d-block pt-5 text-center m-0 align-items-center contact-us">
                <div className="pt-4 w90 m-auto text-right">
                    <div className="col-12 search-head">
                        <h2 className="w-100 text-right m-0 p-0 font-weight-bold">عن عمار</h2>
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
                            <img className="w-100" src="/images/about.png"/>
                        </div>


                    </div>

                </div>
            </section>
        );
    }
}

export default About;