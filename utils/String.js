export const execFormula = function(field, getFormula, getValue) {
    var vv = getFormula(field);
    var avv = vv.split(/\+|-|\*|\/|\(|\)/);
    if (!vv) {
        vv = getValue(field);
    } else {
        for (var i = 0, v; i < avv.length; i++) {
            v = avv[i];
            if (parseFloat(v) != v) {
                vv = vv.replace(v, execFormula(v, getFormula, getValue));
            }
        }
    }
    try {
        return eval(vv);
    } catch (e) {
        throw new Error("公式：" + getFormula(field) + ":" + vv + "错误！");
    }
}

export const isNull = function(value) {
    return (!value && value != "0")
}

export const isNumber = function(value) {
    return parseFloat(value) == value;
}

export const toNumber = function(value) {
    return !isNumber(value) ? 0 : parseFloat(value);
}