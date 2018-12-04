import React, {
    Component,
    Fragment
}                 from "react";
import Axios      from "axios";
import { Prompt } from "react-router-dom";
import equal      from "deep-equal";

import Input             from "../../../components/Input";
import Textarea          from "../../../components/Textarea";
import FileInput         from "../../../components/FileInput";
import Select            from "../../../components/Select";
import FileUploadSection from "../../../components/FileUploadSection";

import UserContext from "../../../contexts/user";
import withContext from "../../../contexts/with-context";

import {
    COUNTRIES,
    CATEGORIES,
    COMPANY_UPDATE_DATA
}            from "../../../api/urls";
import axios from "../../../api/axios";

import {
    isFormValid,
    removeEmptyProperties,
    mergeUserData
} from "../../../helpers";

class ProfileCompanyData extends Component {
    constructor({ user }) {
        super();
        const {
            name        = "",
            description = "",
            city           : { id : city_id = -1 },
            country        : { id : country_id = -1 },
            category       : { id : category_id = -1 },
            specialization : { id : specialization_id = -1 },
            meta_data      : {
                images,
                license_image,
                logo,
                website,
                social_networks
            }
        } = user;

        this.state = {
            inputs : {
                name              : name,
                description       : description,
                country_id        : country_id,
                city_id           : city_id,
                category_id       : category_id,
                specialization_id : specialization_id,
                website           : website || "",
                logo              : logo || "",
                images            : images || [],
                license_image     : license_image || "",
                social_networks   : {
                    facebook : social_networks?.facebook || "",
                    twitter  : social_networks?.twitter || ""
                }
            },
            validation : {
                name        : !!name,
                description : !!description,
                website     : !!website,
                logo        : !!logo
            },

            countries       : [],
            cities          : [],
            categories      : [],
            specializations : [],
            isLoading       : true,

            isSubmitting : false,
            success      : false,
            error        : ""
        };

        this.initialInputs = {
            ...this.state.inputs,
            social_networks : { ...this.state.inputs.social_networks }
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

        const [
            { data : { data : countries } },
            { data : { data : categories } }
        ] = await Promise.all([
            axios({ ...COUNTRIES(), cancelToken : this.rct.token }),
            axios({ ...CATEGORIES(), cancelToken : this.rct.token })
        ]);

        this.setState((state) => {
            state.countries  = countries;
            state.categories = categories;
            state.isLoading  = false;

            return state;
        });
    }

    onSocialInputChange = ({ target : { value } }, property, valid) => {
        this.setState((state) => {
            state.inputs.social_networks[property] = value;
            return state;
        });
    };

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
                state.cities = item.cities || [];
            }
            if (property === "category_id") {
                state.specializations = item.specializations || [];
            }
            state.inputs[property] = item.id;
            state.validation[property] = valid;
            return state;
        });
    };

    onLogoUpload = (logo) => {
        this.setState((state) => {
            state.inputs.logo     = logo;
            state.validation.logo = true;
            return state;
        });
    };

    onLicenseUpload = (license_image) => {
        this.setState((state) => {
            state.inputs.license_image = license_image;
            return state;
        });
    };

    onImagesUpload = (images) => {
        this.setState((state) => {
            state.inputs.images = images;
            return state;
        });
    };

    onSubmit = (evt) => {
        evt.preventDefault();

        const { inputs } = this.state;

        const data = {
            ...removeEmptyProperties(inputs),
            social_networks : { ...removeEmptyProperties(inputs.social_networks) }
        };

        this.updateData(data)
            .catch((err) => this.setState({ isSubmitting : false, error : err.response?.data?.message }));
    };

    async updateData(data) {
        this.setState({ isSubmitting : true, success : false, error : "" });

        if (this.rct)
            this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        await axios({ ...COMPANY_UPDATE_DATA(), data : this.state.inputs, cancelToken : this.rct.token });

        const { specializations, categories, countries, cities } = this.state;

        this.props.updateUserData(
            mergeUserData(
                this.props.user,
                data,
                { categories, specializations, countries, cities }
            )
        );

        this.initialInputs = {
            ...this.state.inputs,
            social_networks : { ...this.state.inputs.social_networks }
        };
        this.setState({ success : true, isSubmitting : false });
    }

    render() {
        const {
            isLoading,
            inputs,
            validation,
            countries,
            cities,
            categories,
            specializations,

            isSubmitting,
            success,
            error
        } = this.state;

        const pristine = equal(inputs, this.initialInputs);

        return (
            <form onSubmit={ this.onSubmit }>
                <Prompt
                    when={ !pristine }
                    message="هل أنت متأكد ؟ يوجد لديك تعديلات غير محفوظة"
                />
                <div className="p-4 w90 m-auto text-right align-items-center d-table">
                    <div className="row">
                        <div className="col-md-12 py-2">
                            <div className="col-12 search-head">
                                <h2 className="w-100 text-right m-0 p-0 font-weight-bold">بيانات الشركة</h2>
                                <p className="w-100 m-0 p-0 text-right font-weight-bold">يجب استكمال هذه البيانات من أجل الظهور في نتائج البحث</p>
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
                            property="website"
                            onChange={ this.onInputChange }
                            className="col-md-6 py-2"
                            placeholder="الموقع الإلكتروني"
                            value={ inputs.website }
                            valid={ validation.website }
                            required
                        />
                        <Input
                            property="facebook"
                            onChange={ this.onSocialInputChange }
                            className="col-md-6 py-2"
                            placeholder="فيسبوك"
                            value={ inputs.social_networks.facebook }
                        />
                        <Input
                            property="twitter"
                            onChange={ this.onSocialInputChange }
                            className="col-md-6 py-2"
                            placeholder="تويتر"
                            value={ inputs.social_networks.twitter }
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
                        <Select
                            className="col-md-6 py-2"
                            property="category_id"
                            labelProperty="name"
                            valueProperty="id"
                            isLoading={ isLoading }
                            options={ categories }
                            onChange={ this.onSelectChange }
                            value={ inputs.category_id }
                        />
                        <Select
                            className="col-md-6 py-2"
                            property="specialization_id"
                            labelProperty="name"
                            valueProperty="id"
                            isLoading={ isLoading }
                            options={ specializations }
                            onChange={ this.onSelectChange }
                            value={ inputs.specialization_id }
                        />
                        <Textarea
                            property="description"
                            onChange={ this.onInputChange }
                            className="col-md-12 py-2"
                            placeholder="نبذة عن الشركة"
                            value={ inputs.description }
                            valid={ validation.description }
                            required
                        />
                        <FileInput
                            label="صورة الشعار"
                            className="col-md-6 py-2"
                            onChange={ this.onLogoUpload }
                            valid={ validation.logo }
                            url={ inputs.logo }
                        />
                        <FileInput
                            label="صورة الرخصة"
                            className="col-md-6 py-2"
                            onChange={ this.onLicenseUpload }
                            url={ inputs.license_image }
                        />
                    </div>
                </div>
                <FileUploadSection
                    className="col-md-12 py-2"
                    label="صور الشركة"
                    urls={ inputs.images }
                    onChange={ this.onImagesUpload }
                    multiple
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
                { error && <div className="col-12 text-center p-0 text-danger">{ error }</div> }
            </form>
        );
    }
}

export default withContext(ProfileCompanyData, UserContext);