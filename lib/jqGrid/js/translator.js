var wf_internal_mapping = {};
var SHOWHOST = "http://tmg.china-flame.cn/dashboard.html";
wf_internal_mapping["CGGL_NEW"] = SHOWHOST + "#/siteMag/venue/venueSee?id=";
wf_internal_mapping["CGGL_DEL"] = SHOWHOST + "#/siteMag/venue/venueSee?id=";
wf_internal_mapping["CGGL_MOD"] = SHOWHOST + "#/siteMag/venue/venueSee?id=";
wf_internal_mapping["CGGL_QRY"] = SHOWHOST + "#/siteMag/venue/venueSee?id=";
wf_internal_mapping["SHGL_NEW"] = SHOWHOST + "#/siteMag/merchant/merchantSee?id=";
wf_internal_mapping["SHGL_DEL"] = SHOWHOST + "#/siteMag/merchant/merchantSee?id=";
wf_internal_mapping["SHGL_MOD"] = SHOWHOST + "#/siteMag/merchant/merchantSee?id=";
wf_internal_mapping["SHGL_QRY"] = SHOWHOST + "#/siteMag/merchant/merchantSee?id=";
wf_internal_mapping["ZJGL_NEW"] = SHOWHOST + "#/siteMag/machine/machineSee?id=";
wf_internal_mapping["ZJGL_DEL"] = SHOWHOST + "#/siteMag/machine/machineSee?id=";
wf_internal_mapping["ZJGL_MOD"] = SHOWHOST + "#/siteMag/machine/machineSee?id=";
wf_internal_mapping["ZJGL_QRY"] = SHOWHOST + "#/siteMag/machine/machineSee?id=";
wf_internal_mapping["ZDGL_NEW"] = SHOWHOST + "#/siteMag/terminal/terminalSee?id=";
wf_internal_mapping["ZDGL_DEL"] = SHOWHOST + "#/siteMag/terminal/terminalSee?id=";
wf_internal_mapping["ZDGL_MOD"] = SHOWHOST + "#/siteMag/terminal/terminalSee?id=";
wf_internal_mapping["ZDGL_QRY"] = SHOWHOST + "#/siteMag/terminal/terminalSee?id=";
wf_internal_mapping["PWGL_NEW"] = SHOWHOST + "#/tickets/ticketManage/ticketShow?id=";
wf_internal_mapping["PWGL_DEL"] = SHOWHOST + "#/tickets/ticketManage/ticketShow?id=";
wf_internal_mapping["PWGL_MOD"] = SHOWHOST + "#/tickets/ticketManage/ticketShow?id=";
wf_internal_mapping["PWGL_QRY"] = SHOWHOST + "#/tickets/ticketManage/ticketShow?id=";
wf_internal_mapping["FSMP_SALE"] = "";
wf_internal_mapping["TEAM_SALE"] = "";
wf_internal_mapping["FSMP_GET"] = "";
wf_internal_mapping["FSMP_QRY"] = "";
wf_internal_mapping["FSMP_RET"] = "";
wf_internal_mapping["GGZP_NEW"] = SHOWHOST + "#/tickets/give/giveSee?id=";
wf_internal_mapping["GGZP_DEL"] = SHOWHOST + "#/tickets/give/giveSee?id=";
wf_internal_mapping["GGZP_MOD"] = SHOWHOST + "#/tickets/give/giveSee?id=";
wf_internal_mapping["GGZP_QRY"] = SHOWHOST + "#/tickets/give/giveSee?id=";
wf_internal_mapping["YHQP_NEW"] = SHOWHOST + "#/tickets/couponManage/conponShow?id=";
wf_internal_mapping["YHQP_DEL"] = SHOWHOST + "#/tickets/couponManage/conponShow?id=";
wf_internal_mapping["YHQP_MOD"] = SHOWHOST + "#/tickets/couponManage/conponShow?id=";
wf_internal_mapping["YHQP_QRY"] = SHOWHOST + "#/tickets/couponManage/conponShow?id=";
wf_internal_mapping["VIPU_NEW"] = "";
wf_internal_mapping["VIPU_DEL"] = "";
wf_internal_mapping["VIPU_MOD"] = "";
wf_internal_mapping["VIPU_QRY"] = "";
wf_internal_mapping["VIPC_NEW"] = "";
wf_internal_mapping["VIPC_DEL"] = "";
wf_internal_mapping["VIPC_MOD"] = "";
wf_internal_mapping["VIPC_QRY"] = "";
wf_internal_mapping["QDBB_QRY"] = "";
wf_internal_mapping["QDBB_DWL"] = "";
wf_internal_mapping["TBBB_QRY"] = "";
wf_internal_mapping["TBBB_DWL"] = "";
wf_internal_mapping["JJBB_QRY"] = "";
wf_internal_mapping["JJBB_DWL"] = "";
wf_internal_mapping["SPGL_NEW"] = SHOWHOST + "#/productShow?goodsId=";
wf_internal_mapping["SPGL_DEL"] = SHOWHOST + "#/productShow?goodsId=";
wf_internal_mapping["SPGL_MOD"] = SHOWHOST + "#/productShow?goodsId=";
wf_internal_mapping["SPGL_QRY"] = SHOWHOST + "#/productShow?goodsId=";
wf_internal_mapping["YGGL_NEW"] = "";
wf_internal_mapping["YGGL_DEL"] = "";
wf_internal_mapping["YGGL_QRY"] = "";
wf_internal_mapping["JSGL_NEW"] = "";
wf_internal_mapping["JSGL_DEL"] = "";
wf_internal_mapping["JSGL_MOD"] = "";
wf_internal_mapping["JSGL_QRY"] = "";
wf_internal_mapping["BMGL_NEW"] = "";
wf_internal_mapping["BMGL_DEL"] = "";
wf_internal_mapping["BMGL_MOD"] = "";
wf_internal_mapping["BMGL_QRY"] = "";
wf_internal_mapping["XTRZ_QRY"] = "";



$.translate_detail = function(objid, typeop) {
    if (wf_internal_mapping[typeop]) {
        var url = wf_internal_mapping[typeop] + objid;
        var win = window.open(url, '_blank');
        win.focus();
    } else {
        alert('审批单无效');
    }
}