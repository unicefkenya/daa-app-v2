
enum InputType {
    integer,
    datetime,
    string
}

class MyInputModel {
    name: String;
    type: string;
    required: boolean;
    read_only: boolean;
    options: any
    constructor(
        name: String,
        type?: string,
        required?: boolean,
        read_only?: boolean,
        options?: any
    ) {
        this.name = name
        this.options = options || {}
        this.type = type || ""
        this.required = required || false
        this.read_only = read_only || false
    }

    static fromJson(name: string, obj: any): MyInputModel {
        return new MyInputModel(name, obj.type, obj.requied,
            obj.read_only, obj.choices || {});
    }
}


export {
    InputType,
    MyInputModel
}