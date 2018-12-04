import React, { Component } from "react";
import Axios                from "axios";
import queryString          from "query-string";

import Select from "../components/Select";
import Image  from "../components/Image";


import LoadableContainer from "../containers/LoadableContainer";

import {
    CATEGORIES,
    GALLERY
}            from "../api/urls";
import axios from "../api/axios";

class Gallery extends Component {
    state = {
        categories      : [],

        data  : null,
        meta  : null,
        links : null,

        isLoading : true,
        isDataLoading : false
    };

    // Request cancellation token
    rctCategories = null;
    rctData = null;

    componentDidMount() {
        this.fetchCategories().catch(console.log);
        this.fetchImages().catch(console.log);
    }

    componentDidUpdate({ location }) {
        const oldParams = queryString.parse(location.search);
        const newParams = queryString.parse(this.props.location.search);
        if (newParams.specialization !== oldParams.specialization)
            this.fetchImages().catch(console.log);
    }

    componentWillUnmount() {
        if (this.rctCategories) this.rctCategories.cancel();
        if (this.rctData) this.rctData.cancel();
    }

    async fetchCategories() {
        if (this.rctCategories) this.rctCategories.cancel();

        this.rctCategories = Axios.CancelToken.source();

        const { data : { data : categories } } = await axios({ ...CATEGORIES(), cancelToken : this.rctCategories.token });

        this.setState({ categories, isLoading : false });
    }

    async fetchImages() {
        this.setState({ isDataLoading : true });

        if (this.rctData) this.rctData.cancel();

        this.rctData = Axios.CancelToken.source();

        const params = queryString.parse(this.props.location.search);

        const { data : { data, links, meta } } = await axios({ ...GALLERY(), params, cancelToken : this.rctData.token });

        this.setState({ data, links, meta, isDataLoading : false });

    }


    onSelectChange = (item, property) => {
        const params = queryString.parse(this.props.location.search);
        if (item.id == -1) delete params[property];
        else params[property] = item.id;
        return this.props.history.push(`/gallery?${queryString.stringify(params)}`)
    }

    render() {
        const {
            categories,
            isLoading,
            isDataLoading,
            data,
            links,
            meta
        } = this.state;

        const params = queryString.parse(this.props.location.search);

        return (
            <section className="w-100 d-block pt-5 text-center m-0 align-items-center contact-us">
                <div className="pt-4 w90 m-auto text-right align-items-center ">
                    <div className="row">
                        <div className="col-md-12 search-head">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">مكتبة الصور</h2>
                        </div>
                        <Select
                            placeholder="اختر الفئة"
                            className="col-md-6 py-2"
                            property="category"
                            labelProperty="name"
                            valueProperty="id"
                            isLoading={ isLoading }
                            options={ categories }
                            onChange={ this.onSelectChange }
                            value={ params.category || -1 }
                        />
                        <Select
                            placeholder={ params.category > -1 ? "اختر التخصص" : "اختر الفئة اولاً" }
                            className="col-md-6 py-2"
                            property="specialization"
                            labelProperty="name"
                            valueProperty="id"
                            isLoading={ isLoading }
                            options={ (categories.filter(category => category.id == params.category)[0] || {}).specializations || [] }
                            onChange={ this.onSelectChange }
                            value={ params.specialization || -1 }
                        />
                    </div>
                    <div className="col-12 row partners">
                        <LoadableContainer isLoading={ isDataLoading }>
                            {
                                data && (
                                    data.length
                                        ? data.map(image => (
                                            <div key={ image.image } className="col-lg-3 col-sm-6 text-center mb-4">
                                                <div className="shadow p-3 mb-1">
                                                    <a href={ image.image } target="_blank" ><Image className="partners-img" src={ image.image } style={{ width : "100%" }} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                        : (
                                            <div className="row w-100 m-0 search-result">
                                                <h4 className="col-12 text-center text-danger mt-5 mb-5">لا يوجد صور</h4>
                                            </div>
                                        )
                                )
                            }
                        </LoadableContainer>
                    </div>
                </div>
            </section>
        );
    }
}

export default Gallery;