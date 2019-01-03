/**
 * 数据管理对象
 */
class DataTable {
    constructor(path, scm) {
        this.path = path;
        this.idx = 0;
        this.scm = scm;
        this.dataObj = {};
        this.data = [];
        this._changeInfo = {
            _rawData: [],
            _rawIdxData: {},
            _addIdxRows: {},
            _modifyIdxRows: {},
            _deleteIdxRows: {}
        }
        this.__backdata = null;
    }

    /**
     * 初始化
     * @param {初始化数据} data 
     */
    initData(data) {
        this.idx = 0;
        this.data = [];
        data = data || [];
        this._changeInfo = {
            _rawData: [],
            _rawIdxData: {},
            _addIdxRows: {},
            _modifyIdxRows: {},
            _deleteIdxRows: {}
        }
        data.map(item => {
            item["_idx_"] = this.idx++;
            item["_type_"] = "old";
            item["_path_"] = this.path;
            this._changeInfo._rawIdxData[item["_idx_"]] = item;
            this.data.push(Object.assign({}, this.dataObj, item));
        })
        this._changeInfo._rawData = data;
    }

    /**
     * 设置数据
     * @param {数据} data 
     * @param {是否追加} isAdd 
     */
    setData(data, isAdd) {
        if (!isAdd) {
            this.initData();
        }
        data.map(item => {
            item["_idx_"] = this.idx++;
            item["_type_"] = "old";
            this._changeInfo._rawIdxData[item["_idx_"]] = item;
            this.data.push(Object.assign({}, this.dataObj, item));
        });
        this._changeInfo._rawData = this._changeInfo._rawData.concat(data);
    }

    getData(where, order) {
        where = where || "";
        order = order || "";
        return this.data;
    }

    getValue(field, idxOrItem) {
        let ret = "";
        let idx = idxOrItem || 0;
        let item = idxOrItem || {};
        if (typeof(idxOrItem) != "object") {
            if (idx > this.data.length) {
                throw new Error("DataTable.getValue idx太长了");
            }
            if (this.data.length > 0) {
                item = this.data[idx];
            }
        }
        ret = item[field];
        return ret;
    }

    

    setValue(field, value, idxOrItem) {

        value = this._filterValue(value);
        let idx = idxOrItem || 0;
        let item = idxOrItem || {};
        if (typeof(idxOrItem) != "object") {
            if (this.data.length == 0) {
                item = {};
                this.add(item);
            }
            if (idx > this.data.length) {
                throw new Error("DataTable.setValue太长了");
            } else {
                item = this.data[idx];
            }
        }
        item[field] = value;
        //放入修改记录
        this.update(item, [field]);
    }

    getValues(field) {
        return this.data.map(function(item) {
            return item[field];
        })
    }

    setValues(titem, idxOrItem) {
        let idx = idxOrItem || 0;
        let item = idxOrItem || {};
        if (typeof(idxOrItem) != "object") {
            if (this.data.length == 0) {
                item = {};
                this.add(item);
            }
            if (idx > this.data.length) {
                throw new Error("DataTable.getValue太长了");
            } else {
                item = this.data[idx];
            }
        }
        Object.keys(titem).forEach(t => {
            item[t] = titem[t];
        })
        this.update(item, Object.keys(titem));
    }

    getRawItem(item, fields){
        fields = fields || this.getFields(true);
        let titem={};
        item=item||this.data[0];
        fields.map(f=>{
            titem[f] = item[f];
        });
        return titem;
    }

    add(item) {
        item = Object.assign({}, this.dataObj, item);
        this.data.push(item);
        item["_idx_"] = this.idx++;
        item["_type_"] = "new";
        item["_path_"] = this.path;
        this._changeInfo._addIdxRows[item["_idx_"]] = item;
    }

    update(item, fields) {
        const titem = this._changeInfo._rawIdxData[item["_idx_"]];
        fields = fields || Object.keys(item);
        fields.forEach(field => {
            if (titem && Object.keys(titem).includes(field)) {
                if (titem[field] != item[field]) {
                    this._changeInfo._modifyIdxRows[item["_idx_"]] = item;
                }
            }
        })
    }

    del(idxOrItem) {
        let index = idxOrItem || 0;
        if (typeof(idxOrItem) == "object") {
            index = this.data.indexOf(idxOrItem);
        }
        if (index < 0 && index > this.data.length) {
            throw new Error("DataTable.del:index不正确");
        }
        let item = this.data.splice(index, 1)[0];
        if (item["_type_"] == "new") {
            delete this._changeInfo._addIdxRows[item["_idx_"]];
        } else {
            this._changeInfo._deleteIdxRows[item["_idx_"]] = item;
        }
    }

    clear() {
        for (let i = this.data.length - 1, item; i >= 0; i--) {
            item = this.data[i];
            this.del(item);
        }
    }

    count() {
        return this.data.length;
    }

    bindField(aFields) {
        aFields = aFields || [];
        for (let i = 0, field; i < aFields.length; i++) {
            field = aFields[i];
            let v = this.dataObj[field];
            if (typeof(v) == "undefined") {
                let robj = {};
                robj[field] = "";
                this.dataObj = Object.assign({}, this.dataObj, robj)
            }
        }
    }

    /**
     * 复制数据
     * @param {来源表格} fromTable 
     * @param {isAdd:是否添加,exFields:剔除字段} param1 
     */
    copyTable(fromTable, { isAdd, exFields }) {
        const fieldAll = fromTable.getFields();
        const data = fromTable.getData();
        exFields = exFields || [];
        modifyFields = modifyFields || [];
        if (!isAdd) {
            this.initData();
        }
        data.forEach(item => {
            let titem = {};
            fieldAll.forEach(field => {
                if (exFields.indexOf(field) == -1) {
                    titem[field] = item[field];
                }
            })
            this.add(titem);
        });
    }

    down({item,items}){
        items = items||this.data;
        let cidx = -2;
        items.forEach((titem, index) => {
            if (titem==item) {
                cidx = index;
            }
        });
        return items[cidx + 1];
    }

    up({item,items}){
        items = items||this.data;
        let cidx = -2;
        items.forEach((titem, index) => {
            if (titem==item) {
                cidx = index;
            }
        });
        return items[cidx - 1];
    }

    first({items}){
        items = items||this.data||[];
        return items[0];
    }

    last({items}){
        items = items||this.data||[];
        return items[items.length-1];
    }


    getFields(hasRef) {
        let fieldAll = [];
        this.data.forEach(function(item) {
            fieldAll = fieldAll.concat(Object.keys(item));
        })
        this._changeInfo._rawData.forEach(function(item) {
            fieldAll = fieldAll.concat(Object.keys(item));
        })
        fieldAll = Array.from(new Set(fieldAll));
        //乱七八糟的字段都要去掉
        fieldAll = fieldAll.filter((filed) => {
            return (filed.split('.').length < 2||hasRef===true) && ["_idx_", "_type_"].indexOf(filed) == -1 // && filed.split('.')[0] != filed.split('.')[1]
        })
        return fieldAll;
    }

    _filterValue(value) {
        if (typeof(value) == "undefined" || (typeof(value) == "number" && isNaN(value)) || value == Infinity) {
            value = "";
        }
        return value;
    }

    getXML() {
        let fieldAll = this.getFields();
        let strSave = '<?xml version="1.0" encoding="UTF-8"?>';
        let newitems = "";
        let modifyitems = "";
        let delitems = "";
        let rootitem = "<" + this.scm + ' l="u" c="' + fieldAll + '" t="">';

        Object.keys(this._changeInfo._addIdxRows).forEach((idx) => {
            let item = this._changeInfo._addIdxRows[idx];
            let newitem = "";
            fieldAll.forEach((field, i) => {
                newitem = newitem + " c" + i + '="' + encodeURIComponent(this._filterValue(item[field])) + '"';
            });
            newitems = newitems + "<r" + newitem + "/>";
        });
        newitems = "<a>" + newitems + "</a>";

        Object.keys(this._changeInfo._modifyIdxRows).forEach((idx) => {
            let item = this._changeInfo._modifyIdxRows[idx];
            let modifyitem = "";
            let titem = this._changeInfo._rawIdxData[idx];
            fieldAll.forEach((field, i) => {
                modifyitem = modifyitem + " c" + i + '="' + encodeURIComponent(this._filterValue(item[field])) + '"' + " oc" + i + '="' + encodeURIComponent(this._filterValue(titem[field])) + '"';
            });
            modifyitems = modifyitems + "<r" + modifyitem + "/>";
        });

        Object.keys(this._changeInfo._rawIdxData).forEach((idx) => {
            let item = this._changeInfo._rawIdxData[idx];
            let modifyitem = "";
            let titem = this._changeInfo._rawIdxData[idx];
            if (!this._changeInfo._modifyIdxRows[idx] && !this._changeInfo._deleteIdxRows[idx]) {
                fieldAll.forEach((field, i) => {
                    modifyitem = modifyitem + " c" + i + '="' + encodeURIComponent(this._filterValue(item[field])) + '"' + " oc" + i + '="' + encodeURIComponent(this._filterValue(titem[field])) + '"';
                });
                modifyitems = modifyitems + "<r" + modifyitem + "/>";
            }
        });

        modifyitems = "<m>" + modifyitems + "</m>";

        Object.keys(this._changeInfo._deleteIdxRows).forEach((idx) => {
            let item = this._changeInfo._deleteIdxRows[idx];
            let delitem = "";
            let titem = this._changeInfo._rawIdxData[idx];
            fieldAll.forEach((field, i) => {
                delitem = delitem + " oc" + i + '="' + encodeURIComponent(this._filterValue(titem[field])) + '"';
            });
            delitems = delitems + "<r" + delitem + "/>";
        });
        delitems = "<d>" + delitems + "</d>";
        var sts = newitems + modifyitems + delitems;
        strSave = strSave + rootitem + sts + "</" + this.scm + ">";
        return strSave;
    }

    acceptChange() {
        this.initData(this.data);
    }

    isModify() {
        return (Object.keys(this._changeInfo._modifyIdxRows).length + Object.keys(this._changeInfo._addIdxRows).length + Object.keys(this._changeInfo._deleteIdxRows).length) > 0;
    }

    isAdd() {
        return Object.keys(this._changeInfo._addIdxRows).length > 0
    }

    //备份数据
    backup() {
        let cache = [];
        let data = this._deepCopy(this.data, cache);
        let _changeInfo = this._deepCopy(this._changeInfo, cache);
        let idx = this.idx;
        this.__backdata = { data, _changeInfo, idx };
    }

    //恢复数据
    recovery() {
        if (this.__backdata) {
            Object.assign(this, this.__backdata);
            this.__backdata = null;
        }
    }
    _deepCopy(obj, cache = []) {
        // just return if obj is immutable value
        if (obj === null || typeof obj !== 'object') return obj;
        // if obj is hit, it is in circular structure
        const hit = cache.find(c => c.original === obj);
        if (hit) return hit.copy;
        const copy = Array.isArray(obj) ? [] : {};
        // put the copy into cache at first
        // because we want to refer it in recursive deepCopy
        cache.push({
            original: obj,
            copy,
        });
        Object.keys(obj).forEach(key => {
            if (key.indexOf('__') == 0) {
                return;
            }
            copy[key] = this._deepCopy(obj[key], cache);
        });
        return copy;
    }
}
export {
    DataTable
};