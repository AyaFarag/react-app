import React, { Component } from "react";
import queryString          from "query-string";
import Axios                from "axios";

import LoadableContainer from "../../../containers/LoadableContainer";
import Paginator         from "../../../components/Paginator";

import Comment from "../../../containers/Comment";

import UserContext from "../../../contexts/user";
import withContext from "../../../contexts/with-context";

import { COMPANY_COMMENTS } from "../../../api/urls";
import axios                from "../../../api/axios";

class ProfileCompanyComments extends Component {
    state = { data : [], links : null, meta : null, isLoading : true };
    rct = null;

    componentDidMount() {
        this.fetchData().catch(console.log);
    }

    componentDidUpdate({ location }) {
        if (location.search !== this.props.location.search)
            this.fetchData().catch(console.log);
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    async fetchData() {
        this.setState({ isLoading : true });

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const params = queryString.parse(this.props.location.search);

        const { data : { data, meta, links } } = await axios({ ...COMPANY_COMMENTS(this.props.user.id), params, cancelToken : this.rct.token });

        this.setState({
            isLoading : false,
            data,
            meta,
            links
        });
    }

    renderComments() {
        const { data } = this.state;

        if (!data.length) {
            return (
                <div className="row w-100 m-0 search-result">
                    <h4 className="col-12 text-center text-danger mt-5 mb-5">لا يوجد لديك تعليقات</h4>
                </div>
            );
        }

        return data.map(comment => <Comment key={ comment.id } { ...comment } />);
    }

    render() {
        const { isLoading, links, meta } = this.state;
        const { pathname, search } = this.props.location;

        return (
            <div className="w90 m-auto text-right align-items-center d-table">
                <div className="row">
                    <div className="col-md-12 py-2">
                        <div className="col-12 search-head">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">التعليقات</h2>
                        </div>
                    </div>
                    <LoadableContainer isLoading={ isLoading }>
                        <div className="col-12">
                            { this.renderComments() }
                        </div>
                        <Paginator
                            links={ links }
                            meta={ meta }
                            url={ pathname }
                            search={ search }
                        />
                    </LoadableContainer>
                </div>
            </div>
        );
    }
}

export default withContext(ProfileCompanyComments, UserContext);