import React          from "react";

import CustomLink from "../../../components/CustomLink";

function ProfileCompanyHeader() {
    return (
        <div className="p-4 w90 m-auto text-right align-items-center d-table pt-5">
            <ul className="nav nav-pills nav-fill p-2 mx-0 mt-4 mb-2 profile-tab">
                <li className="nav-item">
                    <CustomLink className="nav-link" to="/profile/projects">المشاريع</CustomLink>
                </li>
                <li className="nav-item">
                    <CustomLink className="nav-link" to="/profile/ads">الإعلانات</CustomLink>
                </li>
                <li className="nav-item">
                    <CustomLink className="nav-link" to="/profile/data">بيانات الشركة</CustomLink>
                </li>
                <li className="nav-item">
                    <CustomLink className="nav-link" to="/profile/work-days">مواعيد العمل</CustomLink>
                </li>
                <li className="nav-item">
                    <CustomLink className="nav-link" to="/profile/comments">التعليقات</CustomLink>
                </li>
                <li className="nav-item">
                    <CustomLink className="nav-link" to="/profile/change-password">تغيير كلمة السر</CustomLink>
                </li>
            </ul>
        </div>
    );
}

export default ProfileCompanyHeader;