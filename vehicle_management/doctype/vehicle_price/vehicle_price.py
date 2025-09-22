import frappe
from frappe.model.document import Document
from frappe.utils import money_in_words

class VehiclePrice(Document):
    def validate(self):
        total_qty = 0
        total_amt = 0
        seen = set()

        for row in list(self.vehicle_items or []):
            row.amount = (row.quantity or 0) * (row.rate or 0)

            if row.item in seen:
                # Auto-remove duplicate row
                self.remove(row)
                frappe.msgprint(f"Duplicate item {row.item} removed automatically")
                continue
            seen.add(row.item)

            total_qty += row.quantity or 0
            total_amt += row.amount or 0

        self.total_quantity = total_qty
        self.total_amount = total_amt
        self.sale_price = (self.company_price or 0) + (self.customer_price or 0)
        self.grand_total = (self.sale_price or 0) + (self.total_amount or 0)

        try:
            currency = getattr(self, 'currency', None) or frappe.db.get_default('currency') or 'USD'
            self.in_words = money_in_words(self.grand_total, currency)
        except Exception:
            self.in_words = ''

        if self.chassis_number:
            vehicle_entry_status = frappe.db.get_value("Vehicle Entry", 
                {"chassis_number": self.chassis_number, "docstatus": 1}, "status")
            if vehicle_entry_status:
                self.status = vehicle_entry_status

        chassis_exists = frappe.db.exists("Vehicle Price", {"chassis_number": self.chassis_number, "docstatus": 1})
        if chassis_exists:
            if chassis_exists:
                frappe.throw(f"Vehicle Price for Chassis Number {self.chassis_number} already exists.")
                return
            
    def on_submit(self):
        self.update_vehicle_entry_status()
        self.reload()

    def on_cancel(self):
        self.update_vehicle_entry_status()
        self.reload()

    def update_vehicle_entry_status(self):
        if self.chassis_number:
            from vehicle_management.vehicle_management.doctype.vehicle_entry.vehicle_entry import update_vehicle_entry_status
            update_vehicle_entry_status(self)
            self.reload()

    def before_save(self):
        if self.docstatus == 0:
            self.status = "Draft"

