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

