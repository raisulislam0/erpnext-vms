# Copyright (c) 2025, Raisul Islam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class VehicleAvailability(Document):
	def validate(self):
		# Sync status from Vehicle Entry - but check if entry is cancelled first
		if self.chassis_number:
			vehicle_entry = frappe.db.get_value("Vehicle Entry", 
				{"chassis_number": self.chassis_number}, ["status", "docstatus"], as_dict=True)
			if vehicle_entry:
				if vehicle_entry.docstatus == 2:
					# Entry is cancelled
					self.status = "Cancelled"
				elif vehicle_entry.docstatus == 1:
					# Entry is submitted - sync status
					self.status = vehicle_entry.status

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
