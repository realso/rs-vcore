let db = {};

export const setDB = function(tdb) {
    db = tdb;
}

export const doCall = async function(param) {
    const api = { "namespace": "GJ.EBZ.P00", "class": "CM01", "method": "onAction", params: [param], ISCHECKREPEAT: true };
    return db.call(api).then((ret) => {
        if (ret.data.ERRCODE) {
            return new Promise(function(resolve, reject) {
                reject(new Error(ret.data.ERRMESSAGE));
            })
        } else {
            return new Promise(function(resolve, reject) {
                resolve(ret);
            })
        }
    });
}
export const doAdd = async function(param) {
    param["TP"] = "add";
    return doCall(param);
}

export const doDelete = async function(param) {
    param["TP"] = "save";
    return doCall(param);
}

export const doOpen = async function(param) {
    param["TP"] = "open";
    return doCall(param);
}

export const doSave = async function(param) {
    param["TP"] = "save";
    param["ISCHECKREPEAT"] = true;
    return doCall(param);
}

export const doSaveSubmit = async function(param) {
    param["TP"] = "saveSubmit";
    return doCall(param);
}

export const doReSubmit = async function(param) {
    param["TP"] = "reSubmit";
    return doCall(param);
}

export const doCheck = async function(param) {
    param["TP"] = "check";
    return doCall(param);
}

export const doReCheck = async function(param) {
    param["TP"] = "reCheck";
    return doCall(param);
}

export const doInvalid = async function(param) {
    param["TP"] = "invalid";
    return doCall(param);
}

export const doReInvalid = async function(param) {
    param["TP"] = "reInvalid";
    return doCall(param);
}

export default { setDB, doAdd, doDelete, doOpen, doSave, doSaveSubmit, doReSubmit, doCheck, doReCheck, doInvalid, doReInvalid }