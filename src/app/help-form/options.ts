const options = {
    "name": "List Create Support Requests Api",
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
                "type": "field",
                "required": false,
                "read_only": true,
                "label": "School name"
            },
            "school_emis_code": {
                "type": "field",
                "required": false,
                "read_only": true,
                "label": "School emis code"
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
            "email": {
                "type": "email",
                "required": true,
                "read_only": false,
                "label": "Email",
                "max_length": 254
            },
            "name": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Name",
                "max_length": 45
            }, 
            "subject": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Subject",
                "max_length": 250
            },
            "body": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Body",
                "max_length": 3000
            },
            "phone": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Phone",
                "max_length": 20
            },
            "school": {
                "type": "field",
                "required": true,
                "read_only": false,
                "label": "School"
            },
            "user": {
                "type": "field",
                "required": false,
                "read_only": false,
                "label": "User"
            }
        }
    }
}

export {
    options
}
