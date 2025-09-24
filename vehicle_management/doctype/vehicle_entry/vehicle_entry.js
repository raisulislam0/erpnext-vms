// author name and other metadata can be added here

frappe.ui.form.on('Vehicle Entry', {
    refresh: function(frm) {
        create_status_indicator_and_buttons(frm);
    }
});

function get_status_color(status) {
    const status_colors = {
        'Draft': 'red',
        'To Availability and To Price': 'orange',
        'To Price': 'yellow',
        'Pending Availability': 'blue',
        'Completed': 'green',
        'To Availability': 'brown',
        'Pending Price': 'purple',
        'Cancelled': 'red',

    };
    return status_colors[status] || 'gray';
}


function create_status_indicator_and_buttons(frm) {
    // Set status indicator with colors
    if (frm.doc.status) {
        let color = get_status_color(frm.doc.status);
        frm.page.set_indicator(__(frm.doc.status), color);
    }

    if (frm.doc.docstatus === 1) {
        // Create → Availability (only if none exists yet)
        frappe.db.get_list('Vehicle Availability', {
            filters: { chassis_number: frm.doc.chassis_number, docstatus: 1 }
        }).then(r => {
            if (!r || r.length === 0) {
                frm.add_custom_button(__('Availability'), function () {
                    frappe.new_doc('Vehicle Availability', {
                        chassis_number: frm.doc.chassis_number
                    });
                }, __('Create'));
            }
        });

        // Create → Price (only if none exists yet)
        frappe.db.get_list('Vehicle Price', {
            filters: { chassis_number: frm.doc.chassis_number, docstatus: 1 }
        }).then(r => {
            if (!r || r.length === 0) {
                frm.add_custom_button(__('Price'), function () {
                    frappe.new_doc('Vehicle Price', {
                        chassis_number: frm.doc.chassis_number
                    });
                }, __('Create'));
            }
        });
    }
}