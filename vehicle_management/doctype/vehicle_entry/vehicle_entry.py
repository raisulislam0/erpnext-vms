import frappe
from frappe.model.document import Document

class VehicleEntry(Document):
    pass

    # def on_submit(self):
    #     # When Vehicle Entry is submitted → start workflow
    #     self.status = "To Availability and To Price"

    # def validate(self):
    #     # Every save/submit → recalc status
    #     self.update_status_from_linked_docs()

    # def update_status_from_linked_docs(self):
    #     avail_submitted = frappe.db.exists("Vehicle Availability", {
    #         "chassis_number": self.chassis_number,
    #         "docstatus": 1
    #     })
    #     price_submitted = frappe.db.exists("Vehicle Price", {
    #         "chassis_number": self.chassis_number,
    #         "docstatus": 1
    #     })

    #     if avail_submitted and price_submitted:
    #         self.status = "Completed"
    #     elif avail_submitted and not price_submitted:
    #         self.status = "To Price"
    #     elif price_submitted and not avail_submitted:
    #         self.status = "Pending Availability"
    #     else:
    #         self.status = "To Availability and To Price"

    # def on_cancel(self):
    #     self.status = "Rollback"
