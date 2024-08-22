const sStudentoptions = {
    "name": "List Create Students Api",
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
            "stream_name": {
                "type": "string",
                "required": false,
                "read_only": true,
                "label": "Stream name"
            },
            "base_class": {
                "type": "string",
                "required": false,
                "read_only": true,
                "label": "Class"
            },
            "full_name": {
                "type": "field",
                "required": false,
                "read_only": true,
                "label": "Full name"
            },
            "student_id": {
                "type": "field",
                "required": false,
                "read_only": true,
                "label": "Student id"
            },
            "special_needs_details": {
                "type": "field",
                "required": false,
                "read_only": true,
                "label": "Special needs details",
                "child": {
                    "type": "nested object",
                    "required": false,
                    "read_only": true,
                    "children": {
                        "id": {
                            "type": "integer",
                            "required": false,
                            "read_only": true,
                            "label": "ID"
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
                            "max_length": 100
                        },
                        "abbreviation": {
                            "type": "string",
                            "required": false,
                            "read_only": false,
                            "label": "Abbreviation",
                            "max_length": 10
                        }
                    }
                }
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
            "emis_code": {
                "type": "integer",
                "required": false,
                "read_only": false,
                "label": "Emis code",
                "min_value": -9223372036854775808,
                "max_value": 9223372036854775807
            },
            "first_name": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "First Name",
                "max_length": 200
            },
            "middle_name": {
                "type": "string",
                "required": false,
                "read_only": false,
                "label": "Middle Name",
                "max_length": 200
            },
            "last_name": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Last Name",
                "max_length": 200
            },
            "knows_dob": {
                "type": "boolean",
                "required": true,
                "read_only": false,
                "label": "Do You Know the Date of Birth",
                "default": true,
                "max_length": 200
            },
            "age": {
                "type": "integer",
                "required": true,
                "read_only": false,
                "label": "Age Estimate",
                "from_field": "knows_dob",
                "show_only": false,
                "max_length": 200
            },
            "date_of_birth": {
                "type": "date",
                "required": true,
                "read_only": false,
                "label": "Date of Birth",
                "from_field": "knows_dob",
                "show_only": true,
            },
            "date_enrolled": {
                "type": "date",
                "required": true,
                "read_only": false,
                "label": "Date of Admission"
            },
            "admission_no": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Admission Number",
                "max_length": 50
            },
            "gender": {
                "type": "field",
                "required": true,
                "read_only": false,
                "label": "Gender",
                "choices": [
                    {
                        "value": "M",
                        "display_name": "Male"
                    },
                    {
                        "value": "F",
                        "display_name": "Female"
                    }
                ]
            },
            "previous_class": {
                "type": "integer",
                "required": false,
                "read_only": false,
                "label": "Previous class",
                "min_value": -2147483648,
                "max_value": 2147483647
            },
            "mode_of_transport": {
                "type": "choice",
                "required": false,
                "read_only": false,
                "label": "Mode of transport",
                "choices": [
                    {
                        "value": "PERSONAL",
                        "display_name": "Personal Vehicle"
                    },
                    {
                        "value": "BUS",
                        "display_name": "School Bus"
                    },
                    {
                        "value": "FOOT",
                        "display_name": "By Foot"
                    },
                    {
                        "value": "NS",
                        "display_name": "Not Set"
                    }
                ]
            },
            "time_to_school": {
                "type": "choice",
                "required": false,
                "read_only": false,
                "label": "Time to school",
                "choices": [
                    {
                        "value": "1HR",
                        "display_name": "One Hour"
                    },
                    {
                        "value": "-0.5HR",
                        "display_name": "Less than 1/2 Hour"
                    },
                    {
                        "value": "+1HR",
                        "display_name": "More than one hour."
                    },
                    {
                        "value": "NS",
                        "display_name": "Not Set"
                    }
                ]
            },
            "distance_from_school": {
                "type": "integer",
                "required": false,
                "read_only": false,
                "label": "Distance From School (In Kms)",
                "min_value": -2147483648,
                "max_value": 2147483647
            },
            "household": {
                "type": "integer",
                "required": false,
                "read_only": false,
                "label": "Household",
                "min_value": -2147483648,
                "max_value": 2147483647
            },
            "meals_per_day": {
                "type": "integer",
                "required": false,
                "read_only": false,
                "label": "Meals per day",
                "min_value": -2147483648,
                "max_value": 2147483647
            },
            "not_in_school_before": {
                "type": "boolean",
                "required": false,
                "read_only": false,
                "label": "Not in school before"
            },
            "emis_code_histories": {
                "type": "string",
                "required": false,
                "read_only": false,
                "label": "Emis code histories",
                "max_length": 200
            },
            "total_attendance": {
                "type": "integer",
                "required": false,
                "read_only": false,
                "label": "Total attendance",
                "min_value": -2147483648,
                "max_value": 2147483647
            },
            "total_absents": {
                "type": "integer",
                "required": false,
                "read_only": false,
                "label": "Total absents",
                "min_value": -2147483648,
                "max_value": 2147483647
            },
            "last_attendance": {
                "type": "date",
                "required": false,
                "read_only": false,
                "label": "Last attendance"
            },
            "guardian_name": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Guardian Name",
                "max_length": 50
            },
            "guardian_phone": {
                "type": "string",
                "required": true,
                "read_only": false,
                "label": "Guardian Phone Number",
                "max_length": 20
            },
            "guardian_status": {
                "type": "choice",
                "required": false,
                "read_only": false,
                "label": "Guardian Status",
                "choices": [
                    {
                        "value": "B",
                        "display_name": "Both Parents"
                    },
                    {
                        "value": "S",
                        "display_name": "Single Parent"
                    },
                    {
                        "value": "N",
                        "display_name": "None"
                    },
                    {
                        "value": "NS",
                        "display_name": "Not Set"
                    }
                ]
            },
            "guardian_email": {
                "type": "email",
                "required": false,
                "read_only": false,
                "label": "Guardian Email Address",
                "max_length": 45
            },
            "village": {
                "type": "string",
                "required": false,
                "read_only": false,
                "label": "Village",
                "max_length": 45
            },
            "active": {
                "type": "boolean",
                "required": false,
                "read_only": false,
                "label": "Active"
            },
            "graduated": {
                "type": "boolean",
                "required": false,
                "read_only": false,
                "label": "Graduated"
            },
            "dropout_reason": {
                "type": "string",
                "required": false,
                "read_only": false,
                "label": "Dropout reason",
                "max_length": 200
            },
            "offline_id": {
                "type": "string",
                "required": false,
                "read_only": false,
                "label": "Offline id",
                "max_length": 20
            },
            "status": {
                "type": "choice",
                "required": false,
                "read_only": false,
                "label": "Student Status",
                "choices": [
                    {
                        "value": "OOSC",
                        "display_name": "Dropped Out"
                    },
                    {
                        "value": "NE",
                        "display_name": "Never Been to School"
                    },
                    {
                        "value": "PE",
                        "display_name": "Previously Enrolled"
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
            "moe_unique_id": {
                "type": "string",
                "required": false,
                "read_only": false,
                "label": "Moe unique id",
                "max_length": 45
            },
            "moe_extra_info": {
                "type": "field",
                "required": false,
                "read_only": false,
                "label": "Moe extra info"
            },
            "upi": {
                "type": "string",
                "required": false,
                "read_only": false,
                "label": "UPI Number",
                "help_text": "Unique Identification provided by the school",
                "max_length": 45
            },
            "cash_transfer_beneficiary": {
                "type": "boolean",
                "required": false,
                "read_only": false,
                "label": "Cash Transfer Beneficiary"
            },
            "stream": {
                "type": "field",
                "required": true,
                "read_only": false,
                "label": "Class",
                "storage": "classes",
                "display_name": "class_name"
            },
            "guardian_sub_county": {
                "type": "field",
                "required": true,
                "read_only": false,
                "label": "Guardian Sub County",
                "display_name": "name",
                "storage": "counties",
                "from_field": "guardian_county",
                "from_field_source": "sub_counties",
            },
            "guardian_county": {
                "type": "field",
                "required": true,
                "read_only": false,
                "label": "Guardian County",
                "display_name": "name",
                "storage": "counties"
            },
            "county": {
                "type": "field",
                "required": true,
                "read_only": false,
                "label": "County",
                "display_name": "name",
                "storage": "counties",
            },
            "sub_county": {
                "type": "field",
                "required": true,
                "read_only": false,
                "label": "Sub County",
                "display_name": "name",
                "storage": "counties",
                "from_field": "county",
                "from_field_source": "sub_counties",
            },
            "graduates_class": {
                "type": "field",
                "required": false,
                "read_only": false,
                "label": "Graduates class"
            },
            "special_needs": {
                "type": "field",
                "required": false,
                "read_only": false,
                "multiple": true,
                "label": "Special Needs",
                "display_name": "name",
                "storage": "special_needs",
            }
        }
    }
}


export {
    sStudentoptions
}