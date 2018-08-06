//var crypto = require('crypto');

var Translator = /** @class */ (function () {
    function Translator(data) {
        this._internal_mapping = {};
        this._data = null;
        this._internal_mapping["CGGL_NEW"] = { tab: "park.pa_venue", id: "venue_id" };
        this._internal_mapping["CGGL_DEL"] = { tab: "park.pa_venue", id: "venue_id" };
        this._internal_mapping["CGGL_MOD"] = { tab: "park.pa_venue", id: "venue_id" };
        this._internal_mapping["CGGL_QRY"] = { tab: "park.pa_venue", id: "venue_id" };
        this._internal_mapping["SHGL_NEW"] = { tab: "park.pa_merchant", id: "merchants_id" };
        this._internal_mapping["SHGL_DEL"] = { tab: "park.pa_merchant", id: "merchants_id" };
        this._internal_mapping["SHGL_MOD"] = { tab: "park.pa_merchant", id: "merchants_id" };
        this._internal_mapping["SHGL_QRY"] = { tab: "park.pa_merchant", id: "merchants_id" };
        this._internal_mapping["ZJGL_NEW"] = { tab: "park.pa_gate", id: "gate_id" };
        this._internal_mapping["ZJGL_DEL"] = { tab: "park.pa_gate", id: "gate_id" };
        this._internal_mapping["ZJGL_MOD"] = { tab: "park.pa_gate", id: "gate_id" };
        this._internal_mapping["ZJGL_QRY"] = { tab: "park.pa_gate", id: "gate_id" };
        this._internal_mapping["ZDGL_NEW"] = { tab: "park.pa_terminal", id: "terminal_id" };
        this._internal_mapping["ZDGL_DEL"] = { tab: "park.pa_terminal", id: "terminal_id" };
        this._internal_mapping["ZDGL_MOD"] = { tab: "park.pa_terminal", id: "terminal_id" };
        this._internal_mapping["ZDGL_QRY"] = { tab: "park.pa_terminal", id: "terminal_id" };
        this._internal_mapping["PWGL_NEW"] = { tab: "park.pa_ticket_", id: "id" };
        this._internal_mapping["PWGL_DEL"] = { tab: "park.pa_ticket_", id: "id" };
        this._internal_mapping["PWGL_MOD"] = { tab: "park.pa_ticket_", id: "id" };
        this._internal_mapping["PWGL_QRY"] = { tab: "park.pa_ticket_", id: "id" };
        this._internal_mapping["FSMP_SALE"] = {};
        this._internal_mapping["TEAM_SALE"] = {};
        this._internal_mapping["FSMP_GET"] = {};
        this._internal_mapping["FSMP_QRY"] = {};
        this._internal_mapping["FSMP_RET"] = {};
        this._internal_mapping["GGZP_NEW"] = { tab: "park.pa_public_relation", id: "id" };
        this._internal_mapping["GGZP_DEL"] = { tab: "park.pa_public_relation", id: "id" };
        this._internal_mapping["GGZP_MOD"] = { tab: "park.pa_public_relation", id: "id" };
        this._internal_mapping["GGZP_QRY"] = { tab: "park.pa_public_relation", id: "id" };
        this._internal_mapping["YHQP_NEW"] = { tab: "park.pa_discount", id: "id" };
        this._internal_mapping["YHQP_DEL"] = { tab: "park.pa_discount", id: "id" };
        this._internal_mapping["YHQP_MOD"] = { tab: "park.pa_discount", id: "id" };
        this._internal_mapping["YHQP_QRY"] = { tab: "park.pa_discount", id: "id" };
        this._internal_mapping["VIPU_NEW"] = {};
        this._internal_mapping["VIPU_DEL"] = {};
        this._internal_mapping["VIPU_MOD"] = {};
        this._internal_mapping["VIPU_QRY"] = {};
        this._internal_mapping["VIPC_NEW"] = {};
        this._internal_mapping["VIPC_DEL"] = {};
        this._internal_mapping["VIPC_MOD"] = {};
        this._internal_mapping["VIPC_QRY"] = {};
        this._internal_mapping["QDBB_QRY"] = {};
        this._internal_mapping["QDBB_DWL"] = {};
        this._internal_mapping["TBBB_QRY"] = {};
        this._internal_mapping["TBBB_DWL"] = {};
        this._internal_mapping["JJBB_QRY"] = {};
        this._internal_mapping["JJBB_DWL"] = {};
        this._internal_mapping["SPGL_NEW"] = { tab: "park.co_goods", id: "goods_id" };
        this._internal_mapping["SPGL_DEL"] = { tab: "park.co_goods", id: "goods_id" };
        this._internal_mapping["SPGL_MOD"] = { tab: "park.co_goods", id: "goods_id" };
        this._internal_mapping["SPGL_QRY"] = { tab: "park.co_goods", id: "goods_id" };
        this._internal_mapping["YGGL_NEW"] = {};
        this._internal_mapping["YGGL_DEL"] = {};
        this._internal_mapping["YGGL_QRY"] = {};
        this._internal_mapping["JSGL_NEW"] = {};
        this._internal_mapping["JSGL_DEL"] = {};
        this._internal_mapping["JSGL_MOD"] = {};
        this._internal_mapping["JSGL_QRY"] = {};
        this._internal_mapping["BMGL_NEW"] = {};
        this._internal_mapping["BMGL_DEL"] = {};
        this._internal_mapping["BMGL_MOD"] = {};
        this._internal_mapping["BMGL_QRY"] = {};
        this._internal_mapping["XTRZ_QRY"] = {};
        this._data = data;
    }
    Translator.prototype.tikectTabFilter = function (typeop, id, tab) {
        if (typeop.indexOf("PWGL") > -1) {
            if (id > 0 && id <= 300000) {
                //普通票
                return tab + "ordinary";
            }
            else if (id > 300000 && id <= 600000) {
                //套票
                return tab + "plan";
            }
            else if (id > 600000 && id <= 800000) {
                //团票
                return tab + "team";
            }
            else if (id > 800000) {
                //通票
                return tab + "through";
            }
        }
        else {
            return tab;
        }
    };
    Translator.prototype.approve = function (objid, typeop) {
        console.log('approve:');
        if (this._internal_mapping[typeop]) {
            var tab = this._internal_mapping[typeop].tab;
            var id = this._internal_mapping[typeop].id;
            var q = "UPDATE " + this.tikectTabFilter(typeop, objid, tab) + " SET approve_status = 1 WHERE " + id + " = " + objid + ";";
            console.log(q);
            return this._data.doSql({ sql: q, params: [] });
        }
        else {
            return Promise.reject('invalid typeop');
            ;
        }
    };
    ;
    return Translator;
}());


module.exports = Translator;