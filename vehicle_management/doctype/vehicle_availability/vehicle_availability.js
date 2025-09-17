// Copyright (c) 2025, Raisul Islam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Vehicle Availability", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Vehicle Availability', {
    refresh: function(frm) {
        // Set status indicator with colors based on status
        if (frm.doc.status) {
            let color = get_status_color(frm.doc.status);
            frm.page.set_indicator(__(frm.doc.status), color);
        }
    },
    
    after_save: function(frm) {
        // Refresh form to show updated status
        setTimeout(() => {
            frm.reload_doc();
        }, 1000);
    },
    
    availability_status: function(frm) {
        // Clear all dependent fields when availability status changes
        frm.set_value('port_location', '');
        frm.set_value('shed_number', '');
        frm.set_value('ship_details', '');
        frm.set_value('showroom_address', '');
        frm.set_value('warehouse_address', '');
        frm.set_value('others_details', '');
    }
});

function get_status_color(status) {
    const status_colors = {
        'Draft': 'red',
        'To Availability and To Price': 'orange',
        'To Price': 'yellow', 
        'Pending Availability': 'blue',
        'Completed': 'green',
        'Rollback': 'red',
        'Cancelled': 'red'
    };
    return status_colors[status] || 'gray';
}

