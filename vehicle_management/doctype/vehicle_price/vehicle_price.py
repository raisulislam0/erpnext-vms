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

        # Sync status from Vehicle Entry
        if self.chassis_number:
            vehicle_entry_status = frappe.db.get_value("Vehicle Entry", 
                {"chassis_number": self.chassis_number, "docstatus": 1}, "status")
            if vehicle_entry_status:
                self.status = vehicle_entry_status

    def on_submit(self):
        # Update Vehicle Entry status after this submission
        self.update_vehicle_entry_status()
        # Reload to get updated status
        self.reload()

    def on_cancel(self):
        # Set status to Rollback when cancelled
        self.status = "Rollback"
        # Update Vehicle Entry status after cancellation
        self.update_vehicle_entry_status()
        # Reload to get updated status
        self.reload()

    def update_vehicle_entry_status(self):
        if self.chassis_number:
            from vehicle_management.vehicle_management.doctype.vehicle_entry.vehicle_entry import update_vehicle_entry_status
            update_vehicle_entry_status(self)
            # Force reload status from database
            self.reload()

