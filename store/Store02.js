import { DataTable } from "./DataTable";
import { BaseStore, Constants as SConstants } from "./BaseStore";

const Constants = Object.assign({}, SConstants, {});

class Store02 extends BaseStore {
    constructor(config) {
        super(config);
    }
    mixState() {
        return super.mixState()
    }
    mixActions() {
        return super.mixActions()
    }
    mixMutations() {
        return super.mixMutations()
    }
}
export { Store02, Constants }