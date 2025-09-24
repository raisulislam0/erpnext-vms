import frappe
from frappe.model.document import Document
import math


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

        def money_in_indian_words(number):
            """
            Convert number into words using Indian numbering system (Lakh, Crore).
            """

            def num_to_words(n):
                ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
                        "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
                        "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
                tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty",
                        "Sixty", "Seventy", "Eighty", "Ninety"]

                if n < 20:
                    return ones[n]
                elif n < 100:
                    return tens[n // 10] + (" " + ones[n % 10] if (n % 10) != 0 else "")
                elif n < 1000:
                    return ones[n // 100] + " Hundred" + (" " + num_to_words(n % 100) if (n % 100) != 0 else "")
                return ""

            def convert_to_indian(n):
                out = ""
                crore = n // 10000000
                n %= 10000000
                lakh = n // 100000
                n %= 100000
                thousand = n // 1000
                n %= 1000
                hundred = n

                if crore:
                    out += num_to_words(crore) + " Crore "
                if lakh:
                    out += num_to_words(lakh) + " Lakh "
                if thousand:
                    out += num_to_words(thousand) + " Thousand "
                if hundred:
                    out += num_to_words(hundred)

                return out.strip()

            rupees = int(math.floor(number))
            paise = int(round((number - rupees) * 100))

            words = ""
            if rupees:
                words += convert_to_indian(rupees) + " Taka"
            if paise:
                words += " and " + convert_to_indian(paise) + " Paisa"

            return words + " Only"


        try:
            self.in_words = money_in_indian_words(self.grand_total)
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
        
        avail_id = frappe.db.get_value("Vehicle Availability", 
            {"chassis_number": self.chassis_number, "docstatus": 1})

        if avail_id:
            self.db_set("availability_id", avail_id)
        
        self.reload() # Not recommended to call reload() here, but if needed, ensure it's after all updates

            
    def on_cancel(self):
        self.update_vehicle_entry_status()
        self.reload()


    def update_vehicle_entry_status(self):
        if self.chassis_number:
            from vehicle_management.vehicle_management.doctype.vehicle_entry.vehicle_entry import update_vehicle_entry_status
            update_vehicle_entry_status(self)

    def before_save(self):
        if self.docstatus == 0:
            self.status = "Draft"

