import React, {
    Component,
    Fragment
}                 from "react";
import Axios      from "axios";
import equal      from "deep-equal";
import { Prompt } from "react-router-dom";

import Input          from "../../../components/Input";
import Select         from "../../../components/Select";
import ChangePassword from "../../../components/ChangePassword";

import UserContext from "../../../contexts/user";
import withContext from "../../../contexts/with-context";

import {
    COUNTRIES,
    CLIENT_UPDATE_DATA
}            from "../../../api/urls";
import axios from "../../../api/axios";

import { isFormValid, removeEmptyProperties, mergeUserData } from "../../../helpers";

class ProfileClientData extends Component {
    constructor({ user }) {
        super();

        this.state = {
            inputs : {
                name       : user.name,
                country_id : user.country.id,
                city_id    : user.city.id
            },
            validation : {
                country_id : true,
                city_id    : true,
                name       : true
            },

            isSubmitting : false,
            success      : false,
            error        : "",

            countries : [],
            cities    : [],

            isLoading : true
        };

        this.initialInputs = {
            name       : user.name,
            country_id : user.country.id,
            city_id    : user.city.id
        };
    }

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

        const { data : { data : countries } } = await axios({ ...COUNTRIES(), cancelToken : this.rct.token })

        this.setState((state) => {
            state.countries = countries;
            state.isLoading = false;
            return state;
        });
    }

    async updateData() {
        this.setState({ isSubmitting : true, success : false, error : "" });
        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        await axios({ ...CLIENT_UPDATE_DATA(), data : this.state.inputs, cancelToken : this.rct.token });

        const { countries, cities } = this.state;

        this.props.updateUserData(
            mergeUserData(
                this.props.user,
                this.state.inputs,
                { countries, cities }
            )
        );

        this.initialInputs = { ...this.state.inputs };
        this.setState({ isSubmitting : false, success : true });
    }

    onInputChange = ({ target : { value } }, property, valid) => {
        this.setState((state) => {
            state.inputs[property] = value;
            state.validation[property] = valid;
            return state;
        });
    };

    onSelectChange = (item, property, valid) => {
        this.setState((state) => {
            if (property === "country_id") {
                state.cities = item.cities || [];
            }
            state.inputs[property] = item.id;
            state.validation[property] = valid;
            return state;
        });
    };

    onSubmit = (evt) => {
        evt.preventDefault();

        this.updateData().catch((err) => {
            console.log(err);
            this.setState({ isSubmitting : false, error : err.response?.data?.message });
        });
    };

    render() {
        const {
            isLoading,
            countries,
            cities,
            inputs,
            validation,
            isSubmitting,
            success,
            error
        } = this.state;

        const pristine = equal(inputs, this.initialInputs);

        return (
            <Fragment>
                <form onSubmit={ this.onSubmit } className="w90 m-auto text-right align-items-center d-table pt-5">
                    <Prompt
                        when={ !pristine }
                        message="هل أنت متأكد ؟ يوجد لديك تعديلات غير محفوظة"
                    />
                    <div className="p-4 w-100 text-right align-items-center d-table">
                        <div className="row">
                            <div className="col-md-12 py-2">
                                <div className="col-12 search-head">
                                    <h2 className="w-100 text-right m-0 p-0 font-weight-bold">بيانات العميل</h2>
                                    <p className="w-100 m-0 p-0 text-right font-weight-bold"></p>
                                </div>
                            </div>
                            <Input
                                property="name"
                                onChange={ this.onInputChange }
                                className="col-md-12 py-2"
                                placeholder="الإسم"
                                value={ inputs.name }
                                valid={ validation.name }
                                required
                            />
                            <Select
                                className="col-md-6 py-2"
                                property="country_id"
                                labelProperty="name"
                                valueProperty="id"
                                isLoading={ isLoading }
                                options={ countries }
                                onChange={ this.onSelectChange }
                                value={ inputs.country_id }
                            />
                            <Select
                                className="col-md-6 py-2"
                                property="city_id"
                                labelProperty="name"
                                valueProperty="id"
                                isLoading={ isLoading }
                                options={ cities }
                                onChange={ this.onSelectChange }
                                value={ inputs.city_id }
                            />
                            <div className="col-md-12 text-center pb-3 pt-2">
                                <button
                                    disabled={ !isFormValid(validation) || isSubmitting || pristine }
                                    type="submit"
                                    className="btn btn-md px-3"
                                    onClick={ this.onSubmit }
                                >
                                    حفظ
                                </button>
                            </div>
                            { success && <div className="col-md-12 text-center pb-3 pt-2 text-success">تم الحفظ بنجاح</div> }
                            { error && <div className="col-md-12 text-center pb-3 pt-2 text-danger">{ error }</div> }
                        </div>
                    </div>
                </form>
                <ChangePassword />
            </Fragment>
        );
    }
}

export default withContext(ProfileClientData, UserContext);