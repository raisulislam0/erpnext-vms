import frappe
from frappe.model.document import Document

class VehicleEntry(Document):
    pass

    def validate(self):
        # Set status based on docstatus and linked docs
        if self.docstatus == 0:
            self.status = "Draft"
        elif self.docstatus == 2:
            self.status = "Cancelled"
        elif self.docstatus == 1:
            self.update_status_from_linked_docs()

    def on_submit(self):
        self.status = "To Availability and To Price"
        self.update_status_from_linked_docs()

    def on_cancel(self):
        self.status = "Cancelled"

    def update_status_from_linked_docs(self):
        if self.docstatus != 1:
            return
        
        # Check cancelled docs first
        avail_cancelled = frappe.db.exists("Vehicle Availability", {
            "chassis_number": self.chassis_number, "docstatus": 2
        })
        price_cancelled = frappe.db.exists("Vehicle Price", {
            "chassis_number": self.chassis_number, "docstatus": 2
        })
        
        if avail_cancelled or price_cancelled:
            self.status = "Rollback"
            return

        # Check submitted docs
        avail_submitted = frappe.db.exists("Vehicle Availability", {
            "chassis_number": self.chassis_number, "docstatus": 1
        })
        price_submitted = frappe.db.exists("Vehicle Price", {
            "chassis_number": self.chassis_number, "docstatus": 1
        })

        if avail_submitted and price_submitted:
            self.status = "Completed"
        elif price_submitted and not avail_submitted:
            self.status = "Pending Availability"
        elif avail_submitted and not price_submitted:
            self.status = "To Price"
        else:
            self.status = "To Availability and To Price"

@frappe.whitelist()
def update_vehicle_entry_status(doc, method=None):
    """Update Vehicle Entry status when linked docs change"""
    if hasattr(doc, 'chassis_number') and doc.chassis_number:
        vehicle_entry = frappe.db.get_value("Vehicle Entry", 
            {"chassis_number": doc.chassis_number, "docstatus": 1}, "name")
        
        if vehicle_entry:
            ve_doc = frappe.get_doc("Vehicle Entry", vehicle_entry)
            ve_doc.update_status_from_linked_docs()
            ve_doc.db_set("status", ve_doc.status)
