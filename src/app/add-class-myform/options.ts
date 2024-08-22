const streamsOptions = {
    "name": "List Create Streams Api",
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
            "school_name": {
                "type": "string",
                "required": false,
                "read_only": true,
                "label": "School name"
            },
            "class_name": {
                "type": "field",
                "required": false,
                "read_only": true,
                "label": "Class name"
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
                "required": false,
                "read_only": false,
                "label": "Name",
                "max_length": 45
            },
            "last_attendance": {
                "type": "date",
                "required": false,
                "read_only": false,
                "label": "Last attendance"
            },
            "base_class": {
                "type": "choice",
                "required": true,
                "read_only": false,
                "label": "Class",
                "choices": [
                    {
                        "value": "1",
                        "display_name": "1"
                    },
                    {
                        "value": "2",
                        "display_name": "2"
                    },
                    {
                        "value": "3",
                        "display_name": "3"
                    },
                    {
                        "value": "4",
                        "display_name": "4"
                    },
                    {
                        "value": "5",
                        "display_name": "5"
                    },
                    {
                        "value": "6",
                        "display_name": "6"
                    },
                    {
                        "value": "7",
                        "display_name": "7"
                    },
                    {
                        "value": "8",
                        "display_name": "8"
                    }
                ]
            },
            "moe_id": {
                "type": "string",
                "required": false,
                "read_only": false,
                "label": "Moe id",
                "max_length": 50
            },
            "moe_section_id": {
                "type": "string",
                "required": false,
                "read_only": false,
                "label": "Moe section id",
                "max_length": 45
            },
            "moe_name": {
                "type": "string",
                "required": false,
                "read_only": false,
                "label": "Moe name",
                "max_length": 45
            },
            "moe_section_name": {
                "type": "string",
                "required": false,
                "read_only": false,
                "label": "Moe section name",
                "max_length": 45
            },
            "school": {
                "type": "field",
                "required": true,
                "read_only": false,
                "label": "School"
            }
        }
    }
}

export {
    streamsOptions
}