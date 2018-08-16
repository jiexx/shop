exports.full = function(){
    var d = new Date();
    return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDay()+' '+d.getHours()+':'+d.getMinutes()+' '+d.getMinutes()+' ';
}
