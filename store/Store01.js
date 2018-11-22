import { DataTable } from "./DataTable";

const Constants = {
    "F_INITDATA": "initData",
    "F_BATCHINITDATA": "batchInitData",
    "F_SETVALUE": "setValue",
    "F_DELETE": "del",
    "F_ADD": "add",
    "F_SETENTRYNUM": "setEntryNum",
    "F_SETPARAMS": "setParams",
    "MAINPATH": "MAINPATH",
    "SUBPATH": "SUBPATH",
    "P_XULID": "XULID",
    "P_OPRTFLOWID": "OPRTFLOWID",
    "P_AUTOCHECK": "AUTOCHECK",
    "P_ENTRYNUM": "ENTRYNUM",
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
        this.XULID = config.XULID;
        this.OPRTFLOWID = config.OPRTFLOWID;
        this.AUTOCHECK = config.AUTOCHECK;
    }

    getTable(path) {
        return this[Constants.DT][path];
    }

    getOpenParam(DID) {
        let param = {},
            path = {},
            p = {};
        param["path"] = path;
        param["p"] = p;
        path["main"] = {
            [this.mainPath]: this.paths[this.mainPath]
        };
        path["subs"] = this.paths.filter(v => { return this.subPath.contains(v) });
        p["DID"] = DID;
        param["XULID"] = this.XULID;
        return param;
    }

    getSaveParam() {
        let param = {},
            path = {},
            p = {};
        param["path"] = path;
        param["p"] = p;
        let main = {
                [this.mainPath]: this.paths[this.mainPath]
            },
            subs = this.paths.filter(v => { return this.subPath.contains(v) });
        path["main"] = main;
        path["subs"] = subs;
        Object.keys(this.mainPath).forEach(path => {
            p[path] = this.getTable(path).getXML();
        })
        Object.keys(this.subPath).forEach(path => {
            dt[path] = this.getTable(path).getXML();
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
            dt
        }
    }

    mixActions() {
        return {
            add() {},
            async save({ commit }) {
                const ret = service.doSave(this.getSaveParam());
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async open({ commit }, DID) {
                const ret = await service.doOpen(this.getOpenParam(DID));
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async delete() {
                await service.doDelete(this.getSaveParam());
            },
            async saveSubmit({ commit }) {
                const ret = await service.doDelete(this.getSaveParam());
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async reSubmit({ commit }) {
                const ret = await service.doDelete(this.getSaveParam());
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async check({ commit }) {
                const ret = await service.doCheck(this.getSaveParam());
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async reCheck({ commit }) {
                const ret = await service.doReInvalid(this.getSaveParam());
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async invalid({ commit }) {
                const ret = await service.doInvalid(this.getSaveParam());
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async reInvalid({ commit }) {
                const ret = await service.doReInvalid(this.getSaveParam());
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            }
        }
    }

    mixMutations() {
        let _this = this;
        return {
            [Constants.F_INITDATA]: function(state, { path, data }) {
                state[Constants.DT][path].initData(data);
            },
            [Constants.F_SETVALUE]: function(state, { path, field, value, idx }) {
                state[Constants.DT][path].setValue(field, value, idx);
            },
            [Constants.F_ADD]: function(state, { path, item }) {
                let dt = state[Constants.DT][path];
                dt.add(item);
                item[Constants.P_ENTRYNUM] = dt.count();
            },
            [Constants.F_DELETE]: function(state, { path, idx }) {
                state[Constants.DT][path].del(idx);
            },
            [Constants.F_SETPARAMS]: function(state, params) {
                state.params = params;
            },
            [Constants.F_SETENTRYNUM]: function(state, { path }) {
                let dt = state[Constants.DT][path];
                dt.data.forEach((v, index) => {
                    dt.setValue(v, Constants.P_ENTRYNUM, (index + 1), index);
                })
            },
            [Constants.F_BATCHINITDATA]: function(state, { data }) {
                Object.keys(data).forEach(key => {
                    if (_this.getTable(key)) {
                        _this.getTable(key).initData(data[key].items);
                    } else {
                        state[key] = data[key];
                    }
                });
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
export { Store01, Constants };