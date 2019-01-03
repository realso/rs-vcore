/**
 * 数据管理对象
 */
import { DataTable } from "./DataTable";
class EditDataTable extends DataTable  {
    constructor(path, scm) {
        super(path,scm);
        //编辑者
        this.editer = null; 
        this.ETYPE = "";
    }

    setEdit({ETYPE,item}){
        if(!this.editer)
            this.editer = new DataTable(`_${this.path}_edit`,this.scm);
        this.editer.initData();    
        this.ETYPE = ETYPE;
        item = item||{};
        this.editItem = item;
        if("ADD"==ETYPE){
            this.editer.add(item);
        }
        if("EDIT"==ETYPE){
          item = this.getRawItem(item);
          this.editer.add(item);
        }
        this.editer.acceptChange();
        return this.editer.data[0];
    }

    applyEdit(){
        let item = this.editer.getRawItem(this.editer.data[0]);
        if("ADD"==this.ETYPE){
           this.add(item);
        }
        if("EDIT"==this.ETYPE){
           this.setValues(item,this.editItem);
        }
        this.ETYPE = "";
        return this.editItem
    }

    cancelEdit(){
        this.ETYPE = "";
        this.editer.initData();
        return this.editItem
    }

    getValue(field, idxOrItem) {
        if(this.ETYPE&&this.idxOrItem==this.editer.data[0]){
            return this.editer.getValue(field, idxOrItem);
        }else{
            return super.getValue(field, idxOrItem);
        }
    }

    setValue(field, value, idxOrItem) {
        if(this.ETYPE&&this.idxOrItem==this.editer.data[0]){
            return this.editer.setValues(field,value,idxOrItem);
        }else{
            return super.setValue(field,value,idxOrItem);
        }
    }

    setValues(titem, idxOrItem) {
        if(this.ETYPE&&this.idxOrItem==this.editer.data[0]){
            return this.editer.setValues(titem, idxOrItem);
        }else{
            return super.setValues(titem, idxOrItem);
        }
    }

    acceptChange() {
        if(this.ETYPE){
            return this.editer.acceptChange();
        }else{
            return super.acceptChange();
        }
    }

    isModify() {
        if(this.ETYPE){
            return this.editer.isModify();
        }else{
            return super.isModify();
        }
    }

    isAdd() {
        if(this.ETYPE){
            return this.editer.isAdd();
        }else{
            return super.isAdd();
        }
    }

}
export {
    EditDataTable
};