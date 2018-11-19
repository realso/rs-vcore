let db = {};

const setDB = function(tdb) {
    db = tdb;
}

const doCall = async function(param) {
    const api = { "namespace": "GJ.EBZ.P00", "class": "CM01", "method": "onAction", params: [param] };
    return db.call(api);
}
const doAdd = async function(param) {
    param["TP"] = "add";
    return doCall(param);
}

const doDelete = async function(param) {
    param["TP"] = "save";
    return doCall(param);
}

const doOpen = async function(param) {
    param["TP"] = "open";
    return doCall(param);
}

const doSave = async function(param) {
    param["TP"] = "save";
    return doCall(param);
}

const doSaveSubmit = async function(param) {
    param["TP"] = "saveSubmit";
    return doCall(param);
}

const doReSubmit = async function(param) {
    param["TP"] = "reSubmit";
    return doCall(param);
}

const doCheck = async function(param) {
    param["TP"] = "check";
    return doCall(param);
}

const doReCheck = async function(param) {
    param["TP"] = "reCheck";
    return doCall(param);
}

const doInvalid = async function(param) {
    param["TP"] = "invalid";
    return doCall(param);
}

const doReInvalid = async function(param) {
    param["TP"] = "reInvalid";
    return doCall(param);
}

export default { setDB, doAdd, doDelete, doOpen, doSave, doSaveSubmit, doReSubmit, doCheck, doReCheck, doInvalid, doReInvalid }