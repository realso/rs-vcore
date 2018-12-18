let db = {};

export const setDB = function(tdb) {
    db = tdb;
}

export const doGetBillCode = async function({ AID, AUID, BILLTYPEID, BUSTYPEID, BILLDATE, NOTYPEID }) {
    return db.call({
        "namespace": "GJ.EBZ.COM",
        "class": "BusiCom",
        "method": "GetBillCode",
        params: [AID, AUID, NOTYPEID || "10205", BILLTYPEID + '', BUSTYPEID + '' || 'NULL', `to_date('${BILLDATE}','yyyy-mm-dd')`, "0", "0", "0", "0"]
    })
}

export const doGetDateTime = async function() {
    var param = { tp: "getdatetime" };
    return db.postData(param)
}

export const doGetDate = async function() {
    var param = { tp: "getdate" };
    return db.postData(param)
}

export const doGetNewID = async function(scmName, inc) {
    var param = { tp: "getid", modalName: scmName, col: inc };
    return db.postData(param)
}

export const doGetPeriod = async function({ PTYPE, BILLDATE, ACCOUNTTYPE }) {
    let param = { periodTypeID: PTYPE, date: BILLDATE, accountType: ACCOUNTTYPE || "ISCHECKOUT4" };
    const api = { "namespace": "GJ.EBZ.BS", "class": "Period", "method": "GetCheckPeriod", params: [param], ISCHECKREPEAT: true };
    return db.call(api).then((ret) => {
        return new Promise(function(resolve, reject) {
            if (ret.data.ERRORCODE < 0) {
                reject(new Error(ret.data.ERRORTXT));
            } else {
                resolve(ret);
            }
        })
    });
}



export default { setDB, doGetBillCode, doGetDateTime, doGetDate, doGetNewID, doGetPeriod }