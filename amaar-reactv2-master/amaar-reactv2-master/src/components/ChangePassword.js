import React, { Component } from "react";
import Axios                from "axios";

import Input from "../components/Input";

import { isFormValid } from "../helpers";

import { CHANGE_PASSWORD }  from "../api/urls";
import axios                from "../api/axios";

class ChangePassword extends Component {
    state = {
        inputs : {
            old_password          : "",
            password              : "",
            password_confirmation : ""
        },
        validation : {
            old_password          : false,
            password              : false,
            password_confirmation : false
        },
        isSubmitting : false,
        error        : false,
        saved        : false
    };

    onInputChange = ({ target : { value } }, property, valid) => {
        this.setState((state) => {
            state.inputs[property] = value;
            if (property === "password_confirmation") {
                state.validation[property] = this.state.inputs.password === value;
            } else {
                state.validation[property] = valid;
            }
            return state;
        });
    };

    onChangePassword = (evt) => {
        evt.preventDefault();

        this.changePassword()
            .catch((err) => {
                console.log(err);
                this.setState({ isSubmitting : false, error : true });
            });
    };

    async changePassword() {
        this.setState({ isSubmitting : true, success : false, error : false });

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { inputs : data } = this.state;

        await axios({ ...CHANGE_PASSWORD(), data, cancelToken : this.rct.token });

        this.setState({ isSubmitting : false, success : true });
    }

    render() {
        const { isSubmitting, success, error, inputs, validation } = this.state;

        return (
            <div className="p-4 w90 m-auto text-right align-items-center d-table">
                <form className="row" onSubmit={ this.onChangePassword }>
                    <div className="col-md-12 py-2">
                        <div className="col-12 search-head">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">تغيير كلمة السر</h2>
                            <p className="w-100 m-0 p-0 text-right font-weight-bold">أدخل البيانات </p>
                        </div>
                    </div>

                    <Input
                        placeholder="كلمة المرور القديمة"
                        className="col-md-12 py-2"
                        type="password"
                        property="old_password"
                        onChange={ this.onInputChange }
                        value={ inputs.old_password }
                        valid={ validation.old_password }
                        regex={ /.{8,}/ }
                        invalidMessage="كلمة المرور القديمة يجب أن تتكون من 8 أحرف"
                    />
                    <Input
                        placeholder="كلمة المرور"
                        className="col-md-6 py-2"
                        type="password"
                        property="password"
                        onChange={ this.onInputChange }
                        value={ inputs.password }
                        valid={ validation.password }
                        regex={ /.{8,}/ }
                        invalidMessage="كلمة المرور يجب أن تتكون من 8 أحرف"
                    />
                    <Input
                        placeholder="تأكيد كلمة المرور"
                        className="col-md-6 py-2"
                        type="password"
                        property="password_confirmation"
                        onChange={ this.onInputChange }
                        value={ inputs.password_confirmation }
                        valid={ validation.password_confirmation }
                        invalidMessage="يجب أن يتطابق الحقل مع كلمة المرور"
                        required
                    />
                    <div className="col-md-12 text-center py-2">
                        <button disabled={ isSubmitting || !isFormValid(validation) } className="btn btn-md px-3">تغيير</button>
                    </div>
                    { success && <div className="col-12 text-center p-0 text-success">تم تغيير كلمة المرور بنجاح</div> }
                    { error && <div className="col-12 text-center p-0 text-danger">كلمة المرور القديمة غير صحيحة</div> }
                </form>

            </div>
        );
    }
}

export default ChangePassword;