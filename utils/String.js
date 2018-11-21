export const execFormula = function(field, getFormula, getValue) {
    var vv = getFormula(field);
    var avv = vv.split(/\+|-|\*|\/|\(|\)/);
    if (!vv) {
        vv = getValue(vv);
    } else {
        for (var i = 0, v; i < avv.length; i++) {
            v = avv[i];
            if (parseFloat(v) != v) {
                vv = vv.replace(v, execFormula(v, Formula, getValue));
            }
        }
    }
    try {
        return eval(vv);
    } catch (e) {
        throw new Error("公式：" + getFormula(field) + ":" + vv + "错误！");
    }
}