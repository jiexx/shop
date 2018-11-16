import { Pipe } from "@angular/core";
import { TableColumn } from "./table.column";

@Pipe({
    name: 'visiable',
})
export class TableColumnVisiable {

    transform(tc: TableColumn[], td: any[][] = null): TableColumn[] {
        if(tc) {
            return tc.filter(o => {
                return o.visible === true;
            });
        }
    }

}