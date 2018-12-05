import { DataTable } from "./DataTable";

const Constants = {
    "M_INITDATA": "initData",
    "M_CLEARDATA": "clearData",
    "M_INITBYPATH": "initByPath",
    "M_BATCHSETDATA": "batchSetData",
    "M_SETVALUE": "setValue",
    "M_SETPARAMS": "setParams",
    "STORE_NAME": "STORE_NAME",
    "DT": "dt"
}

class BaseStore {
    constructor(config) {
        //store名称
        this.name = config.STORE_NAME;
        //数据集合
        this.dt = {};
        //数据源
        //{MAIN:"",DTS:""},
        this.paths = config.paths;
        this.service = config.service;
    }

    getTable(path) {
        return this[Constants.DT][path];
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
        let _this = this;
        return {}
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
export { BaseStore, Constants }