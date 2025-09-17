# Copyright (c) 2025, Raisul Islam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class VehicleAvailability(Document):
	def validate(self):
		# Sync status from Vehicle Entry
		if self.chassis_number:
			vehicle_entry = frappe.db.get_value("Vehicle Entry", 
				{"chassis_number": self.chassis_number, "docstatus": 1}, "status")
			if vehicle_entry:
				self.current_status = vehicle_entry
