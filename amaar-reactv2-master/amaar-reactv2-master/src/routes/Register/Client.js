import React, { Component } from "react";
import Axios                from "axios";

import Input  from "../../components/Input";
import Select from "../../components/Select";


import axios         from "../../api/axios";
import {
    COUNTRIES,
    CLIENT_REGISTER,
    EMAIL_EXISTS,
    PHONE_EXISTS
}                    from "../../api/urls";

import { EMAIL_REGEX, isFormValid, getDeviceToken } from "../../helpers";

import UserContext from "../../contexts/user";
import withContext from "../../contexts/with-context";


class RegisterClient extends Component {

    state = {
        inputs : {
            name                  : "",
            email                 : "",
            phone                 : "",
            password              : "",
            password_confirmation : "",
            country_id            : -1,
            city_id               : -1,
            device_token          : null
        },

        validation : {
            name                  : false,
            email                 : false,
            emailUnique           : true,
            phone                 : false,
            phoneUnique           : true,
            password              : false,
            password_confirmation : false,
            city_id               : false,
        },

        countries : [],
        cities    : [],
        isLoading : true,

        isSubmitting : false
    };

    componentDidMount() {
        this.fetchData().catch(console.log);
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    async phoneExists(phone) {
        const { data } = await axios({
            data : { phone },
            ...PHONE_EXISTS()
        });

        this.setState((state) => {
            state.validation.phoneUnique = data === 0;
            return state;
        });
    }

    async emailExists(email) {
        const { data } = await axios({
            data : { email },
            ...EMAIL_EXISTS()
        });

        this.setState((state) => {
            state.validation.emailUnique = data === 0;
            return state;
        });
    }

    async register() {
        this.setState({ isSubmitting : true });
        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const data = { ...this.state.inputs, device_token : await getDeviceToken() };

        const { data : { data : client } } = await axios({ ...CLIENT_REGISTER(), data, cancelToken : this.rct.token });

        this.props.updateUserData(client);

        this.props.history.push("/");
    }

    onInputChange = ({ target : { value } }, property, valid) => {

        if (property === "phone" && valid) {
            this.phoneExists(value).catch(console.log);
        }

        if (property === "email" && valid) {
            this.emailExists(value).catch(console.log);
        }

        this.setState((state) => {
            state.inputs[property] = value;

            if (property === "password_confirmation") {
                state.validation[property] = this.state.inputs.password === value;
            } else if (property === "password") {
                state.validation.password              = valid;
                state.validation.password_confirmation = this.state.inputs.password_confirmation === value;
            } else {
                state.validation[property] = valid;
            }
            return state;
        });
    };

    onSelectChange = (item, property, valid) => {
        this.setState((state) => {
            if (property === "country_id") {
                state.cities         = item.cities || [];
                state.inputs.city_id = -1;
            }
            state.inputs[property] = item.id;
            state.validation[property] = valid;
            return state;
        });
    };

    onSubmit = (evt) => {
        evt.preventDefault();

        this.register().catch((err) => {
            console.log(err);
            this.setState({ isSubmitting : false });
        });
    };

    // Request cancellation token
    rct = null;

    async fetchData() {
        if (this.rct)
            this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { data : { data : countries } } = await axios({ ...COUNTRIES(), cancelToken : this.rct.token });

        this.setState((state) => {
            state.countries         = countries;
            state.isLoading         = false;
            state.inputs.country_id = -1;
            return state;
        });
    }

    render() {
        const { isLoading, inputs, validation, countries, cities, isSubmitting } = this.state;

        return (
            <section className="slideshow w-100 d-block text-center m-0 p-0 align-items-center" id="slideshow">
                <div className="p-4 w90 m-auto search text-right position-relative align-items-center d-table">
                    <form className="row" onSubmit={ this.onSubmit }>
                        <div className="col-md-12 py-2">
                            <div className="col-12 search-head">
                                <h2 className="w-100 text-right m-0 p-0 font-weight-bold">التسجيل كعميل</h2>
                                <p className="w-100 m-0 p-0 text-right font-weight-bold">أدخل البيانات صحيحه</p>
                            </div>
                        </div>
                        <Input
                            property="name"
                            onChange={ this.onInputChange }
                            className="col-md-6 py-2"
                            placeholder="الإسم"
                            value={ inputs.name }
                            valid={ validation.name }
                            required
                        />
                        <Input
                            property="email"
                            onChange={ this.onInputChange }
                            className="col-md-6 py-2"
                            placeholder="البريد الإلكتروني"
                            value={ inputs.email }
                            invalidMessage={
                                validation.emailUnique
                                    ? "البريد الإلكتروني غير صالح"
                                    : "البريد الإلكتروني تم استخدامه من قبل"
                            }
                            regex={ EMAIL_REGEX }
                            valid={ validation.email && validation.emailUnique }
                        />
                        <Input
                            property="phone"
                            onChange={ this.onInputChange }
                            className="col-md-12 py-2"
                            placeholder="رقم الجوال"
                            value={ inputs.phone }
                            valid={ validation.phone && validation.phoneUnique }
                            invalidMessage={
                                validation.phoneUnique
                                    ? "رقم الجوال غير صالح"
                                    : "رقم الجوال تم استخدامه من قبل"
                            }
                            regex={ /^\d{7,15}$/ }
                        />
                        <Input
                            property="password"
                            onChange={ this.onInputChange }
                            className="col-md-6 py-2"
                            type="password"
                            regex={ /^.{8,}$/ }
                            placeholder="كلمة المرور"
                            invalidMessage="يجب أن تتكون كلمة المرور من 8 أحرف على الأقل"
                            value={ inputs.password }
                            valid={ validation.password }
                        />
                        <Input
                            property="password_confirmation"
                            onChange={ this.onInputChange }
                            className="col-md-6 py-2"
                            type="password"
                            regex={ /^.{6,}$/ }
                            invalidMessage="الحقل غير متطابق مع كلمة المرور"
                            placeholder="تأكيد كلمة المرور"
                            value={ inputs.password_confirmation }
                            valid={ validation.password_confirmation }
                        />
                        <Select
                            placeholder="اختر الدولة"
                            className="col-md-6 py-2"
                            property="country_id"
                            labelProperty="name"
                            valueProperty="id"
                            isLoading={ isLoading }
                            options={ countries }
                            onChange={ this.onSelectChange }
                            value={ inputs.country_id }
                            valid={ validation.country_id }
                            required
                        />
                        <Select
                            placeholder={ inputs.country_id > -1 ? "اختر المدينة" : "قم بإختيار الدولة اولاً" }
                            className="col-md-6 py-2"
                            property="city_id"
                            labelProperty="name"
                            valueProperty="id"
                            isLoading={ isLoading }
                            options={ cities }
                            onChange={ this.onSelectChange }
                            value={ inputs.city_id }
                            valid={ validation.city_id }
                            required
                        />
                        <div className="col-md-12 text-center py-2">
                            <button disabled={ !isFormValid(validation) || isSubmitting } type="submit" className="btn btn-md px-3">تسجيل</button>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
}

export default withContext(RegisterClient, UserContext);