import React, {
    Component,
    Fragment
}                   from "react";
import Axios        from "axios";
import { Redirect } from "react-router-dom";
import { Helmet }   from "react-helmet";

import FileUploadSection from "../components/FileUploadSection";
import CommentForm       from "../components/CommentForm";

import LoadableContainer from "../containers/LoadableContainer";
import CompanyData       from "../containers/CompanyData";
import CompanyProjects   from "../containers/CompanyProjects";
import CompanyWorkDays   from "../containers/CompanyWorkDays";
import CompanyComments   from "../containers/CompanyComments";


import UserContext from "../contexts/user";
import withContext from "../contexts/with-context";


import {
    COMPANY_DATA,
    COMPANY_PROJECTS,
    COMPANY_COMMENTS
}            from "../api/urls";
import axios from "../api/axios";

import { scrollToElem } from "../helpers";

class Company extends Component {
    state = {
        data            : null,
        comments        : null,
        commentable     : false,
        projects        : null,

        isLoading         : true,
        isCommentsLoading : true,
        isProjectsLoading : true,

        hasMoreComments       : false,
        isLoadingMoreComments : false,


        hasMoreProjects       : false,
        isLoadingMoreProjects : false
    };
    commentsPage = 1;
    projectsPage = 1;
    rct          = null;
    rctProjects  = null;
    rctComments  = null;
    $container   = null;

    componentDidMount() {
        this.fetchData().catch(console);
        scrollToElem(this.$container);
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    async fetchData() {
        const { id } = this.props.match.params;

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();
        const [
            { data : { data } },
            { data : { data : projects, links : projectsLinks } },
            { data : { data : comments, links : commentsLinks, commentable } }
        ] = await Promise.all([
            axios({ cancelToken : this.rct.token, ...COMPANY_DATA(id) }),
            axios({ cancelToken : this.rct.token, ...COMPANY_PROJECTS(id) }),
            axios({ cancelToken : this.rct.token, ...COMPANY_COMMENTS(id) })
        ]);

        console.log(commentable);

        this.setState({
            hasMoreComments   : !!commentsLinks.next,
            hasMoreProjects   : !!projectsLinks.next,
            isLoading         : false,
            isCommentsLoading : false,
            isProjectsLoading : false,
            data,
            projects,
            comments,
            commentable
        });
    }

    async loadComments(more = false) {
        if (!more) this.setState({ isCommentsLoading : true });
        else this.setState({ isLoadingMoreComments : true });


        const { id } = this.props.match.params;

        if (this.rctComments) this.rctComments.cancel();

        this.rctComments = Axios.CancelToken.source();

        this.commentsPage = more ? this.commentsPage + 1 : 1;

        const { data : { data, links, commentable } } = await axios({ cancelToken : this.rctComments.token, ...COMPANY_COMMENTS(id), params : { page : this.commentsPage } });

        const comments = [...this.state.comments, ...data];

        this.setState({
            hasMoreComments       : !!links.next,
            isLoadingMoreComments : false,
            isCommentsLoading     : false,
            comments,
            commentable
        });
    }

    async loadProjects() {
        this.setState({ isLoadingMoreProjects : true });


        const { id } = this.props.match.params;

        if (this.rctProjects) this.rct.cancel();

        this.rctProjects = Axios.CancelToken.source();

        this.projectsPage = this.projectsPage + 1;

        const { data : { data, links, commentable } } = await axios({ cancelToken : this.rctProjects.token, ...COMPANY_PROJECTS(id), params : { page : this.projectsPage } });

        const projects = [...this.state.projects, ...data];

        this.setState({
            hasMoreProjects       : !!links.next,
            isLoadingMoreProjects : false,
            isProjectsLoading     : false,
            projects
        });
    }

    onLoadComments = () => {
        this.loadComments(false);
    };

    onLoadMoreComments = () => {
        this.loadComments(true);
    };


    onLoadMoreProjects = () => {
        this.loadProjects();
    };

    render() {
        if (!this.props.isLoggedIn) {
            return <Redirect to={ `/login?redirect=${this.props.location.pathname}` } />
        }

        const {
            isLoading,
            data,
            comments,
            projects,
            isLoadingMoreComments,
            hasMoreComments,
            commentable,
            isCommentsLoading,

            isProjectsLoading,
            hasMoreProjects,
            isLoadingMoreProjects
        } = this.state;
        const { id } = this.props.match.params; 

        return (
            <section ref={ elem => this.$container = elem } className="w-100 d-block pt-5 text-center m-0 align-items-center contact-us">
                {
                    data && (
                        <Helmet>
                            <title>عمار - { data.name }</title>
                            <meta name="description" content={ data.description } />
                        </Helmet>
                    )
                }
                <div className="pt-4 w90 m-auto text-right align-items-center ">
                    <div className="row">
                        <div className="col-md-6 py-2">
                            <div className="col-12 search-head">
                                <h2 className="w-100 text-right m-0 p-0 font-weight-bold">بيانات الشركة</h2>
                            </div>
                        </div>
                    </div>
                    <LoadableContainer isLoading={ isLoading }>
                        <CompanyData data={ data } />
                    </LoadableContainer>
                </div>
                <FileUploadSection
                    urls={ data?.meta_data?.images || [] }
                    label="صور الشركة"
                    isLoading={ isLoading }
                    readOnly
                />
                <div className="row w90 mx-auto my-2">
                    <div className="col-md-12 py-2 px-0 mb-2">
                        <div className="col-12 px-2 search-head">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">مشاريع الشركة</h2>
                        </div>
                    </div>
                    <LoadableContainer isLoading={ isLoading }>
                        <CompanyProjects
                            companyId={ id }
                            data={ projects }
                            hasMore={ hasMoreProjects }
                            isMoreLoading={ isLoadingMoreProjects }
                            loadMore={ this.onLoadMoreProjects }
                        />
                    </LoadableContainer>
                </div>
                <div className="row mx-0 my-2">
                    <div className="w90 mx-auto py-3">
                        <div className="col-12 search-head mb-3">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">مواعيد الشركة</h2>
                        </div>
                        <LoadableContainer isLoading={ isLoading }>
                            <CompanyWorkDays data={ data?.work_days } />
                        </LoadableContainer>
                    </div>
                </div>
                <div className="row mx-0 my-2">
                    <div className="w90 mx-auto py-3">
                        <div className="col-12 search-head mb-3">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">التعليقات</h2>
                        </div>
                        <LoadableContainer isLoading={ isCommentsLoading }>
                            <CompanyComments
                                data={ comments }
                                hasMore={ hasMoreComments }
                                isMoreLoading={ isLoadingMoreComments }
                                loadMore={ this.onLoadMoreComments }
                            />
                            { commentable && this.props.user?.role === "client" && <CommentForm reloadComments={ this.onLoadComments } companyId={ id } /> }
                        </LoadableContainer>
                    </div>
                </div>
            </section>
        );
    }
}

export default withContext(Company, UserContext);