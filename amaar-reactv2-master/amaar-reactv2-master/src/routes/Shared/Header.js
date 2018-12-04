import React, {
    Fragment,
    Component
}               from "react";
import { Link } from "react-router-dom";

import UserContext from "../../contexts/user";
import withContext from "../../contexts/with-context";

import CustomLink from "../../components/CustomLink";

class Header extends Component {
    state = {
        isMobileSidebarOpen    : false,
        isCommunitySubmenuOpen : false
    };

    onCommunityOpen = () => this.setState({ isCommunitySubmenuOpen : true });
    onCommunityClose = () => this.setState({ isCommunitySubmenuOpen : false });
    onMobileSidebarOpen = () => this.setState({ isMobileSidebarOpen : true });
    onMobileSidebarClose = () => this.setState({ isMobileSidebarOpen : false });

    render() {
        const { isCommunitySubmenuOpen, isMobileSidebarOpen } = this.state;
        const { isLoggedIn, user } = this.props;

        return (
            <Fragment>
                <div id="mySidenav" className="sidenav" style={{ width : this.state.isMobileSidebarOpen ? 250 : 0 }}>
                    <a style={{ cursor : "pointer" }} onClick={ this.onMobileSidebarClose } className="closebtn">&times;</a>
                    {
                        isLoggedIn
                            ? <Link onClick={ this.onMobileSidebarClose } to="/profile/data">حسابي</Link>
                            : (
                                <Fragment>
                                    <Link onClick={ this.onMobileSidebarClose } to="/register">تسجيل</Link>
                                    <Link onClick={ this.onMobileSidebarClose } to="/login">دخول</Link>
                                </Fragment>
                            )
                    }
                    <Link onClick={ this.onMobileSidebarClose } to="/">الرئيسية</Link>
                    <Link onClick={ this.onMobileSidebarClose } to="/about">عن عمار</Link>
                    <Link onClick={ this.onMobileSidebarClose } to="/partners">شركائنا</Link>
                    <Link onClick={ this.onMobileSidebarClose } to="/gallery">مكتبة عمار</Link>
                    <Link onClick={ this.onMobileSidebarClose } to="/consultation">استشارات عمار</Link>
                    <Link onClick={ this.onMobileSidebarClose } to="/privacy">سياسة الخصوصية</Link>
                    <Link onClick={ this.onMobileSidebarClose } to="/contact">اتصل بنا</Link>
                    { isLoggedIn && <Link onClick={ this.onMobileSidebarClose } to="/logout">خروج</Link> }
                </div>
                <span
                    className="btn-res"
                    onClick={ this.onMobileSidebarOpen }
                    style={{ cursor : "pointer" }}
                >
                    <img src="/images/menu-icon.png"/>
                </span>
                <header className="header align-items-center m-0 p-0 position-fixed w-100" id="header">
                    <div className="w90">
                        <nav className="navbar navbar-expand-md navbar-light p-0" id="myScrollspy">
                            <Link className="navbar-brand logo" to="/">
                                <img className="logo-default" src="/images/logo.png"/>
                            </Link>
                            <div className="collapse navbar-collapse justify-content-end h-100 align-items-center p-0"
                                 id="navbarSupportedContent">
                                <ul className="navbar-nav h-100 align-items-center m-auto">
                                    <li className="nav-item align-items-center home pr-1">
                                        <CustomLink className="nav-link align-items-center d-flex h-100 hvr-underline-from-left" to="/">
                                            الرئيسية
                                        </CustomLink>
                                    </li>
                                    <li className="nav-item align-items-center">
                                        <CustomLink className="nav-link align-items-center d-flex h-100 hvr-underline-from-left" to="/about">
                                            عن عمار
                                        </CustomLink>
                                    </li>
                                    <li className="nav-item align-items-center">
                                        <CustomLink className="nav-link align-items-center d-flex h-100 hvr-underline-from-left" to="/partners">
                                            شركائنا
                                        </CustomLink>
                                    </li>
                                    <li
                                        className="nav-item align-items-center position-relative dropdownList"
                                        id="dropdownMenuButton"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded={ isCommunitySubmenuOpen }
                                        onMouseOver={ this.onCommunityOpen }
                                        onMouseOut={ this.onCommunityClose }
                                    >
                                            <a
                                                className="nav-link align-items-center d-flex h-100 hvr-underline-from-left"
                                                style={{ cursor : "pointer" }}
                                            >
                                                مجتمع عمار
                                            </a>
                                        <div className={`dropdown-menu text-right${ isCommunitySubmenuOpen ? " show" : "" }`} aria-labelledby="dropdownMenuButton">
                                            <CustomLink className="p-1 w-100 d-block nav-link" to="/gallery">مكتبة عمار</CustomLink>
                                            <CustomLink className="p-1 w-100 d-block nav-link" to="/consultation">إستشارات عمار</CustomLink>
                                        </div>
                                    </li>
                                    <li className="nav-item align-items-center">
                                        <CustomLink className="nav-link align-items-center d-flex h-100 hvr-underline-from-left" to="/privacy">
                                        سياسة الخصوصية
                                        </CustomLink>
                                    </li>
                                    <li className="nav-item align-items-center contact pl-1">
                                        <CustomLink className="nav-link align-items-center d-flex h-100 hvr-underline-from-left" to="/contact">اتصل بنا</CustomLink>
                                    </li>
                                </ul>
                            </div>
                            {
                                isLoggedIn
                                    ? (
                                        <Fragment>
                                            <Link className="navbar-brand btn font-weight-bold registerlink" to="/profile/data">حسابي</Link>
                                            <Link className="navbar-brand btn font-weight-bold registerlink" to="/logout">خروج</Link>
                                            { user?.status === false && <Link className="navbar-brand btn font-weight-bold registerlink" to="/activate">التفعيل</Link> }
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            <Link className="navbar-brand btn font-weight-bold registerlink" to="/register">تسجيل</Link>
                                            <Link className="navbar-brand btn font-weight-bold loginLink" to="/login">دخول</Link>
                                        </Fragment>
                                    )
                            }
                        </nav>
                    </div>
                </header>
            </Fragment>
        );
    }
}

export default withContext(Header, UserContext);