export const ucfirst     = str => str.charAt(0).toUpperCase() + str.slice(1);
export const isFormValid = inputs => Object.keys(inputs).every(item => inputs[item]);


export const scrollToElem = elem => elem && window.scrollTo(0, window.scrollY + elem.getBoundingClientRect().top - 80);

export const prefix = str => str > 10 ? str : `0${str}`;
export const time24to12 = (str) => {
    const [_, hours, minutes] = /^(\d+):(\d+)/.exec(str) || [];
    if (!hours || !minutes)
        return "";
    return `${prefix(hours % 12 === 0 ? 12 : hours % 12)}:${minutes} ${hours > 11 ? "م" : "ص"}`;
};

export const removeEmptyProperties = (obj) => {
    Object.keys(obj).forEach((prop) => {
        const val = obj[prop];
        if (
            (Array.isArray(val) && !val.length)
            || val === ""
            || val === null
            || val === undefined
        )
            delete obj[prop];
    });
    return obj;
};

export const mergeUserData = (
    oldUser,
    newUser,
    {
        categories,
        specializations,
        countries,
        cities
    }
) => {
    if (newUser.name) {
        oldUser.name = newUser.name;
    }
    if (newUser.description) {
        oldUser.description = newUser.description;
    }

    if (newUser.specialization_id) {
        oldUser.specialization = specializations.filter(item => item.id === newUser.specialization_id)[0];
    }
    if (newUser.category_id) {
        const category = categories.filter(item => item.id === newUser.category_id)[0];
        oldUser.category = { name : category.name, id : category.id };
    }
    if (newUser.city_id) {
        oldUser.city = cities.filter(item => item.id === newUser.city_id)[0];
    }
    if (newUser.country_id) {
        const country = countries.filter(item => item.id === newUser.country_id)[0];
        oldUser.country = { name : country.name, id : country.id };
    }
    if (newUser.images) {
        oldUser.meta_data.images = newUser.images;
    }
    if (newUser.license_image) {
        oldUser.meta_data.license_image = newUser.license_image;
    }
    if (newUser.social_networks) {
        oldUser.meta_data.social_networks = newUser.social_networks;
    }
    if (newUser.website) {
        oldUser.meta_data.website = newUser.website;
    }
    if (newUser.logo) {
        oldUser.meta_data.logo = newUser.logo;
    }

    return oldUser;
};

export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


export const getDeviceToken = () => {
    if (window.fcmInstance) {
        return new Promise((resolve, reject) => {
            window.fcmInstance.requestPermission()
                .then(() => window.fcmInstance.getToken().then(resolve).catch(err => { console.log(err); resolve(null); }))
                .catch(err => { console.log(err); resolve(null); });
        });
    }
    return Promise.resolve(null);
};

export const findWorkDay = (days, day, shift) => days.filter(item => item.day.toLowerCase() === day && item.shift.toLowerCase() === shift)[0] || null;


export const compareDays = (day1, day2) => day1.from === day2.from && day1.to === day2.to
        && day1.shift === day2.shift && day1.day === day2.day;

export const HOURS = [
    { label : "12 ص", value : "00:00" },
    { label : "1 ص", value : "01:00" },
    { label : "2 ص", value : "02:00" },
    { label : "3 ص", value : "03:00" },
    { label : "4 ص", value : "04:00" },
    { label : "5 ص", value : "05:00" },
    { label : "6 ص", value : "06:00" },
    { label : "7 ص", value : "07:00" },
    { label : "8 ص", value : "08:00" },
    { label : "9 ص", value : "09:00" },
    { label : "10 ص", value : "10:00" },
    { label : "11 ص", value : "11:00" },
    { label : "12 ص", value : "12:00" },
    { label : "1 م", value : "13:00" },
    { label : "2 م", value : "14:00" },
    { label : "3 م", value : "15:00" },
    { label : "4 م", value : "16:00" },
    { label : "5 م", value : "17:00" },
    { label : "6 م", value : "18:00" },
    { label : "7 م", value : "19:00" },
    { label : "8 م", value : "20:00" },
    { label : "9 م", value : "21:00" },
    { label : "10 م", value : "22:00" },
    { label : "11 م", value : "23:00" },
];

export const DAYS   = [
    { value : "saturday", label : "السبت" },
    { value : "sunday", label : "الأحد" },
    { value : "monday", label : "الإثنين" },
    { value : "tuesday", label : "الثلاثاء" },
    { value : "wednesday", label : "الأربعاء" },
    { value : "thursday", label : "الخميس" },
    { value : "friday", label : "الجمعة" },
];
export const SHIFTS = ["morning", "night"];

export const ROLES = [
    { label : "شركة", value : "company" },
    { label : "عميل", value : "client" },
];