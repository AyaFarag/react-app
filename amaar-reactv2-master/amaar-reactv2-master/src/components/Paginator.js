import React          from "react";
import { withRouter } from "react-router";
import { Link }       from "react-router-dom";
import queryString    from "query-string";


const NUM_OF_LINKS = 5;
const NUM_OF_LINKS_SIDE = Math.floor(NUM_OF_LINKS / 2);

function PageLink({ activePage, url, index }) {
    return (
        <li
            className={`page-item${activePage == index ? " active" : ""}`}
        >
            <Link className="page-link" to={`${url}page=${index}`}>{ index }</Link>
        </li>
    );
}

function Pagination(props) {
    if (!props.links) return null;

    const {
        url = props.location.pathname,
        search = props.location.search,
        links : { prev, next, last, first },
        meta : { last_page }
    } = props;

    const pages = [];

    let tempSearch = queryString.parse(search);
    const activePage = +tempSearch.page || 1;


    let start = Math.max(activePage - NUM_OF_LINKS_SIDE, 1);
    let end   = Math.min(last_page, activePage + NUM_OF_LINKS_SIDE);
    if (activePage <= NUM_OF_LINKS_SIDE) {
        end = Math.min(NUM_OF_LINKS_SIDE - activePage + 1 + end, last_page);
    }
    if (activePage > last_page - NUM_OF_LINKS_SIDE) {
        start = Math.max(start - (NUM_OF_LINKS_SIDE - (last_page - activePage)), 1);
    }

    delete tempSearch.page;

    tempSearch = queryString.stringify(tempSearch);
    tempSearch = tempSearch ? `?${tempSearch}&` : `?`;
    const path = `${url}${tempSearch}`;

    for (let i = start; i <= end; i += 1) {
        pages.push(<PageLink url={ path } index={ i } key={ i } activePage={ activePage } />);
    }

    if (pages.length < 2)
        return null;

    return (
        <ul className="pagination mt-5 w-100" style={{ justifyContent : "center", direction : "rtl" }}>
            <li className={`page-item${prev ? "" : " disabled"}`}>
                <Link className="page-link" to={prev ? `${path}page=${+activePage - 1}` : `${path}page=${activePage}`} aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                </Link>
            </li>
            { pages }
            <li className={`page-item${next ? "" : " disabled"}`}>
                <Link className="page-link" to={next ? `${path}page=${+activePage + 1}` : `${path}page=${activePage}`} aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                </Link>
            </li>
        </ul>
    );
}

export default withRouter(Pagination);