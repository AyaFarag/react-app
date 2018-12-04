import React, {
    Component,
    Fragment
}                  from "react";
import queryString from "query-string";
import Axios       from "axios"; 

import Paginator from "../components/Paginator";

import LoadableContainer from "../containers/LoadableContainer";
import Partner           from "../containers/Partner";

import { PARTNERS } from "../api/urls";
import axios        from "../api/axios";

import { scrollToElem } from "../helpers";

class Partners extends Component {

    state = {
        data      : null,
        links     : null,
        meta      : null,
        isLoading : true
    };

    rct        = null;
    $container = null;

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
        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        this.setState({ isLoading : true });

        const params = queryString.parse(this.props.location.search);

        const { data : { data, links, meta } } = await axios({ cancelToken : this.rct.token, ...PARTNERS(), params });

        scrollToElem(this.$container);

        this.setState({ data, links, meta, isLoading : false });
    }

    render() {
        const { isLoading, data, links, meta } = this.state;

        return (
            <section className="news w-100 py-5" ref={ elem => this.$container = elem }>
                <div className="row m-0 align-items-center w90 mx-auto" style={{ overflow: "hidden" }}>
                    <div className="col-12 search-head my-4">
                        <h2 className="w-100 text-right m-0 p-0 font-weight-bold">الشركات المميزة</h2>
                    </div>
                    <div className="col-12">
                        <LoadableContainer isLoading={ isLoading }>
                            <div className="row m-0 partners">
                                { data && data.map(partner => <Partner key={ partner.id } { ...partner } />) }
                            </div>
                            <Paginator
                                links={ links }
                                meta={ meta }
                                url={ this.props.location.pathname }
                                search={ this.props.location.search }
                            />
                        </LoadableContainer>
                    </div>
                </div>
            </section>
        );
    }
}

export default Partners;