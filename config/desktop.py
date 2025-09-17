from frappe import _

def get_data():
    return [
        {
            "module_name": "Vehicle Management",
            "category": "Modules",
            "label": _("Vehicle Management"),
            "color": "#1E90FF",   # Dodger Blue, you can change this
            "icon": "octicon octicon-car",  # Car icon
            "type": "module",
            "description": "Manage vehicle stock, availability, and pricing"
        }
    ]
