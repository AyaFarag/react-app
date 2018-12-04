import React, { Fragment } from "react";

import {
    time24to12,
    findWorkDay,

    SHIFTS,
    DAYS
} from "../helpers";

function WorkDay(props) {
    return (
        <div className="col-5">
            <div className="row">
                <div className="p-2 col-6 font-weight-bold">{ props.from ? time24to12(props.from) : "--" }</div>
                <div className="p-2 col-6 font-weight-bold">{ props.to ? time24to12(props.to) : "--" }</div>
            </div>
        </div>
    );
}

function CompanyWorkDays({ data }) {
    if (!data) return null;

    return (
        <Fragment>
            <div className="col-12 row py-2">
                <div className="col-2">
                    <div className="p-2 w-100 timeBorder">الأيام</div>

                </div>
                <div className="col-5">
                    <div className="p-2 w-100 timeBorder">الفترة الصباحية</div>

                </div>
                <div className="col-5">
                    <div className="p-2 w-100 timeBorder">الفترة المسائية</div>

                </div>
            </div>
            <div className="col-12 row py-0">
                <div className="col-2">
                </div>
                <div className="col-5">
                    <div className="row">
                        <div className="p-0 col-6 font-weight-bold colerDate">من</div>
                        <div className="p-0 col-6 font-weight-bold colerDate">إلي</div>
                    </div>
                </div>
                <div className="col-5">
                    <div className="row">
                        <div className="p-0 col-6 font-weight-bold colerDate">من</div>
                        <div className="p-0 col-6 font-weight-bold colerDate">إلي</div>
                    </div>
                </div>
            </div>
            {
                DAYS.map(({ value, label }) => (
                    <div key={ value } className="row col-12 py-2">
                        <div className="col-2">
                            <div className="p-2 w-100 timeBorder">{ label }</div>
                        </div>
                        {
                            SHIFTS.map(shift => (
                                <WorkDay
                                    key={ shift }
                                    { ...findWorkDay(data, value, shift) }
                                />
                            ))
                        }
                    </div>
                ))
            }
        </Fragment>
    );
}

export default CompanyWorkDays;