import { TableComponent } from '../table/table.component';
import { Column } from '../table/column';


export class ProductTable extends TableComponent{
    load(d: any): any {
        this.loading = true;
        this.cols = [new Column('t1','列1',true),new Column('t2','列2',true)];
        this.model = [{c1:'col1',c2:1},{c1:'test',c2:2},{c1:'hello',c2:2},{c1:'world',c2:3}];
    }
}