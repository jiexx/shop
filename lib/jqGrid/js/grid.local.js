$.extend($.fn.jqGrid, { setData: function(data) {
		this[0].p.data = data;
		return true;
	} 
});
var SelfGrid = {
	pager_customized: function(){
		jQuery("#jqGridPager01_left").css("padding-top","5px");;
		var center = jQuery("#jqGridPager01_center");
		center.html('');
		center.append('<table cellspacing="0" cellpadding="0" border="0" style="table-layout:auto;padding-top:2px" class="ui-pg-table"><tbody><tr>');
		center.append('<td id="prev_page" class="ui-pg-button ui-corner-all" style="cursor: default;"><span class="ui-icon ui-icon-seek-prev"></span></td>');
		center.append('<td>&nbsp;<input  type="text" size="2" maxlength="7" value="'+(this.page_index+1)+'" role="textbox">共<span>'+this.total_pages+'</span>页&nbsp;</td>');
		center.append('<td id="next_page" class="ui-pg-button ui-corner-all" style="cursor: default;"><span class="ui-icon ui-icon-seek-next"></span></td></tr></tbody></table>');
		var last = (this.page_index+1)*this.num_per_page;
		var right = jQuery("#jqGridPager01_right");
		right.html('');
		right.append('<div  style="text-align:right" >'
			+((this.page_index)*this.num_per_page+1)+' - '+(last>this.total_records?this.total_records:last)+'　&nbsp;共&nbsp;'+this.total_records+' &nbsp;条&nbsp;</div>');

		var that = this;
		jQuery("#prev_page").click(function(e) {
			e.preventDefault();
			if(that.page_index - 1 > -1){
				that.page_index --;
				if(that.onPagedown){
					that.onPagedown(that.page_index*that.num_per_page);
				}
			}
		});
		jQuery("#next_page").click(function(e) {
			e.preventDefault();
			if(that.page_index + 1 < that.total_pages){
				that.page_index ++;
				if(that.onPagedown){
					that.onPagedown(that.page_index*that.num_per_page);
				}
			}
		});
	},
	unload: function(){
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
	go: function(){
		if(this.onPagedown){
			this.onPagedown(this.page_index*this.num_per_page);
		}
	},
    create: function(caption, jqid, pager, colNames, colModels, onPagedown, onNew, onDelete, onUpdate) {
        var obj = {
            grid: jQuery(jqid),
			load: SelfGrid.load,
			unload: SelfGrid.unload,
			pager_customized: SelfGrid.pager_customized,
			go: SelfGrid.go,
			lastsel3: null,
			page_index: 0,
			num_per_page: 10,
			total_pages: 0,
			total_records: 0,
			onPagedown : onPagedown,
			onNew: onNew,
			onDelete: onDelete,
			onUpdate: onUpdate,
        };
		var onclick_edit_local = function(options, postdata) {
			console.log(postdata);
			obj.grid.jqGrid('setRowData', lastsel3, postdata);
			options.processing = true;
			jQuery('.ui-jqdialog-titlebar-close').click();
			return {};
		};
		var onclick_add_local = function(options, postdata) {
			console.log(postdata);
			obj.grid.jqGrid('addRowData', 0, postdata);
			options.processing = true;
			jQuery('.ui-jqdialog-titlebar-close').click();
			return {};
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
                if (id !== obj.lastsel3) {
                    obj.grid.jqGrid("saveRow", obj.lastsel3, true);
                    obj.lastsel3 = id;
                }
                obj.grid.jqGrid('editRow', id, true);

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
        });
        obj.grid
            .navGrid(pager, {
                edit: false,
                add: false,
                del: false,
                search: false,
                refresh: false
            })
            .navButtonAdd(pager, {
                caption: "",
                buttonicon: "ui-icon-refresh",
                onClickButton: function() {
                    alert("refresh Row");
                },
                position: "last"
            })
            .navButtonAdd(pager, {
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
            })
            .navButtonAdd(pager, {
                caption: "编辑",
                buttonicon: "ui-icon-pencil",
                onClickButton: function() {
                    if (!lastsel3) {
                        $.jgrid.info_dialog.call(this,
                            "提醒", // dialog title
                            "请选择数据行!", // text inside of dialog
                            "", // text in the button
                        );
                    } else {
                        obj.grid.jqGrid('editGridRow', lastsel3, {
                            top: 100,
                            left: 30,
                            reloadAfterSubmit: true,
                            closeAfterEdit: true,
                            closeOnEscape: true,
                            onclickSubmit: onclick_edit_local
                        });
                        console.log(obj.grid.jqGrid('getGridParam', 'data'));
                    }
                },
                position: "last"
            })
            .navButtonAdd(pager, {
                caption: "添加",
                buttonicon: "ui-icon-plus",
                onClickButton: function() {
                    obj.grid.jqGrid('editGridRow', "new", {
                        //height: 280,
                        reloadAfterSubmit: false,
                        closeOnEscape: true,
                        onclickSubmit: onclick_add_local
                    });
                },
                position: "last"
            })
            .navButtonAdd(pager, {
                caption: "删除",
                buttonicon: "ui-icon-trash",
                onClickButton: function() {
                    if (!lastsel3) {
                        $.jgrid.info_dialog.call(this,
                            "提醒", // dialog title
                            "请选择数据行!", // text inside of dialog
                            "", // text in the button
                        );
                    } else {
                        obj.grid.jqGrid('delRowData', lastsel3);
                        console.log(obj.grid.jqGrid('getGridParam', 'data'));
                    }
                    //jQuery('#grid').jqGrid('getGridParam', 'selrow');
                    return true;
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
