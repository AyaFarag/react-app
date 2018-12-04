import React, { Component } from "react";
import { Redirect }         from "react-router-dom";
import Axios                from "axios";
import queryString          from "query-string";

import Input from "../components/Input";

import UserContext from "../contexts/user";
import withContext from "../contexts/with-context";

import axios         from "../api/axios";
import {
    SEND_PHONE_ACTIVATION_CODE,
    ACTIVATE_PHONE
}                    from "../api/urls";

class Activate extends Component {
    constructor({ user }) {
        super();

        this.state = {
            inputs : {
                phone : user.phone,
                code  : ""
            },
            validation : {
                phone : true,
                code  : false
            },

            isSendSubmitting     : false,
            isActivateSubmitting : false,

            sendError   : "",
            sendSuccess : "",

            activateError : ""
        };
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    rct = null;

    onInputChange = ({ target : { value } }, property, valid) => {
        this.setState((state) => {
            state.inputs[property] = value;
            state.validation[property] = valid;
            return state;
        });
    };

    onSendSubmit = (evt) => {
        evt.preventDefault();

        this.send().catch((err) => {
            console.log(err);
            this.setState({ isSendSubmitting : false, sendError : err.response?.data?.message });
        });
    };

    onActivateSubmit = (evt) => {
        evt.preventDefault();

        this.activate().catch((err) => {
            console.log(err);
            this.setState({ isActivateSubmitting : false, activateError : err.response?.data?.message });
        });
    };

    async send() {
        this.setState({ sendSuccess : "", sendError : "", isSendSubmitting : true });

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { phone } = this.state.inputs;

        const { data : { message } } = await axios({ ...SEND_PHONE_ACTIVATION_CODE(), data : { phone }, cancelToken : this.rct.token });

        this.setState({ sendSuccess : message, isSendSubmitting : false });
    }

    async activate() {
        this.setState({ isActivateSubmitting : true, activateError : "" });

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { code } = this.state.inputs;

        await axios({ ...ACTIVATE_PHONE(), data : { code }, cancelToken : this.rct.token });

        this.props.updateUserData({ ...this.props.user, status : true });

        const { redirect } = queryString.parse(this.props.location.search);

        if (redirect)
            return this.props.history.push(redirect);
        return this.props.history.push("/");
    }

    render() {
        if (!this.props.isLoggedIn) return <Redirect to="/login" />;
        if (this.props.user.status == 1) return <Redirect to="/" />;

        const {
            isSendSubmitting,
            isActivateSubmitting,

            sendError,
            sendSuccess,

            activateError,

            inputs,
            validation
        } = this.state;

        return (
            <section className="slideshow w-100 d-block text-center m-0 p-0 align-items-center" id="slideshow">
                <div className=" p-4 w90 m-auto search text-right position-relative align-items-center d-table">
                    <div className="row">
                        <div className="col-md-12 py-2">
                            <div className="col-12 search-head">
                                <h2 className="w-100 text-right m-0 p-0 font-weight-bold">رساله تأكيد للبريد الإلكتروني</h2>
                                <p className="w-100 m-0 p-0 text-right font-weight-bold">برجاء فحص البريد الإلكتروني لتأكيد الأشتراك</p>
                            </div>
                        </div>
                        <form onSubmit={ this.onSendSubmit } className="col-md-6 text-center py-2">
                            <Input
                                property="phone"
                                onChange={ this.onInputChange }
                                className=""
                                placeholder="رقم الجوال"
                                value={ inputs.phone }
                                valid={ validation.phone }
                                required
                            />
                            <div className="clearfix mt-2">
                                <button disabled={ !validation.phone || isSendSubmitting } className="btn btn-md px-3">إرسال</button>
                            </div>
                            { sendSuccess && <div className="col-md-12 text-center pb-3 pt-2 text-success">{ sendSuccess }</div> }
                            { sendError && <div className="col-md-12 text-center pb-3 pt-2 text-danger">{ sendError }</div> }
                        </form>
                        <form onSubmit={ this.onActivateSubmit } className="col-md-6 text-center py-2">
                            <Input
                                property="code"
                                onChange={ this.onInputChange }
                                className=""
                                placeholder="كود التفعيل"
                                value={ inputs.code }
                                valid={ validation.code }
                                invalidMessage="يجب أن يتكون كود التفعيل من 4 أرقام"
                                regex={ /^\d{4}$/ }
                            />
                            <div className="clearfix mt-2">
                                <button disabled={ !validation.code || isActivateSubmitting } className="btn btn-md px-3">إرسال</button>
                            </div>
                            { activateError && <div className="col-md-12 text-center pb-3 pt-2 text-danger">{ activateError }</div> }
                        </form>
                    </div>
                </div>
            </section>
        );
    }
}


export default withContext(Activate, UserContext);