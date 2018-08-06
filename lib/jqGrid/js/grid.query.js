$.extend($.fn.jqGrid, {
    setData: function(data) {
        this[0].p.data = data;
        return true;
    }
});
$.parse_query_string = function(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}
$.query_string = function(param) {
    var query = window.location.search.substring(1);
    var qs = $.parse_query_string(query);
    return qs[param];
};


var SelfGrid = {
    pager_customized: function() {
        jQuery("#jqGridPager01_left").css("padding-top", "5px");;
        var center = jQuery("#jqGridPager01_center");
        center.html('');
        center.append('<table cellspacing="0" cellpadding="0" border="0" style="table-layout:auto;padding-top:2px" class="ui-pg-table"><tbody><tr>');
        center.append('<td id="prev_page" class="ui-pg-button ui-corner-all" style="cursor: default;"><span class="ui-icon ui-icon-seek-prev"></span></td>');
        center.append('<td>&nbsp;<input  type="text" size="2" maxlength="7" value="' + (this.page_index + 1) + '" role="textbox">共<span>' + this.total_pages + '</span>页&nbsp;</td>');
        center.append('<td id="next_page" class="ui-pg-button ui-corner-all" style="cursor: default;"><span class="ui-icon ui-icon-seek-next"></span></td></tr></tbody></table>');
        var last = (this.page_index + 1) * this.num_per_page;
        var right = jQuery("#jqGridPager01_right");
        right.html('');
        right.append('<div  style="text-align:right" >' +
            ((this.page_index) * this.num_per_page + 1) + ' - ' + (last > this.total_records ? this.total_records : last) + '　&nbsp;共&nbsp;' + this.total_records + ' &nbsp;条&nbsp;</div>');

        var that = this;
        jQuery("#prev_page").click(function(e) {
            e.preventDefault();
            if (that.page_index - 1 > -1) {
                that.page_index--;
                if (that.onPagedown) {
                    that.onPagedown(that.page_index * that.num_per_page);
                }
            }
        });
        jQuery("#next_page").click(function(e) {
            e.preventDefault();
            if (that.page_index + 1 < that.total_pages) {
                that.page_index++;
                if (that.onPagedown) {
                    that.onPagedown(that.page_index * that.num_per_page);
                }
            }
        });
    },
    unload: function() {
        this.grid.jqGrid('clearGridData');
    },
    load: function(myData, total_pages, total_records) {
        //this.grid.jqGrid('setGridParam', { 
        //    datatype: 'local',
        //	  rowNum:total_pages,
        //    data:myData
        //});

        this.total_pages = total_pages;
        this.total_records = total_records;
        this.pager_customized();
        this.grid.jqGrid('setData', myData);
        this.grid.trigger("reloadGrid");
    },
    go: function() {
        if (this.onPagedown) {
            this.onPagedown(this.page_index * this.num_per_page);
        }
    },
    create: function(caption, jqid, pager, colNames, colModels, onPagedown, beforeUpdate, beforeAdd) {
        var obj = {
            grid: jQuery(jqid),
            load: SelfGrid.load,
            unload: SelfGrid.unload,
            pager_customized: SelfGrid.pager_customized,
            go: SelfGrid.go,
            lastsel3: null,
            page_index: 0,
            num_per_page: 20,
            total_pages: 0,
            total_records: 0,
            onPagedown: onPagedown,



            beforeUpdate: beforeUpdate,
            beforeAdd: beforeAdd,

        };
        var onclick_edit_local = function(options, postdata) {
            console.log(postdata);
            obj.grid.jqGrid('setRowData', obj.lastsel3, postdata);
            options.processing = true;
            var data = obj.grid.jqGrid('getRowData', obj.lastsel3);
            if (obj.onUpdate) {
                obj.onUpdate(data);
            }
            jQuery('.ui-jqdialog-titlebar-close').click();
            return {};
        };
        var onclick_add_local = function(options, postdata) {
            console.log(postdata);
            //obj.grid.jqGrid('addRowData', 0, postdata);
            options.processing = true;
            if (obj.onNew) {
                obj.onNew(postdata);
            }
            if (jQuery('.ui-jqdialog-titlebar-close')) {
                jQuery('.ui-jqdialog-titlebar-close').click();
            }

            return {};
        };
        var before_edit_local = function(form) {
            if (obj.beforeUpdate) {
                obj.beforeUpdate(form);
            }
        };
        var before_add_local = function(form) {
            if (obj.beforeAdd) {
                obj.beforeAdd(form);
            }
        };
        $(".content").height($(window).height() - 250);

        obj.grid.jqGrid({
            //data: myData,
            datatype: "local",
            height: $('.content').height(), // Auto height step 2,
            rowNum: obj.num_per_page,
            rowList: [10, 20, 30],
            colNames: colNames,
            colModel: colModels,
            onSelectRow: function(id) {
                //  console.log("id:" + id);
                if (id !== obj.lastsel3) {
                    // obj.grid.jqGrid("saveRow", obj.lastsel3, true);
                    $('#' + obj.lastsel3).find("td").css("color", "#000");
                    //  $('#' + obj.lastsel3).find("td").removeClass();
                    obj.lastsel3 = id;
                    // $('#' + id).addClass("SelectBG");
                    $('#' + id).find("td").css("color", "#3C8DBC");
                    $('#' + id).find("td").css("bold", "true");
                    // console.log("!!" + JSON.stringify($('#' + id).find("td")));


                }
                //obj.grid.jqGrid('editRow', id, true);

            },
            //loadComplete : pager_customized,
            pager: pager,
            viewrecords: true,
            add: true,
            edit: true,
            addtext: 'Add',
            edittext: 'Edit',
            caption: caption,
            hidegrid: false,
            gridComplete: function() {
                var ids = $("#jqGrid01").getDataIDs();
                for (var i = 0; i < ids.length; i++) {
                    var rowData = $("#jqGrid01").getRowData(ids[i]);
                    // if (rowData.Audit == "不通过") { //如果审核不通过，则背景色置于红色
                    //     $('#' + ids[i]).find("td").addClass("SelectBG");
                    // }
                    $('#' + ids[i]).find("td").addClass("SelectBG");
                }

                $("#" + this.id).jqGrid('setSelection', obj.lastsel3);
            }
        });

        obj.grid.navGrid(pager, {
            edit: false,
            add: false,
            del: false,
            search: false,
            refresh: false
        });
        obj.grid.navButtonAdd(pager, {
            caption: "",
            buttonicon: "ui-icon-refresh",
            onClickButton: function() {
                alert("refresh Row");
            },
            position: "last"
        });
        obj.grid.navButtonAdd(pager, {
            caption: "",
            buttonicon: "ui-icon-search",
            onClickButton: function() {
                jQuery("#jqGrid01").jqGrid('searchGrid', {
                    onSearch: function(data) {
                        console.log(data)
                    }
                });
            },
            position: "last"
        });




        obj.grid.jqGrid('filterToolbar', {
            defaultSearch: true,
            stringResult: true
        });
        obj.grid.jqGrid('setGridWidth', $(".content").width(), true);
        //$(".ui-jqgrid-titlebar").hide();

        return obj;
    }
};