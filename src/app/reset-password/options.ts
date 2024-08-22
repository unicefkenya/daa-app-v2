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
            "reset_code": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Reset Code",
                "placeholder": "Password Reset code"
            },
            "new_password": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "New Password",
                "obscure": true,
                "placeholder": "New Password"
            },
            "confirm_password": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Confirm Password",
                "obscure": true,
                "placeholder": "Verify Password"
            }
        }
    }
}


export {
    options
}