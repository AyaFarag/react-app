import React, { Component } from "react";
import Axios                from "axios";

import Textarea from "./Textarea";
import Rating   from "./Rating";

import { isFormValid } from "../helpers";

import { CLIENT_POST_COMMENT } from "../api/urls";
import axios                   from "../api/axios";

class CommentForm extends Component {
    state = {
        inputs : {
            comment : "",
            rating  : 0
        },
        validation : {
            comment : false,
            rating  : false
        },

        isSubmitting : false,
        error        : ""
    };


    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    rct = null;

    onRate = (rating) => {
        this.setState((state) => {
            state.inputs.rating = rating;
            state.validation.rating = true;
            return state;
        });
    };

    onSubmit = (evt) => {
        evt.preventDefault();

        this.postComment().catch((err) => {
            console.log(err);
            this.setState({ isSubmitting : false, error : err.response?.data?.message });
        });
    };

    onInputChange = ({ target : { value } }, property, valid) => {
        this.setState((state) => {
            state.inputs[property] = value;
            state.validation[property] = valid;
            return state;
        });
    };

    async postComment() {
        this.setState({ isSubmitting : true, error : "" });

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const data = { ...this.state.inputs, company_id : this.props.companyId };

        await axios({ cancelToken : this.rct.token, ...CLIENT_POST_COMMENT(), data });

        this.setState({ isSubmitting : false });

        this.props.reloadComments();
    }

    render() {
        const { inputs, validation, isSubmitting, error } = this.state;

        return (
            <form onSubmit={ this.onSubmit } className="col-md-6 text-center py-2 mx-auto">
                <Textarea
                    onChange={ this.onInputChange }
                    placeholder="قم بإدخال  التعليق"
                    property="comment"
                    value={ inputs.comment }
                    valid={ validation.comment }
                    required
                />
                <Rating
                    value={ inputs.rating }
                    onChange={ this.onRate }
                />
                <div className="clearfix mt-2">
                    <button className="btn btn-md px-3" disabled={ !isFormValid(validation) || isSubmitting }>علق</button>
                </div>
                { error && <div className="col-md-12 text-center pb-3 pt-2 text-danger">{ error }</div> }
            </form>
        );
    }
}

export default CommentForm;