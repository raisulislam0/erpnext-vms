from frappe import _

def get_data():
    return [
        {
            "label": _("Vehicle Management"),
            "icon": "fa fa-car",
            "items": [
                {
                    "type": "doctype",
                    "name": "Vehicle Entry",
                    "label": _("Vehicle Entry"),
                    "description": _("Record and manage vehicle details"),
                    "onboard": 1,
                },
                {
                    "type": "doctype",
                    "name": "Vehicle Availability",
                    "label": _("Vehicle Availability"),
                    "description": _("Track vehicle current status and availability"),
                    "onboard": 0,
                },
                {
                    "type": "doctype",
                    "name": "Vehicle Price",
                    "label": _("Vehicle Price"),
                    "description": _("Enter and manage vehicle pricing"),
                    "onboard": 0,
                },
                {
                    "type": "report",
                    "name": "Vehicle Report",
                    "label": _("Vehicle Report"),
                    "description": _("Comprehensive report of vehicles, availability, and pricing"),
                    "doctype": "Vehicle Entry",
                    "is_query_report": True
                }
            ]
        }
    ]
