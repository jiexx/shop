export class Column {
    constructor(
        public name: string,
        public alias: string, 
        public visible: boolean,
        public type: number, //0-disable; 1-string; 2-password; 3-select, 
        public options: any = null
    ) {}

    public static isnull(val:any,hint:string):any{
        return {no:!val,info:hint+' 为空!'};
    }
    public static isnphone(val:string,hint:string):any{
        return{no:!(/^1[3|4|5|7|8][0-9]{9}$/.test(val)),info:hint+'无效电话号码!'};
    }
}