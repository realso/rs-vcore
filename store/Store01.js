import { DataTable } from "./DataTable";

const Constants = {
    "F_INITDATA": "initData",
    "F_BATCHINITDATA": "batchInitData",
    "F_SETVALUE": "setValue",
    "F_SETPARAMS": "setParams",
    "MAINPATH": "MAINPATH",
    "SUBPATH": "SUBPATH",
    "P_XULID": "XULID",
    "P_OPRTFLOWID": "OPRTFLOWID",
    "P_AUTOCHECK": "AUTOCHECK",
    "STORE_NAME": "STORE_NAME",
    "DT": "dt"
}
class Store01 {
    constructor(config) {
        this.name = config.STORE_NAME;
        this.mainPath = config.MAINPATH;
        this.subpath = config.SUBPATH;
        this.XULID = config.XULID;
        this.OPRTFLOWID = config.OPRTFLOWID;
        this.AUTOCHECK = config.AUTOCHECK;
        this.service = config.service;
    }

    getTable(state, path) {
        return state[Constants.DT][path];
    }

    getOpenParam(DID) {
        let param = {},
            path = {},
            p = {};
        param["path"] = path;
        param["p"] = p;
        path["main"] = this.mainPath;
        path["subs"] = this.subpath;
        p["DID"] = DID;
        param["XULID"] = this.XULID;
        return param;
    }

    getSaveParam(state) {
        let param = {},
            path = {},
            p = {};
        param["path"] = path;
        param["p"] = p;
        let main = this.mainPath,
            subs = this.subpath
        path["main"] = main;
        path["subs"] = subs;
        Object.keys(this.mainPath).forEach(path => {
            p[path] = this.getTable(state, path).getXML();
        })
        Object.keys(this.subpath).forEach(path => {
            dt[path] = this.getTable(state, path).getXML();
        })
        param[Constants.P_XULID] = this.XULID;
        param[Constants.P_OPRTFLOWID] = this.OPRTFLOWID;
        param[Constants.P_AUTOCHECK] = this.AUTOCHECK;
        return param;
    }

    mixState() {
        let dt = {};
        if (this.mainPath) {
            Object.keys(this.mainPath).forEach(path => {
                dt[path] = new DataTable(path, this.mainPath[path]);
            })
        }
        if (this.subpath) {
            Object.keys(this.subpath).forEach(path => {
                dt[path] = new DataTable(path, this.subpath[path]);
            })
        }
        return {
            dt
        }
    }
    mixActions() {
        return {
            add() {},
            async save() {
                const ret = service.doSave(this.getSaveParam(state));
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
                const ret = await service.doDelete(this.getSaveParam(state));
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async reSubmit({ commit }) {
                const ret = await service.doDelete(this.getSaveParam(state));
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async check({ commit }) {
                const ret = await service.doCheck(this.getSaveParam(state));
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async reCheck({ commit }) {
                const ret = await service.doReInvalid(this.getSaveParam(state));
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async invalid({ commit }) {
                const ret = await service.doInvalid(this.getSaveParam(state));
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            },
            async reInvalid({ commit }) {
                const ret = await service.doReInvalid(this.getSaveParam(state));
                const data = (ret.data || {}).items;
                commit(Constants.F_BATCHINITDATA, { data });
            }
        }
    }

    mixMutations() {
        return {
            [Constants.F_INITDATA]: function(state, { path, data }) {
                state.dt[path].initData(data);
            },
            [Constants.F_SETVALUE]: function(state, { path, field, value, idx }) {
                state.dt[path].setValue(field, value, idx);
            },
            [Constants.F_SETPARAMS]: function(state, params) {
                state.params = params;
            },
            [Constants.F_BATCHINITDATA]: function(state, { data }) {
                Object.keys(data).forEach(key => {
                    if (getTable(state, key)) {
                        getTable(state, key).initData(data[key].items);
                    } else {
                        state[key] = data[key];
                    }
                });
            }
        }
    }
}
export { Store01 };