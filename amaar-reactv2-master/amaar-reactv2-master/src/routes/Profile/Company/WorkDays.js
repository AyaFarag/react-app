import React, { Component } from "react";
import { Prompt }           from "react-router-dom";
import Axios                from "axios";
import equal                from "deep-equal";

import Select            from "../../../components/Select";
import LoadableContainer from "../../../containers/LoadableContainer";

import {
    COMPANY_WORKDAYS,
    COMPANY_UPDATE_WORKDAYS
}            from "../../../api/urls";
import axios from "../../../api/axios";

import { DAYS, SHIFTS, HOURS, findWorkDay, compareDays } from "../../../helpers";


class WorkDay extends Component {
    constructor(props) {
        super();

        this.state = {
            workDay : props.value || {
                from  : -1,
                to    : -1,
                shift : props.shift,
                day   : props.day
            },
            checked : !!props.value
        };
    }

    onSelectChange = (hour, property) => {
        this.setState((state) => {
            state.workDay[property] = hour.value;
            if (state.workDay.from === -1 || state.workDay.to === -1)
                this.props.onRemove(state.workDay);
            else
                this.props.onChange(state.workDay);
            return state;
        });
    }

    render() {
        return (
            <div className="col-5">
                <div className="row">
                    <div className="col-6">
                        <Select
                            className="m-0 w-100"
                            type="time"
                            property="from"
                            valueProperty="value"
                            labelProperty="label"
                            options={ HOURS }
                            placeholder="اختر الوقت"
                            onChange={ this.onSelectChange }
                            value={ this.state.workDay.from || -1 }
                        />
                    </div>
                    <div className="col-6">
                        <Select
                            className="m-0 w-100"
                            type="time"
                            property="to"
                            valueProperty="value"
                            labelProperty="label"
                            options={ HOURS }
                            placeholder="اختر الوقت"
                            onChange={ this.onSelectChange }
                            value={ this.state.workDay.to || -1 }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

class ProfileCompanyWorkDays extends Component {
    state = {
        isLoading : true,
        success   : false,
        workDays  : []
    };

    rct = null;

    componentDidMount() {
        this.fetchData().catch(console.log);
    }

    componentWillUnmount() {
        if (this.rct) this.rct.cancel();
    }


    async fetchData() {
        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const { data : { data : workDays } } = await axios({ ...COMPANY_WORKDAYS(), cancelToken : this.rct.token });
        this.initialWorkDays = JSON.parse(JSON.stringify(workDays));

        this.setState({ isLoading : false, workDays });
    }

    async update() {
        this.setState({ isSubmitting : true, success : false });

        if (this.rct) this.rct.cancel();

        this.rct = Axios.CancelToken.source();

        const data = { days : this.state.workDays };

        await axios({ ...COMPANY_UPDATE_WORKDAYS(), data, cancelToken : this.rct.token });

        this.initialWorkDays = [ ...this.state.workDays.map(workDay => ({ ...workDay })) ];
        this.setState({ isSubmitting : false, success : true });
    }

    onChange = (day) => {
        this.setState({ workDays : this.state.workDays.filter(item => !compareDays(day, item)).concat([day]) });
    };

    onRemove = (day) => {
        this.setState({ workDays : this.state.workDays.filter(item => !compareDays(day, item)) });
    };

    onSubmit = (evt) => {
        evt.preventDefault();
        this.update().catch((err) => {
            console.log(err);
            this.setState({ isSubmitting : false });
        });
    };

    render() {
        const { isSubmitting, isLoading, success, workDays } = this.state;

        const pristine = equal(workDays, this.initialWorkDays);

        return (
            <form onSubmit={ this.onSubmit } className="p-4 w90 m-auto text-right align-items-center d-table">
                <Prompt
                    when={ !pristine }
                    message="هل أنت متأكد ؟ يوجد لديك تعديلات غير محفوظة"
                />
                <div className="row">
                    <div className="col-md-12 py-2 text-center">
                        <div className="col-12 search-head mb-2">
                            <h2 className="w-100 text-right m-0 p-0 font-weight-bold">مواعيد العمل</h2>
                            <p className="w-100 m-0 p-0 text-right font-weight-bold">اختر المواعيد المناسبة</p>
                        </div>
                        <LoadableContainer isLoading={ isLoading }>

                            <div className="row py-2">
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
                            <div className="row py-0">
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
                                    <div key={ value } className="row py-2">
                                        <div className="col-2">
                                            <div className="p-2 w-100 timeBorder">{ label }</div>
                                        </div>
                                        {
                                            SHIFTS.map(shift => (
                                                <WorkDay
                                                    key={ shift }
                                                    value={ findWorkDay(workDays, value, shift) }
                                                    onChange={ this.onChange }
                                                    onRemove={ this.onRemove }
                                                    day={ value }
                                                    shift={ shift }
                                                />
                                            ))
                                        }
                                    </div>
                                ))
                            }
                            <div className="col-md-12 text-center py-2">
                                <button type="submit" disabled={ isSubmitting || pristine } className="btn btn-md px-3">حفظ</button>
                            </div>
                            { success && <div className="col-md-12 text-center pb-3 pt-2 text-success">تم الحفظ بنجاح</div> }
                        </LoadableContainer>
                    </div>
                </div>
            </form>
        );
    }
}

export default ProfileCompanyWorkDays;