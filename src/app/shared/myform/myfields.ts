const MY_EXAMPLE_OPTIONS_DATA: any = {
    "name": "List Create Item Configs Api",
    "description": "",
    "renders": [
        "application/json",
        "text/html"
    ],
    "parses": [
        "application/json",
        "application/x-www-form-urlencoded",
        "multipart/form-data"
    ],
    "actions": {
        "POST": {
            "id": {
                "type": "integer",
                "required": false,
                "read_only": true,
                "label": "ID"
            },
            "type_name": {
                "type": "string",
                "required": false,
                "read_only": true,
                "label": "Type name"
            },
            "created": {
                "type": "datetime",
                "required": false,
                "read_only": true,
                "label": "Created"
            },
            "modified": {
                "type": "datetime",
                "required": false,
                "read_only": true,
                "label": "Modified"
            },
            "name": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Name",
                "max_length": 50
            },
            "description": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Description",
                "max_length": 400
            },
            "has_serial": {
                "type": "boolean",
                "required": false,
                "read_only": false,
                "label": "Has serial"
            },
            "accept_terms": {
                "type": "boolean",
                "required": false,
                "read_only": false,
                "label": "Accpet serial"
            },
            "type": {
                "type": "field",
                "required": true,
                "read_only": false,
                "display_name": "name",
                "url": "https://api.spark.sisitech.dev/api/v1/item-type-configs/",
                "label": "Type",
            }
        }
    }
};
export {
    MY_EXAMPLE_OPTIONS_DATA
}