import React, { Component } from "react";
import { Redirect, Link }   from "react-router-dom";
import Axios                from "axios";
import queryString          from "query-string";

import Input  from "../components/Input";

import { LOGIN } from "../api/urls";
import axios     from "../api/axios";

import UserContext from "../contexts/user";
import withContext from "../contexts/with-context";

import { EMAIL_REGEX, isFormValid, getDeviceToken } from "../helpers";

class Login extends Component {

    state = {
        inputs : {
            email        : "",
            password     : "",
            device_token : null
        },

        validation : {
            email    : false,
            password : false
        },

        isSubmitting : false,
        error        : ""
    };

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    async login() {
        this.setState({ isSubmitting : true, error : "" });
        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const data = { ...this.state.inputs, device_token : await getDeviceToken() };

        const { data : { data : user } } = await axios({ ...LOGIN(), data, cancelToken : this.rct.token });

        this.props.updateUserData(user);

        const { redirect } = queryString.parse(this.props.location.search);

        if (redirect)
            return this.props.history.push(redirect);
        return this.props.history.push("/");
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

        this.login().catch((err) => {
            console.log(err);
            this.setState({ isSubmitting : false, error : err.response?.data?.error });
        });
    };

    // Request cancellation token
    rct = null;

    render() {
        if (this.props.isLoggedIn) return <Redirect to="/" />

        const { isLoading, inputs, validation, isSubmitting, error } = this.state;

        return (
            <section className="slideshow w-100 d-block text-center m-0 p-0 align-items-center" id="slideshow">
                <div className="p-4 w90 m-auto search text-right position-relative align-items-center d-table">
                    <form className="row" onSubmit={ this.onSubmit }>
                        <div className="col-md-12 py-2">
                            <div className="col-12 search-head">
                                <h2 className="w-100 text-right m-0 p-0 font-weight-bold">تسجيل الدخول</h2>
                                <p className="w-100 m-0 p-0 text-right font-weight-bold">أدخل البيانات صحيحه</p>
                            </div>
                        </div>
                        <Input
                            property="email"
                            onChange={ this.onInputChange }
                            className="col-md-6 py-2"
                            placeholder="البريد الإلكتروني"
                            value={ inputs.email }
                            invalidMessage="البريد الالكتروني غير صالح"
                            regex={ EMAIL_REGEX }
                            valid={ validation.email }
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
                        <div className="col-md-12 text-center py-2">
                            <Link to="forget">نسيت كلمة المرور ؟ </Link>
                        </div>
                        <div className="col-md-12 text-center py-2">
                            <button disabled={ !isFormValid(validation) || isSubmitting } type="submit" className="btn btn-md px-3">تسجيل الدخول</button>
                        </div>
                        { error && <div className="col-md-12 text-center pb-3 pt-2 text-danger">{ error }</div> }
                    </form>
                </div>
            </section>
        );
    }
}

export default withContext(Login, UserContext);