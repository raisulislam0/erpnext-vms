// Copyright (c) 2025, Raisul Islam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Vehicle Availability", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Vehicle Availability', {
    status: function(frm) {
        // Clear all conditional fields first
        frm.set_value('port_location', '');
        frm.set_value('shed_number', '');
        frm.set_value('ship_details', '');
        frm.set_value('showroom_address', '');
        frm.set_value('warehouse_address', '');
        frm.set_value('others_details', '');

        // Toggle field display based on status
        frm.toggle_display(['port_location', 'shed_number'], frm.doc.status === 'Port');
        frm.toggle_display('ship_details', frm.doc.status === 'Onship');
        frm.toggle_display('showroom_address', frm.doc.status === 'Showroom');
        frm.toggle_display('warehouse_address', frm.doc.status === 'Warehouse');
        frm.toggle_display('other_details', frm.doc.status === 'Other');
    }
});

