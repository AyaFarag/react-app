import React, { Component } from "react";

import Input    from "../components/Input";
import Textarea from "../components/Textarea";

import SettingsContext from "../contexts/settings";
import UserContext     from "../contexts/user";
import withContext     from "../contexts/with-context";

import { EMAIL_REGEX } from "../helpers";

class Contact extends Component {
    constructor({ user }) {
        super();

        const { name, email } = user || {};

        this.state = {
            inputs : {
                name    : name || "",
                message : "",
                email   : email || ""
            },
            validation : {
                name    : !!name,
                message : false,
                email   : !!email
            },
            isSubmitting : false,
            success : false
        };
    }

    onInputChange = ({ target : { value } }, property, valid) => {
        this.setState((state) => {
            state.inputs[property] = value;
            state.validation[property] = valid;
            return state;
        });
    };

    render() {
        const { inputs, validation } = this.state;
        const { settings } = this.props;

        return (
            <section className="w-100 d-block pt-5 text-center m-0 align-items-center contact-us">
                <div className="pt-4 w90 m-auto  text-right align-items-center ">
                    <div className="row">
                        <div className="col-md-6 py-2">
                            <div className="col-12 search-head">
                                <h2 className="w-100 text-right m-0 p-0 font-weight-bold">اتصل بنا</h2>
                            </div>
                            <div className="col-12 pt-3">
                                <h6 className="w-100 font-weight-bold">العنوان :</h6>
                                <p className="w-100 font-weight-normal"><img src="/images/address.png"/>{ settings.address }</p>

                            </div>
                            <div className="col-12 pt-3">
                                <h6 className="w-100 font-weight-bold">التليفون :</h6>
                                <p className="w-100 font-weight-normal"><img src="images/phone.png"/>{ settings.phone }</p>

                            </div>
                            <div className="col-12 pt-3">
                                <h6 className="w-100 font-weight-bold">الإيميل :</h6>
                                <p className="w-100 font-weight-normal"><img src="images/email.png"/>{ settings.email }</p>

                            </div>
                        </div>
                        <div className="col-md-6 py-2">
                            <Input
                                property="name"
                                onChange={ this.onInputChange }
                                className="w-100 p-2 mb-3 font-weight-bold"
                                placeholder="الإسم"
                                value={ inputs.name }
                                valid={ validation.name }
                                required
                            />
                            <Input
                                property="email"
                                onChange={ this.onInputChange }
                                className="w-100 p-2 mb-3 font-weight-bold"
                                placeholder="البريد الإلكتروني"
                                value={ inputs.email }
                                valid={ validation.email }
                                invalidMessage="البريد الإلكتروني غير صالح"
                                regex={ EMAIL_REGEX }
                                required
                            />
                            <Textarea
                                property="message"
                                onChange={ this.onInputChange }
                                className="col-md-12 py-2"
                                placeholder="الرسالة"
                                value={ inputs.message }
                                valid={ validation.message }
                                required
                            />

                            <div className="text-center p-2 pt-0">
                                <a role="button" className="w-100 btn btn-md my-0 px-3">إرسـال</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ width : "100%" }}>
                    <div className="location-map">
                        <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1ahW7grSXsHahH20hE-7shplJvQMaZ8E-" width="100%"
                                height="400"></iframe>
                    </div>
                </div>
            </section>
        );
    }
}

export default withContext(withContext(Contact, SettingsContext), UserContext);