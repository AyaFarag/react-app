import React, {
    Component,
    Fragment
}                     from "react";
import { Prompt }     from "react-router-dom";
import { withRouter } from "react-router";
import Axios          from "axios";
import equal          from "deep-equal";

import FileUploadSection from "../../../../components/FileUploadSection";
import Input             from "../../../../components/Input";
import Textarea          from "../../../../components/Textarea";
import Select            from "../../../../components/Select";

import {
    COUNTRIES,
    COMPANY_GET_AD,
    COMPANY_CREATE_AD,
    COMPANY_UPDATE_AD
}            from "../../../../api/urls";
import axios from "../../../../api/axios";

import {
    isFormValid,
    removeEmptyProperties,
    scrollToElem
} from "../../../../helpers";

const DURATIONS = [
    { id : "DAY", name : "يوم" },
    { id : "WEEK", name : "أسبوع" },
    { id : "MONTH", name : "شهر" },
    { id : "SIXMONTHES", name : "6 شهور" },
    { id : "YEAR", name : "سنة" },
];

class ProfileCompanyAdsForm extends Component {
    static initialState = {
        inputs : {
            title      : "",
            content    : "",
            image      : "",
            duration   : -1,
            country_id : -1,
            city_id    : -1
        },
        validation : {
            title      : false,
            content    : false,
            duration   : false,
            city_id    : false,
            country_id : false
        }
    };

    constructor({ data }) {
        super();

        this.state = {
            inputs : { ...ProfileCompanyAdsForm.initialState.inputs },
            validation : { ...ProfileCompanyAdsForm.initialState.validation },
            success : false,

            isLoading : true,
            isUpdateLoading : false,

            countries : [],
            cities    : [],
            durations : DURATIONS,

            isSubmitting : false
        };

        this.initialInputs = { ...ProfileCompanyAdsForm.initialState.inputs };
    }

    $container = null;

    componentDidMount() {
        // the usage of a promise over async await is because this method is called by react with no error handing which would result in swallowed errors
        this.fetchData().then(() => {
            if (this.props.match.params.id) {
                this.fetchAdData().catch(console.log);
                scrollToElem(this.$container);
            }
        }).catch(console.log);

    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    componentDidUpdate({ match : { params } }) {
        const { id } = this.props.match.params;
        if (id !== params.id) {
            if (id) {
                this.fetchAdData().catch(console.log);
            } else {
                this.setState({
                    inputs : { ...ProfileCompanyAdsForm.initialState.inputs },
                    validation : { ...ProfileCompanyAdsForm.initialState.validation },
                    success         : false,
                    isLoading       : false,
                    isUpdateLoading : false
                });
                this.initialInputs = { ...ProfileCompanyAdsForm.initialState.inputs };
            }
        }
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    async fetchData() {
        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { data : { data : countries } } = await axios({ ...COUNTRIES(), cancelToken : this.rct.token });

        if (this.props.match.params.id) {
            await this.fetchAdData({ countries });
        }
        this.setState({ isLoading : false, countries });
    }

    async fetchAdData() {
        this.setState({
            inputs : { ...ProfileCompanyAdsForm.initialState.inputs },
            validation : { ...ProfileCompanyAdsForm.initialState.validation },
            isUpdateLoading : true,
            success : false
        }, () => scrollToElem(this.$container));

        const { id } = this.props.match.params;
        const { data : { data : ad } } = await axios({ ...COMPANY_GET_AD(id), cancelToken : this.rct.token });
        this.initialInputs = {
            title      : ad.title,
            content    : ad.content,
            image      : ad.image || "",
            duration   : ad.duration,
            country_id : ad.country.id,
            city_id    : ad.city.id
        };
        this.setState({
            inputs : { ...this.initialInputs },
            validation : {
                title      : true,
                content    : true,
                duration   : true,
                city_id    : true,
                country_id : true
            },

            isUpdateLoading : false,

            cities : this.state.countries.filter(country => country.id === ad.country.id)[0]?.cities || []
        });
    }


    onImageUpload = ([image]) => {
        this.setState((state) => {
            state.inputs.image = image;
            return state;
        });
    };

    onInputChange = ({ target : { value } }, property, valid) => {
        this.setState((state) => {
            state.inputs[property]     = value;
            state.validation[property] = valid;
            return state;
        });
    };

    onSelectChange = (item, property, valid) => {
        if (property === "country_id") {
            this.setState((state) => {
                state.cities         = item.cities || [];
                state.inputs.city_id = -1;
                return state;
            });
        }

        this.setState((state) => {
            state.inputs[property]     = item.id;
            state.validation[property] = valid;
            return state;
        });
    };

    onSubmit = (evt) => {
        evt.preventDefault();

        this.createOrUpdate().catch((err) => {
            this.setState({ isSubmitting : false });
        });
    };

    async createOrUpdate() {
        this.setState({ isSubmitting : true, success : false });

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const data = removeEmptyProperties(this.state.inputs);

        if (this.props.match.params.id)
            await axios({ ...COMPANY_UPDATE_AD(this.props.match.params.id), data, cancelToken : this.rct.token });
        else
            await axios({ ...COMPANY_CREATE_AD(), data, cancelToken : this.rct.token });

        this.initialInputs = { ...ProfileCompanyAdsForm.initialState.inputs };

        this.setState({
            inputs : { ...ProfileCompanyAdsForm.initialState.inputs },
            validation : { ...ProfileCompanyAdsForm.initialState.validation },
            success : false,
            cities : [],

            isSubmitting : false,
            success      : true
        });

        this.props.reloadAds();

        this.props.history.push("/profile/ads");
    }

    showForm = () => {
        this.setState({ success : false });
    };


    render() {
        const {
            inputs,
            validation,
            countries,
            cities,
            durations,
            isSubmitting,
            isLoading,
            isUpdateLoading,
            success
        } = this.state;

        const isEdit = this.props.match.params.id;

        if (success) {
            return (
                <Fragment>
                    <div className="row w-100 m-0 search-result">
                        <h4 className="col-12 text-center text-success mt-5 mb-5">
                            { isEdit ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح" }
                        </h4>
                    </div>
                    <div className="w90 mx-auto py-3 confirmupload">
                        <button className="btn btn-md" onClick={ this.showForm }>إضافة إعلان آخر</button>
                    </div>
                </Fragment>
            );
        }

        const pristine = equal(inputs, this.initialInputs);

        return (
            <form onSubmit={ this.onSubmit } ref={ elem => this.$container = elem }>
                <Prompt
                    when={ !pristine }
                    message="هل أنت متأكد ؟ يوجد لديك تعديلات غير محفوظة"
                />
                <div className="col-12 p-4 w90 m-auto text-right align-items-center">
                    <div className="row">
                        <div className="col-12 search-head">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">
                                {
                                    isEdit
                                        ? "التعديل على الإعلان"
                                        : "إضافة إعلان"
                                }
                            </h2>
                        </div>
                        <div className="row w-100 my-3">
                            <Input
                                onChange={ this.onInputChange }
                                className="col-md-6 py-2"
                                property="title"
                                value={ inputs.title }
                                valid={ validation.title }
                                placeholder="عنوان الإعلان"
                                isLoading={ isUpdateLoading }
                                required
                            />
                            <Select
                                placeholder="المدة"
                                className="col-md-6 py-2"
                                property="duration"
                                labelProperty="name"
                                valueProperty="id"
                                options={ this.state.durations }
                                onChange={ this.onSelectChange }
                                value={ this.state.inputs.duration }
                                valid={ validation.duration }
                                isLoading={ isUpdateLoading }
                                required
                            />
                            <Select
                                placeholder="اختر الدولة"
                                className="col-md-6 py-2"
                                property="country_id"
                                labelProperty="name"
                                valueProperty="id"
                                options={ this.state.countries }
                                onChange={ this.onSelectChange }
                                value={ this.state.inputs.country_id }
                                valid={ validation.country_id }
                                isLoading={ isLoading || isUpdateLoading }
                                required
                            />
                            <Select
                                placeholder={
                                    inputs.country_id > -1
                                        ? "اختر المدينة"
                                        : "اختر الدولة اولاً"
                                }
                                className="col-md-6 py-2"
                                property="city_id"
                                labelProperty="name"
                                valueProperty="id"
                                options={ this.state.cities }
                                onChange={ this.onSelectChange }
                                value={ this.state.inputs.city_id }
                                valid={ validation.city_id }
                                isLoading={ isLoading || isUpdateLoading }
                                required
                            />
                            <Textarea
                                onChange={ this.onInputChange }
                                className="col-md-12 py-2"
                                property="content"
                                value={ inputs.content }
                                valid={ validation.content }
                                placeholder="محتوى"
                                isLoading={ isUpdateLoading }
                                required
                            />
                        </div>
                    </div>
                </div>
                <FileUploadSection
                    className="col-md-12 py-2"
                    label="صورة الإعلان"
                    urls={ inputs.image ? [inputs.image] : [] }
                    onChange={ this.onImageUpload }
                    isLoading={ isUpdateLoading }
                />
                <div className="w90 mx-auto py-3 confirmupload">
                    <button type="submit" className="btn btn-md" disabled={ !isFormValid(validation) || isSubmitting || pristine }>{ isEdit ? "تعديل" : "إضافة" }</button>
                </div>
                { success && <div className="col-md-12 text-center pb-3 pt-2 text-success">تم الحفظ بنجاح</div> }
            </form>
        );
    }
}

export default withRouter(ProfileCompanyAdsForm);