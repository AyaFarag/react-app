import React, { Component } from "react";
import Axios                from "axios";
import equal                from "deep-equal";
import { Prompt }           from "react-router-dom";

import Input             from "../components/Input";
import Textarea          from "../components/Textarea";
import Select            from "../components/Select";
import FileUploadSection from "../components/FileUploadSection";

import { EMAIL_REGEX, isFormValid, ROLES } from "../helpers";

import UserContext from "../contexts/user";
import withContext from "../contexts/with-context";

import {
    CATEGORIES,
    CONSULT
}            from "../api/urls";
import axios from "../api/axios";

class Consultation extends Component {
    constructor({ user }) {
        super();

        const { name, email, role, phone } = user || {};

        this.state = {
            inputs : {
                name              : name || "",
                message           : "",
                image             : [],
                category_id       : -1,
                specialization_id : -1,
                phone             : phone || "",
                email             : email || "",
                role              : role || -1
            },
            validation : {
                name              : !!name,
                message           : false,
                specialization_id : false,
                phone             : !!phone,
                email             : !!email,
                role              : !!role
            },

            categories      : [],
            specializations : [],
            isLoading       : true,

            isSubmitting : false,

            success : false
        };

        this.initialInputs = {
            name              : name || "",
            message           : "",
            image             : [],
            category_id       : -1,
            specialization_id : -1,
            phone             : phone || "",
            email             : email || "",
            role              : role || -1
        };
    }
    

    rct = null;

    componentDidMount() {
        this.fetchData().catch(console.log);
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
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
            if (property === "category_id") {
                state.specializations    = item.specializations || [];
            }
            if (property === "role")
                state.inputs[property] = item.value;
            else
                state.inputs[property] = item.id;

            state.validation[property] = valid;
            return state;
        });
    };

    onImageUpload = (image) => {
        this.setState((state) => {
            state.inputs.image     = image;
            state.validation.image = true;
            return state;
        });
    };

    async consult() {
        this.setState({ isSubmitting : true })

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        await axios({ ...CONSULT(), data : this.state.inputs, cancelToken : this.rct.token });

        this.setState({ isSubmitting : false, success : true });
    }

    onSubmit = (evt) => {
        evt.preventDefault();

        this.consult().catch((err) => {
            console.log(err);
            this.setState({ isSubmitting : false });
        })
    };

    async fetchData() {
        if (this.rct)
            this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { data : { data : categories } } = await axios({ ...CATEGORIES(), cancelToken : this.rct.token });

        this.setState((state) => {
            state.categories         = categories;
            state.isLoading          = false;
            state.inputs.category_id = -1;
            return state;
        });
    }


    render() {
        const {
            isSubmitting,
            isLoading,

            inputs,
            validation,

            categories,
            specializations,

            success
        } = this.state;

        if (success) {
            return (
                <section className="w-100 d-block pt-5 text-center m-0 align-items-center contact-us">
                    <div className="pt-4 w90 m-auto  text-right align-items-center ">
                        <div className="col-12 search-head mb-3">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">إستشارات عمار</h2>
                        </div>
                        <div className="row w-100 m-0 search-result">
                            <h4 className="col-12 text-center text-success mt-5 mb-5">شكرا لكم سيتم الرد عليكم قريبا</h4>
                        </div>
                    </div>
                </section>
            );
        }

        const pristine = equal(inputs, this.initialInputs);

        return (
            <section className="w-100 d-block pt-5 text-center m-0 align-items-center contact-us">
                <Prompt
                    when={ !pristine }
                    message="هل أنت متأكد ؟ يوجد لديك تعديلات غير محفوظة"
                />
                <form onSubmit={ this.onSubmit }>
                    <div className="pt-4 w90 m-auto  text-right align-items-center ">
                        <div className="col-12 search-head mb-3">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">إستشارات عمار</h2>
                        </div>
                        <div className="row">
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
                                invalidMessage="البريد الإلكتروني غير صالح"
                                regex={ EMAIL_REGEX }
                                valid={ validation.email }
                            />
                            <Select
                                placeholder="اختر الفئة"
                                className="col-md-6 py-2"
                                property="category_id"
                                labelProperty="name"
                                valueProperty="id"
                                isLoading={ isLoading }
                                options={ categories }
                                onChange={ this.onSelectChange }
                                value={ inputs.category_id }
                                valid={ validation.category_id }
                                required
                            />
                            <Select
                                placeholder={ inputs.category_id > -1 ? "اختر التخصص" : "قم بإختيار الفئة اولاً" }
                                className="col-md-6 py-2"
                                property="specialization_id"
                                labelProperty="name"
                                valueProperty="id"
                                isLoading={ isLoading }
                                options={ specializations }
                                onChange={ this.onSelectChange }
                                value={ inputs.specialization_id }
                                valid={ validation.specialization_id }
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
                            <Select
                                placeholder="نوع العضوية"
                                className="col-md-6 py-2"
                                property="role"
                                labelProperty="label"
                                valueProperty="value"
                                isLoading={ isLoading }
                                options={ ROLES }
                                onChange={ this.onSelectChange }
                                value={ inputs.role }
                                valid={ validation.role }
                                required
                            />
                            <Input
                                property="phone"
                                onChange={ this.onInputChange }
                                className="col-md-6 py-2"
                                placeholder="رقم الجوال"
                                value={ inputs.phone }
                                valid={ validation.phone }
                                required
                            />
                        </div>
                    </div>
                    <FileUploadSection
                        className="col-md-12 py-2"
                        label="صورة مرفقة"
                        urls={ inputs.image }
                        onChange={ this.onImageUpload }
                        multiple
                    />

                    <div className="w90 mx-auto py-3 confirmupload">
                        <button disabled={ !isFormValid(validation) || isSubmitting } className="btn btn-md">تحميل</button>
                    </div>
                </form>
            </section>
        );
    }
}



export default withContext(Consultation, UserContext);