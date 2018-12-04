import React, { Component } from "react";
import Axios                from "axios";
import queryString          from "query-string"
import { withRouter }       from "react-router";

import Select from "../Select";

import {
    CATEGORIES,
    COUNTRIES
}            from "../../api/urls";
import axios from "../../api/axios";

class SearchForm extends Component {
    state = {
        inputs : {
            country        : -1,
            city           : -1,
            category       : -1,
            specialization : -1
        },

        countries       : [],
        cities          : [],
        categories      : [],
        specializations : [],

        isLoading : true
    };

    // Request cancellation token
    rct = null;

    componentDidMount() {
        this.fetchData().catch(console.log);
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    async fetchData() {
        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { data : { data : categories } } = await axios({ ...CATEGORIES(), cancelToken : this.rct.token });
        const { data : { data : countries } } = await axios({ ...COUNTRIES(), cancelToken : this.rct.token });

        this.setState({ categories, countries, isLoading : false });

        this.setState((state) => {
            state.inputs.category = -1;
            state.inputs.country  = -1;
            return state;
        });
    }

    onSelectChange = (item, property) => {
        if (property === "country") {
            this.setState((state) => {
                state.cities      = item.id === -1 ? [] : item.cities;
                state.inputs.city = -1;
                return state;
            });
        }
        if (property === "category") {
            this.setState((state) => {
                state.specializations       = item.id === -1 ? [] : item.specializations;
                state.inputs.specialization = -1;
                return state;
            });
        }
        this.setState((state) => {
            state.inputs[property] = item.id;
            return state;
        });
    }

    onSubmit = (evt) => {
        evt.preventDefault();

        const { inputs } = this.state;

        const params = {};
        Object.keys(inputs).forEach((name) => { if (inputs[name] != -1) params[name] = inputs[name]; });

        this.props.history.push(`/search?${queryString.stringify(params)}`);
    }

    render() {
        const { countries, categories, cities, specializations, inputs, isLoading } = this.state;

        return (
            <div className=" p-4 w90 m-auto search text-right position-relative align-items-center d-table">
                <div className="row">
                    <div className="col-md-12">
                        <div className="col-12 search-head py-2">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">إبحث عن أفضل الشركات</h2>
                            <p className="w-100 m-0 p-0 text-right font-weight-bold">البحث مستند إلى الخرائط. 100 ٪</p>
                        </div>
                    </div>
                    <form className="col-md-12 row" onSubmit={ this.onSubmit }>
                        <Select
                            placeholder="اختر الدولة"
                            className="col-md-6 py-2"
                            property="country"
                            labelProperty="name"
                            valueProperty="id"
                            isLoading={ isLoading }
                            options={ countries }
                            onChange={ this.onSelectChange }
                            value={ inputs.country }
                        />
                        <Select
                            placeholder={ inputs.country > -1 ? "اختر المدينة" : "قم بإختيار الدولة اولاً" }
                            className="col-md-6 py-2"
                            property="city"
                            labelProperty="name"
                            valueProperty="id"
                            isLoading={ isLoading }
                            options={ cities }
                            onChange={ this.onSelectChange }
                            value={ inputs.city }
                        />
                        <Select
                            placeholder="اختر الفئة"
                            className="col-md-6 py-2"
                            property="category"
                            labelProperty="name"
                            valueProperty="id"
                            isLoading={ isLoading }
                            options={ categories }
                            onChange={ this.onSelectChange }
                            value={ inputs.category }
                        />
                        <Select
                            placeholder={ inputs.category > -1 ? "اختر التخصص" : "اختر الفئة اولاً" }
                            className="col-md-6 py-2"
                            property="specialization"
                            labelProperty="name"
                            valueProperty="id"
                            isLoading={ isLoading }
                            options={ specializations }
                            onChange={ this.onSelectChange }
                            value={ inputs.specialization }
                        />
                        <div className="col-md-12 text-center py-2">
                            <button type="submit" className="btn btn-md px-3">البحث</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(SearchForm);