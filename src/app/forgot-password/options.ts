const options = {
    "name": "List Create Teachers Api",
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
            "username": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "School NEMIS Code / Phone Number",
                "placeholder": "e.g. 07XX-XXX-XXX"
            }
        }
    }
}


export {
    options
}