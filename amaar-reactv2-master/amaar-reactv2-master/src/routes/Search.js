import React, {
    Component,
    Fragment
}                  from "react";
import queryString from "query-string";
import Axios       from "axios";

import Section   from "../components/Section";
import Paginator from "../components/Paginator";


import SearchResults     from "../containers/SearchResults";
import LoadableContainer from "../containers/LoadableContainer";

// import Modal from "../components/modal";

// import { search } from "../api/search";

import axios      from "../api/axios";
import { SEARCH } from "../api/urls";

import { scrollToElem } from "../helpers";

class Search extends Component {
    state = {
        isLoading : true,
        data      : [],
        links     : null,
        meta      : null
    };

    rct        = null;
    $container = null;

    componentDidMount() {
        this.search().catch(console.log);
    }

    componentDidUpdate({ location }) {
        if (location.search !== this.props.location.search)
            this.search().catch(console.log);
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    async search() {
        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const params = queryString.parse(this.props.location.search);

        this.setState({ isLoading : true });

        const { data : { data, links, meta } } = await axios({ cancelToken : this.rct.token, ...SEARCH(), params });

        scrollToElem(this.$container);

        this.setState({ data, links, meta, isLoading : false });
    }

    changeSorting = ({ target }) => {
        const value = target.options[target.selectedIndex].value;

        const params = queryString.parse(this.props.location.search);
        delete params.page;
        if (!value) delete params.sort;
        else params.sort = value;

        this.props.history.push(`/search?${queryString.stringify(params)}`);
    };

    render() {
        const { results, links, meta, isLoading } = this.state;
        return (
            <Section className="news w-100 py-5" label="نتائج البحث" ref={ elem => this.$container = elem }>
                <div className="row m-0 align-items-center w90 mx-auto">
                    <div className="col-12 mb-4 text-right">
                        <select value={ queryString.parse(this.props.location.search).sort || "" } type="text" onChange={ this.changeSorting } className="p-1 float-right font-weight-bold ratingSelect">
                            <option value="">ترتيب حسب</option>
                            <option value="-time">الاحدث</option>
                            <option value="time">الاقدم</option>
                            <option value="-rating">تصنيف عإلي</option>
                            <option value="rating">تصنيف منخفض</option>
                        </select>
                    </div>
                    <LoadableContainer isLoading={ this.state.isLoading }>
                        <SearchResults data={ this.state.data } />
                        <Paginator
                            links={ links }
                            meta={ meta }
                            url={ this.props.location.pathname }
                            search={ this.props.location.search }
                        />
                    </LoadableContainer>
                </div>
            </Section>
        );
    }
}

export default Search;