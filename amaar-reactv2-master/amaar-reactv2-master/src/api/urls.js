

//===============================================================
//
// BLA BLA BLA
//
//===============================================================

export const EMAIL_EXISTS               = () => ({ url : "/check/email", method : "post" });
export const PHONE_EXISTS               = () => ({ url : "/check/phone", method : "post" });


export const COMPANY_REGISTER           = () => ({ url : "/companies/register", method : "post" });
export const CLIENT_REGISTER            = () => ({ url : "/clients/register", method : "post" });

export const LOGIN                      = () => ({ url : "/login", method : "post" });






export const COMPANY_UPDATE_DATA        = () => ({ url : "/companies/company-meta-data", method : "put" });



export const COMPANY_ADS                = () => ({ url : "/companies/ads", method : "get" });
export const COMPANY_COMMENTS           = (id) => ({ url : `/company/${id}/comments`, method : "get" });
export const COMPANY_PROJECTS           = (id) => ({ url : `/company/${id}/projects`, method : "get" });
export const COMPANY_PROJECT            = (id, project) => ({ url : `/company/${id}/projects/${project}`, method : "get" });
export const COMPANY_DATA               = (id) => ({ url : `/company/${id}/data`, method : "get" });

export const COMPANY_GET_AD             = (id) => ({ url : `/companies/ads/${id}`, method : "get" });
export const COMPANY_CREATE_AD          = () => ({ url : "/companies/ads", method : "post" });
export const COMPANY_UPDATE_AD          = (id) => ({ url : `/companies/ads/${id}`, method : "put" });
export const COMPANY_DELETE_AD          = (id) => ({ url : `/companies/ads/${id}`, method : "delete" });


export const COMPANY_GET_PROJECT        = (id) => ({ url : `/companies/projects/${id}`, method : "get" });
export const COMPANY_CREATE_PROJECT     = () => ({ url : "/companies/projects", method : "post" });
export const COMPANY_UPDATE_PROJECT     = (id) => ({ url : `/companies/projects/${id}`, method : "put" });
export const COMPANY_DELETE_PROJECT     = (id) => ({ url : `/companies/projects/${id}`, method : "delete" });

export const COMPANY_WORKDAYS           = () => ({ url : "/companies/workdays", method : "get" });
export const COMPANY_UPDATE_WORKDAYS    = () => ({ url : "/companies/workdays", method : "put" });


export const CHANGE_PASSWORD            = () => ({ url : "/change-password", method : "post" });



export const COUNTRIES                  = () => ({ url : "/utilities/countries", method : "get" });
export const SETTINGS                   = () => ({ url : "/utilities/settings", method : "get" });
export const CATEGORIES                 = () => ({ url : "/utilities/categories", method : "get" });
export const PARTNERS                   = () => ({ url : "/utilities/partners", method : "get" });
export const CONSULT                    = () => ({ url : "/utilities/consult", method : "post" });
export const FORGET                     = () => ({ url : "/forget", method : "post" });
export const UNIQUE                     = () => ({ url : "/search", method : "get", params : { sort : "-rating" } });



export const SEARCH                     = () => ({ url : "/search", method : "get" });



export const CLIENT_POST_COMMENT        = () => ({ url : "/clients/comments", method : "post" });
export const CLIENT_UPDATE_DATA         = () => ({ url : "/clients/profile", method : "put" });


export const SEND_PHONE_ACTIVATION_CODE = () => ({ url : "/activate/phone/send", method : "post" });

export const ACTIVATE_PHONE             = () => ({ url : "/activate/phone", method : "post" });


export const GALLERY                    = () => ({ url : "/utilities/gallery", method : "get" });


export const PAGE                       = (slug) => ({ url : `/utilities/page/${slug}`, method : "get" });