import React, { Component } from "react";
import Axios                from "axios";

import Input from "../components/Input";

import { EMAIL_REGEX } from "../helpers";

import { FORGET } from "../api/urls";
import axios      from "../api/axios";

class Forget extends Component {

	state = {
        inputs : { email : "" },

        validation : { email : false },

        isSubmitting : false,
        success      : "",
        error        : ""
    };

	onInputChange = ({ target : { value } }, property, valid) => {
        this.setState((state) => {
            state.inputs[property] = value;
            state.validation[property] = valid;
            return state;
        });
    };

	onSubmit = (evt) => {
        evt.preventDefault();

        this.send().catch((err) => {
            console.log(err);
            const data = err.response?.data;
            this.setState({ isSubmitting : false, error : data?.error || (data?.errors?.email || [])[0] });
        });
    };

    async send() {
        this.setState({ isSubmitting : true, error : "", success : "" });

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { data : { message } } = await axios({ ...FORGET(), data : this.state.inputs, cancelToken : this.rct.token });

        this.setState({ success : message });
    }

	render() {
		const { validation, inputs, error, success, isSubmitting } = this.state;

		return (
			<section className="slideshow w-100 d-block text-center m-0 p-0 align-items-center" id="slideshow">
			    <div className=" p-4 w90 m-auto search text-right position-relative align-items-center d-table">
			        <form className="row" onSubmit={ this.onSubmit }>
			            <div className="col-md-12 py-2">
			                <div className="col-12 search-head">
			                    <h2 className="w-100 text-right m-0 p-0 font-weight-bold">نسيت كلمة المرور</h2>
			                    <p className="w-100 m-0 p-0 text-right font-weight-bold">قم بإدخال الايميل الخاص بك</p>
			                </div>
			            </div>
			            <Input
                            property="email"
                            onChange={ this.onInputChange }
                            className="col-md-6 py-2 mx-auto"
                            placeholder="البريد الإلكتروني"
                            value={ inputs.email }
                            invalidMessage="البريد الالكتروني غير صالح"
                            regex={ EMAIL_REGEX }
                            valid={ validation.email }
                        />
			            <div className="col-md-12 text-center py-2">
			                <button disabled={ isSubmitting || !validation.email } className="btn btn-md px-3">إرسال</button>
			            </div>
			            { success && <div className="col-md-12 text-center pb-3 pt-2 text-success">{ success }</div> }
			            { error && <div className="col-md-12 text-center pb-3 pt-2 text-danger">{ error }</div> }
			        </form>
			    </div>
			</section>
		);
	}
}

export default Forget;