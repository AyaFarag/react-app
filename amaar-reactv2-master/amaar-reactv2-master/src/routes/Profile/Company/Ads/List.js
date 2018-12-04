import React, { PureComponent } from "react";
import { Link }                 from "react-router-dom";
import Axios                    from "axios";

import Image from "../../../../components/Image";

import { COMPANY_DELETE_AD } from "../../../../api/urls";
import axios from "../../../../api/axios";

class ProfileCompanyAd extends PureComponent {
    state = { confirmedDelete : false, isDeleting : false };
    rct = null;

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }

    onDelete = () => {
        if (!this.state.confirmedDelete) {
            return this.setState({ confirmedDelete : true });
        }

        this.deleteAd().catch(() => {
            this.setState({ isDeleting : false, confirmedDelete : false });
        });
    };

    async deleteAd() {
        this.setState({ isDeleting : true });

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        await axios({ ...COMPANY_DELETE_AD(this.props.id), cancelToken : this.rct.token });

        this.props.reloadAds();
    }

    render() {
        const { id, title, image, onDelete } = this.props;
        const { confirmedDelete, isDeleting } = this.state;

        return (
            <div className="col-lg-3 col-sm-6 text-center mb-4">
                <div className="shadow p-0 mb-1">
                    <Image className="partners-img w-100" src={ image } />
                    <h4 className="m-0 font-weight-bold text-right p-2">{ title }</h4>
                    <div className="row m-0 pb-3">
                        <div className="col-6">
                            <Link to={ `/profile/ads/${id}` } className="btn btn-sm w-100 py-1">تعديل</Link>
                        </div>
                        <div className="col-6">
                            <button disabled={ isDeleting } onClick={ this.onDelete } className="btn btn-sm w-100 py-1 deleteBtn">
                                { confirmedDelete ? "هل أنت متأكد" : "مسح" }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function ProfileCompanyAdsList({ data, onLoadMore, hasMore, isLoadingMore, reloadAds }) {
    if (!data.length) {
        return (
            <div className="row w-100 m-0 search-result">
                <h4 className="col-12 text-center text-danger mt-5 mb-5">لا يوجد لديك إعلانات</h4>
            </div>
        );
    }
    return (
        <div className="row w-100 m-0 search-result">
            { data.map(ad => <ProfileCompanyAd key={ ad.id } reloadAds={ reloadAds } { ...ad } />) }
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

export default ProfileCompanyAdsList;