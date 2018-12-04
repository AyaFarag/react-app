import React, {
    Component,
    Fragment
}                  from "react";
import queryString from "query-string";
import Axios       from "axios";

import LoadableContainer from "../../../../containers/LoadableContainer";

import ProfileCompanyAdsList from "./List";
import ProfileCompanyAdsForm from "./Form";

import axios           from "../../../../api/axios";
import { COMPANY_ADS } from "../../../../api/urls";

import { scrollToElem } from "../../../../helpers";

class ProfileCompanyAds extends Component {
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
            ...COMPANY_ADS(),
            params : { page : this.page },
            cancelToken : this.rct.token
        });

        this.setState({ data : this.state.data.concat(data), isLoading : false, hasMore : !!links.next, isLoadingMore : false });
    }

    onReloadAds = () => {
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
                                <h2 className="w-100 text-right m-0 p-0 font-weight-bold">إعلانات مضافة</h2>
                            </div>
                        </div>
                        <LoadableContainer isLoading={ isLoading }>
                            <ProfileCompanyAdsList
                                hasMore={ hasMore }
                                data={ data }
                                onLoadMore={ this.onLoadMore }
                                isLoadingMore={ isLoadingMore }
                                reloadAds={ this.onReloadAds }
                            />
                        </LoadableContainer>
                    </div>
                </div>
                <ProfileCompanyAdsForm reloadAds={ this.onReloadAds } />
            </Fragment>
        );
    }
}

export default ProfileCompanyAds;