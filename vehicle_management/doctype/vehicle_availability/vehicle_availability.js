// Copyright (c) 2025, Raisul Islam and contributors
// For license information, please see license.txt


frappe.ui.form.on('Vehicle Availability', {
    refresh: function(frm) {
        // Set status indicator with colors based on status
        if (frm.doc.status) {
            let color = get_status_color(frm.doc.status);
            frm.page.set_indicator(__(frm.doc.status), color);
        }

        // Add navigation buttons
        if (frm.doc.chassis_number) {
            add_navigation_buttons(frm);
        }
    },
    
    after_save: function(frm) {
        // Refresh form to show updated status
        setTimeout(() => {
            frm.reload_doc();
        }, 1000);
    },
    
    chassis_number: function(frm) {
        if (frm.doc.chassis_number) {
            // Add navigation buttons when chassis number is set
            add_navigation_buttons(frm);
        }
    },

    availability_status: function(frm) {
        // Clear all dependent fields when availability status changes
        frm.set_value('port_location', '');
        frm.set_value('shed_number', '');
        frm.set_value('ship_details', '');
        frm.set_value('showroom_address', '');
        frm.set_value('warehouse_address', '');
        frm.set_value('others_details', '');
    },
    onload: function(frm) {
    frm.set_query('chassis_number', function() {
        return {
            filters: {
                docstatus: 1 
            }
        };
    });
    update_totals(frm);
    },

    before_save: function(frm) {
        if (frm.doc.docstatus === 0) {
            frm.set_value('status', 'Draft');
        }
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

function add_navigation_buttons(frm) {
    // Add button to navigate to Vehicle Entry
    frm.add_custom_button(__('Vehicle Entry'), function() {
        frappe.set_route('Form', 'Vehicle Entry', frm.doc.chassis_number);
    }, __('Navigate'));

    // Check if Vehicle Price exists and add appropriate button
    frappe.db.get_list('Vehicle Price', {
        filters: { chassis_number: frm.doc.chassis_number },
        fields: ['name', 'docstatus'],
        order_by: 'creation desc',
        limit: 1
    }).then(r => {
        if (r && r.length > 0) {
            // Price exists - add button to navigate to it
            frm.add_custom_button(__('Vehicle Price'), function() {
                frappe.set_route('Form', 'Vehicle Price', r[0].name);
            }, __('Navigate'));
        } else {
            // No price exists - add button to create new one
            frm.add_custom_button(__('Price'), function() {
                // First get vehicle entry details
                frappe.db.get_doc('Vehicle Entry', frm.doc.chassis_number).then(vehicle => {
                    frappe.new_doc('Vehicle Price', {
                        chassis_number: frm.doc.chassis_number,
                        car_model: vehicle.car_model,
                        model_year: vehicle.model_year,
                        status: vehicle.status
                    });
                });
            }, __('Navigate'));
        }
    });
}

