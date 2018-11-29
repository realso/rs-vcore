import { DataTable } from "./DataTable";

const Constants = {
    "M_INITDATA": "initData",
    "M_CLEARDATA": "clearData",
    "M_INITBYPATH": "initByPath",
    "M_BATCHSETDATA": "batchSetData",
    "M_SETVALUE": "setValue",
    "M_SETENTRYNUM": "setEntryNum",
    "M_SETPARAMS": "setParams",
    "M_SETSTATE": "setState",
    "MAINPATH": "MAINPATH",
    "SUBPATH": "SUBPATH",
    "P_XULID": "XULID",
    "P_OPRTFLOWID": "OPRTFLOWID",
    "P_AUTOCHECK": "AUTOCHECK",
    "P_ENTRYNUM": "ENTRYNUM",
    "P_EMPFIELD": "MKEMPID",
    "P_MAKEFIELD": "MAKERID",
    "P_STATECODE": "STATE.PARACODE",
    "P_DELFIELD": "ISDEL",
    "STORE_NAME": "STORE_NAME",
    "DT": "dt"
}

class Store01 {
    constructor(config) {
        //store名称
        this.name = config.STORE_NAME;
        //数据集合
        this.dt = {};
        //数据源
        //{MAIN:"",DTS:""},
        this.paths = config.paths;
        this.service = config.service;
        //MAIN
        this.mainPath = config.MAINPATH || "";
        //["DTS1","DTS2"]
        this.subPath = config.SUBPATH || [];
        //["DTS3","DTS4"]
        this.extPath = config.EXTPATH || [];

        //放在这感觉很鸡肋
        this.ISFDEL = config.ISFDEL;
        this.XULID = config.XULID;
        this.OPRTFLOWID = config.OPRTFLOWID;
        this.AUTOCHECK = config.AUTOCHECK;
        this.EMPFIELD = config.EMPFIELD || Constants.P_EMPFIELD;
        this.MAKEFIELD = config.MAKEFIELD || Constants.P_MAKEFIELD;
        this.DELFIELD = config.DELFIELD || Constants.P_DELFIELD;
        this.STATECODE = config.STATECODE || Constants.P_STATECODE;
    }

    getTable(path) {
        return this[Constants.DT][path];
    }

    getOpenParam(DID) {
        let param = {},
            path = {},
            subs = {},
            p = {};
        param["path"] = path;
        param["p"] = p;
        path["main"] = {
            [this.mainPath]: this.paths[this.mainPath]
        };
        path["subs"] = subs;
        this.subPath.map(v => { subs[v] = this.paths[v] });
        p["DID"] = DID;
        param["XULID"] = this.XULID;
        return param;
    }

    getSaveParam() {
        let param = {},
            path = {},
            subs = {},
            p = {};
        param["path"] = path;
        param["p"] = p;
        path["main"] = {
            [this.mainPath]: this.paths[this.mainPath]
        };
        path["subs"] = subs;
        this.subPath.map(v => { subs[v] = this.paths[v] });
        p[this.mainPath] = this.getTable(this.mainPath).getXML();
        this.subPath.forEach(path => {
            p[path] = this.getTable(path).getXML();
        })
        param[Constants.P_XULID] = this.XULID;
        param[Constants.P_OPRTFLOWID] = this.OPRTFLOWID;
        param[Constants.P_AUTOCHECK] = this.AUTOCHECK;
        return param;
    }

    mixState() {
        let dt = {};
        if (this.paths) {
            Object.keys(this.paths).forEach(path => {
                dt[path] = new DataTable(path, this.paths[path]);
            })
        }
        this.dt = dt;
        return {
            dt,
            STATE: "Null"
        }
    }


    mixActions() {
        let _this = this;
        return {
            async add({ commit }, param) {
                let paths = Object.keys(_this.paths);
                commit(Constants.M_INITBYPATH, { paths });
                const ret = await _this.service.doAdd(param);
                const data = (ret.data || {});
                commit(Constants.M_BATCHSETDATA, { data });
                commit(Constants.M_SETSTATE);
            },
            async save({ commit }) {
                const ret = await _this.service.doSave(_this.getSaveParam());
                const data = (ret.data || {});
                commit(Constants.M_BATCHSETDATA, { data });
                commit(Constants.M_SETSTATE);
            },
            async open({ commit }, DID) {
                const ret = await _this.service.doOpen(_this.getOpenParam(DID));
                const data = (ret.data || {});
                commit(Constants.M_BATCHSETDATA, { data });
                commit(Constants.M_SETSTATE);
            },
            async delete() {
                /*全部在后台处理
                if ("1" == _this.ISFDEL) {
                    _this.getTable(_this.mainPath).setValue(_this.DELFIELD, 1);
                } else {
                    commit(Constants.M_CLEARDATA, { path: _this.mainPath });
                    _this.subPath.forEach(path => {
                        commit(Constants.M_CLEARDATA, { path });
                    })
                }*/
                await service.doDelete(_this.getSaveParam());
                commit(Constants.M_SETSTATE);
            },
            async saveSubmit({ commit }) {
                const ret = await _this.service.doDelete(_this.getSaveParam());
                const data = (ret.data || {});
                commit(Constants.M_BATCHSETDATA, { data });
                commit(Constants.M_SETSTATE);
            },
            async reSubmit({ commit }) {
                const ret = await _this.service.doDelete(_this.getSaveParam());
                const data = (ret.data || {});
                commit(Constants.M_BATCHSETDATA, { data });
                commit(Constants.M_SETSTATE);
            },
            async check({ commit }) {
                const ret = await _this.service.doCheck(_this.getSaveParam());
                const data = (ret.data || {});
                commit(Constants.M_BATCHSETDATA, { data });
                commit(Constants.M_SETSTATE);
            },
            async reCheck({ commit }) {
                const ret = await _this.service.doReInvalid(_this.getSaveParam());
                const data = (ret.data || {});
                commit(Constants.M_BATCHSETDATA, { data });
                commit(Constants.M_SETSTATE);
            },
            async invalid({ commit }) {
                const ret = await _this.service.doInvalid(_this.getSaveParam());
                const data = (ret.data || {});
                commit(Constants.M_BATCHSETDATA, { data });
                commit(Constants.M_SETSTATE);
            },
            async reInvalid({ commit }) {
                const ret = await _this.service.doReInvalid(_this.getSaveParam());
                const data = (ret.data || {});
                commit(Constants.M_BATCHSETDATA, { data });
                commit(Constants.M_SETSTATE);
            }
        }
    }

    mixMutations() {
        let _this = this;
        return {
            [Constants.M_INITDATA]: function(state, { path, data }) {
                state[Constants.DT][path].initData(data);
            },
            [Constants.M_CLEARDATA]: function(state, { path }) {
                state[Constants.DT][path].clear(data);
            },
            [Constants.M_SETVALUE]: function(state, { path, field, value, idx }) {
                state[Constants.DT][path].setValue(field, value, idx);
            },
            [Constants.M_SETPARAMS]: function(state, params) {
                state.params = params;
            },
            [Constants.M_SETENTRYNUM]: function(state, { path }) {
                let dt = state[Constants.DT][path];
                dt.data.forEach((v, index) => {
                    dt.setValue(v, Constants.P_ENTRYNUM, (index + 1), index);
                })
            },
            [Constants.M_INITBYPATH]: function(state, { paths }) {
                paths.forEach(key => {
                    if (_this.getTable(key)) {
                        _this.getTable(key).initData();
                    }
                });
            },
            [Constants.M_BATCHSETDATA]: function(state, { data }) {
                Object.keys(data).forEach(key => {
                    if (_this.getTable(key)) {
                        _this.getTable(key).setData(data[key].items);
                    } else {
                        state[key] = data[key];
                    }
                });
            },
            [Constants.M_SETSTATE]: function(state, STATE) {
                let MAIN = _this.getTable(_this.mainPath);
                STATE = STATE || MAIN.getValue(_this.STATECODE) || (MAIN.isAdd() ? "Add" : "");
                if ("Add" != STATE) {
                    if (STATE) {
                        state.STATE = STATE;
                    } else {
                        state.STATE = "Null";
                    }
                    //处理notme
                    if (!(this.getters.userInfo.EMPID == MAIN.getValue(_this.EMPFIELD) || this.getters.userInfo.AUID == MAIN.getValue(_this.MAKEFIELD))) {
                        state.STATE = "NotMe";
                    }
                } else {
                    state.STATE = STATE;
                }
            }
        }
    }

    mapGetters(path, aFields, itemProp) {
        let dt = this.dt[path];
        aFields = aFields || [];
        dt.bindField(aFields);
        let ret = {};
        for (let i = 0, field; i < aFields.length; i++) {
            field = aFields[i];
            ret[field] = {
                get() {
                    return dt.getValue(field.replace(/_/g, '.'), itemProp ? this[itemProp] : 0);
                },
                set(value) {
                    dt.setValue(field.replace(/_/g, '.'), value, itemProp ? this[itemProp] : 0)
                }
            }
        }
        ret[path] = function() {
            return dt.data;
        };
        return ret;
    }
}
export { Store01, Constants }