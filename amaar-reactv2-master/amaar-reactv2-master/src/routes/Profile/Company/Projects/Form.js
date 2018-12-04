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

import {
    COMPANY_GET_PROJECT,
    COMPANY_CREATE_PROJECT,
    COMPANY_UPDATE_PROJECT
}            from "../../../../api/urls";
import axios from "../../../../api/axios";

import {
    isFormValid,
    removeEmptyProperties,
    scrollToElem
} from "../../../../helpers";


class ProfileCompanyProjectsForm extends Component {
    static initialState = {
        inputs     : {
            name        : "",
            description : "",
            images      : []
        },
        validation : {
            name        : false,
            description : false,
            images      : false
        }
    };
    constructor({ data }) {
        super();

        this.state = {
            inputs : { ...ProfileCompanyProjectsForm.initialState.inputs },
            validation : { ...ProfileCompanyProjectsForm.initialState.validation },
            success         : false,
            isUpdateLoading : false, // is the old data (before updating) loading ?
            isSubmitting    : false
        };
        this.initialInputs = { ...ProfileCompanyProjectsForm.initialState.inputs };
    }

    $container = null;

    componentDidMount() {
        if (this.props.match.params.id) {
            this.fetchProjectData().catch(console.log);
            scrollToElem(this.$container);
        }
    }

    componentDidUpdate({ match : { params } }) {
        const { id } = this.props.match.params;
        if (id !== params.id) {
            if (id) {
                this.fetchProjectData().catch(console.log);
            } else {
                this.setState({
                    inputs : { ...ProfileCompanyProjectsForm.initialState.inputs },
                    validation : { ...ProfileCompanyProjectsForm.initialState.validation },
                    success         : false,
                    isLoading       : false,
                    isUpdateLoading : false
                });
                this.initialInputs = { ...ProfileCompanyProjectsForm.initialState.inputs };
            }
        }
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    async fetchProjectData() {
        this.setState({
            inputs : { ...ProfileCompanyProjectsForm.initialState.inputs },
            validation : { ...ProfileCompanyProjectsForm.initialState.validation },
            isUpdateLoading : true,
            success         : false
        }, () => scrollToElem(this.$container));

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { id } = this.props.match.params;
        const { data : { data : project } } = await axios({ ...COMPANY_GET_PROJECT(id), cancelToken : this.rct.token });

        this.initialInputs = {
            name        : project.name,
            description : project.description,
            images      : project.images
        };

        this.setState({
            inputs : { ...this.initialInputs },
            validation : {
                name        : true,
                description : true,
                images      : true
            },

            isUpdateLoading : false
        });
    }


    onImagesUpload = (images) => {
        this.setState((state) => {
            state.inputs.images     = images;
            state.validation.images = true;
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


    onSubmit = (evt) => {
        evt.preventDefault();

        this.createOrUpdate().catch(console.log);
    };

    async createOrUpdate() {
        this.setState({ isSubmitting : true, success : false });

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const data = removeEmptyProperties(this.state.inputs);

        if (this.props.match.params.id)
            await axios({ ...COMPANY_UPDATE_PROJECT(this.props.match.params.id), data, cancelToken : this.rct.token });
        else
            await axios({ ...COMPANY_CREATE_PROJECT(), data, cancelToken : this.rct.token });

        this.initialInputs = { ...ProfileCompanyProjectsForm.inputs };
        
        this.setState({
            inputs : { ...ProfileCompanyProjectsForm.initialState.inputs },
            validation : { ...ProfileCompanyProjectsForm.initialState.validation },
            success : false,
            isSubmitting : false,
            success      : true
        });


        this.props.reloadProjects();

        this.props.history.push("/profile/projects");
    }

    showForm = () => {
        this.setState({ success : false });
    };


    render() {
        const {
            inputs,
            validation,
            isUpdateLoading,
            isSubmitting,
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
                        <button className="btn btn-md" onClick={ this.showForm }>إضافة مشروع آخر</button>
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
                                        ? "التعديل على مشروع"
                                        : "إضافة مشروع"
                                }
                            </h2>
                        </div>
                        <div className="row w-100 my-3">
                            <Input
                                onChange={ this.onInputChange }
                                className="col-md-12 py-2"
                                property="name"
                                value={ inputs.name }
                                valid={ validation.name }
                                placeholder="اسم المشروع"
                                isLoading={ isUpdateLoading }
                                required
                            />
                            <Textarea
                                onChange={ this.onInputChange }
                                className="col-md-12 py-2"
                                property="description"
                                value={ inputs.description }
                                valid={ validation.description }
                                placeholder="نبذة عن المشروع"
                                isLoading={ isUpdateLoading }
                                required
                            />
                        </div>
                    </div>
                </div>
                <FileUploadSection
                    className="col-md-12 py-2"
                    label="صور المشروع"
                    urls={ inputs.images }
                    onChange={ this.onImagesUpload }
                    isLoading={ isUpdateLoading }
                    multiple
                />
                <div className="w90 mx-auto py-3 confirmupload">
                    <button type="submit" className="btn btn-md" disabled={ !isFormValid(validation) || isSubmitting || pristine }>{ isEdit ? "تعديل" : "إضافة" }</button>
                </div>
                { success && <div className="col-md-12 text-center pb-3 pt-2 text-success">تم الحفظ بنجاح</div> }
            </form>
        );
    }
}

export default withRouter(ProfileCompanyProjectsForm);