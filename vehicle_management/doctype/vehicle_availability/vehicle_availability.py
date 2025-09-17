# Copyright (c) 2025, Raisul Islam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class VehicleAvailability(Document):
	def validate(self):
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
