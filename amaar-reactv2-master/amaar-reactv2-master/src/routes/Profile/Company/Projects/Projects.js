import React, {
    PureComponent,
    Fragment
}                  from "react";
import queryString from "query-string";
import Axios       from "axios";

import LoadableContainer from "../../../../containers/LoadableContainer";

import ProfileCompanyProjectsList from "./List";
import ProfileCompanyProjectsForm from "./Form";

import axios                from "../../../../api/axios";
import { COMPANY_PROJECTS } from "../../../../api/urls";

import UserContext from "../../../../contexts/user";
import withContext from "../../../../contexts/with-context";

import { scrollToElem } from "../../../../helpers";

class ProfileCompanyProjects extends PureComponent {
    rct        = null;
    page       = 1;
    state      = { data : [], isLoading : true, hasMore : false, isLoadingMore : false };
    $container = null;

    componentDidMount() {
        this.setState({ isLoading : true });
        this.fetchData().catch(console.log);
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    async fetchData() {
        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { data : { data, meta, links } } = await axios({
            ...COMPANY_PROJECTS(this.props.user.id),
            params : { page : this.page },
            cancelToken : this.rct.token
        });

        this.setState({ data : this.state.data.concat(data), isLoading : false, hasMore : !!links.next, isLoadingMore : false });
    }

    onReloadProjects = () => {
        this.setState({ isLoading : true });
        this.setState({ data : [] });
        this.fetchData().catch(console.log);

        scrollToElem(this.$container);
    };

    onLoadMore = () => {
        this.setState({ isLoadingMore : true });
        this.page += 1;
        this.fetchData().catch(console.log);
    };

    render() {
        const { isLoading, data, hasMore, isLoadingMore } = this.state;

        return (
            <Fragment>
                <div className="p-4 w90 m-auto text-right align-items-center d-table" ref={ elem => this.$container = elem }>
                    <div className="row">
                        <div className="col-md-12 py-2 mb-2">
                            <div className="col-12 search-head">
                                <h2 className="w-100 text-right m-0 p-0 font-weight-bold">المشاريع</h2>
                            </div>
                        </div>
                        <LoadableContainer isLoading={ isLoading }>
                            <ProfileCompanyProjectsList
                                hasMore={ hasMore }
                                data={ data }
                                onLoadMore={ this.onLoadMore }
                                isLoadingMore={ isLoadingMore }
                                reloadProjects={ this.onReloadProjects }
                            />
                        </LoadableContainer>
                    </div>
                </div>
                <ProfileCompanyProjectsForm reloadProjects={ this.onReloadProjects } />
            </Fragment>
        );
    }
}

export default withContext(ProfileCompanyProjects, UserContext);