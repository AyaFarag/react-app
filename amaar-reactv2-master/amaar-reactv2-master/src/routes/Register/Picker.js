import React    from "react";
import { Link } from "react-router-dom";


function RegisterPicker() {
    return (
        <section className="slideshow w-100 d-block text-center m-0 p-0 align-items-center" id="slideshow">
            <div className=" p-4 w90 m-auto search text-right position-relative align-items-center d-table">
                <div className="row">
                    <div className="d-inline-block w-100">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="col-12 search-head">
                                    <h2 className="w-100 text-right m-0 p-0 font-weight-bold">نوع التسجيل</h2>
                                    <p className="w-100 m-0 p-0 text-right font-weight-bold">اختر القسم الخاص بك</p>
                                </div>
                                <br />
                            </div>
                            <div className="col-md-6 register-type py-2">
                                <Link to="/register/client" className="btn btn-md w-100">التسجيل كمستخدم</Link>
                            </div>
                            <div className="col-md-6 register-type py-2">
                                <Link to="/register/company" className="btn btn-md w-100">التسجيل كشركة</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RegisterPicker;