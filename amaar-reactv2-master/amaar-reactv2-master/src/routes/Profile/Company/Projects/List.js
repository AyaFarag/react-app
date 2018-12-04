import React, { PureComponent } from "react";
import { Link }                 from "react-router-dom";
import Axios                    from "axios";

import Image from "../../../../components/Image";

import { COMPANY_DELETE_PROJECT } from "../../../../api/urls";
import axios                      from "../../../../api/axios";

class ProfileCompanyProject extends PureComponent {
    state = { confirmedDelete : false, isDeleting : false };
    rct = null;

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    onDelete = () => {
        if (!this.state.confirmedDelete) {
            return this.setState({ confirmedDelete : true });
        }

        this.deleteProject().catch(() => {
            this.setState({ isDeleting : false, confirmedDelete : false });
        });
    };

    async deleteProject() {
        this.setState({ isDeleting : true });

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        await axios({ ...COMPANY_DELETE_PROJECT(this.props.id), cancelToken : this.rct.token });

        this.props.reloadProjects();
    }

    render() {
        const { id, name, images, description, image, onDelete } = this.props;
        const { confirmedDelete, isDeleting } = this.state;

        return (
            <div className="col-lg-3 col-sm-6 text-center mb-4">
                <div className="shadow p-0 mb-1">
                    <Image className="partners-img w-100" src={ images[0] } />
                    <h4 className="m-0 font-weight-bold text-right p-2">{ name }</h4>
                    <p className="m-0 text-right p-2">
                        <small>
                            { description }
                        </small>
                    </p>
                    <div className="row m-0 pb-3">
                        <div className="col-6">
                            <Link to={ `/profile/projects/${id}` } className="btn btn-sm w-100 py-1">تعديل</Link>
                        </div>
                        <div className="col-6">
                            <button onClick={ this.onDelete } disabled={ isDeleting } className="btn btn-sm w-100 py-1 deleteBtn">
                                { confirmedDelete ? "هل أنت متأكد" : "مسح" }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function ProfileCompanyProjectsList({ data, onLoadMore, hasMore, isLoadingMore, reloadProjects }) {
    if (!data.length) {
        return (
            <div className="row w-100 m-0 search-result">
                <h4 className="col-12 text-center text-danger mt-5 mb-5">لا يوجد لديك مشاريع</h4>
            </div>
        );
    }
    return (
        <div className="row w-100 m-0 search-result">
            { data.map(project => <ProfileCompanyProject key={ project.id } reloadProjects={ reloadProjects } { ...project } />) }
            {
                hasMore
                    && (
                        <div className="col-md-12 text-center py-2">
                            <button disabled={ isLoadingMore } onClick={ onLoadMore } className="btn btn-md px-3">المزيد</button>
                        </div>
                    )
            }
        </div>
    );
}

export default ProfileCompanyProjectsList;