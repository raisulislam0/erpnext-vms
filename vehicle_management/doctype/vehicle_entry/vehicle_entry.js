frappe.ui.form.on('Vehicle Entry', {
    refresh: function(frm) {
        // Set status indicator with colors
        if (frm.doc.status) {
            let color = get_status_color(frm.doc.status);
            frm.page.set_indicator(__(frm.doc.status), color);
        }

        if (frm.doc.docstatus === 1) {
            // Create → Availability (only if none exists yet)
            frappe.db.get_list('Vehicle Availability', {
                filters: { chassis_number: frm.doc.chassis_number, docstatus: 1 },
                limit_page_length: 1
            }).then(r => {
                if (!r || r.length === 0) {
                    frm.add_custom_button(__('Availability'), function() {
                        frappe.new_doc('Vehicle Availability', {
                            chassis_number: frm.doc.chassis_number,
                            car_model : frm.doc.car_model,
                            model_year: frm.doc.model_year,
                            shape: frm.doc.shape,
                            auction_grade: frm.doc.auction_grade,
                            color: frm.doc.color,
                            mileage: frm.doc.mileage,
                            cc: frm.doc.cc,
                            description: frm.doc.description
                        });
                    }, __('Create'));
                }
            });

            // Create → Price (only if none exists yet)
            frappe.db.get_list('Vehicle Price', {
                filters: { chassis_number: frm.doc.chassis_number, docstatus: 1 },
                limit_page_length: 1
            }).then(r => {
                if (!r || r.length === 0) {
                    frm.add_custom_button(__('Price'), function() {
                        frappe.new_doc('Vehicle Price', {
                            chassis_number: frm.doc.chassis_number,
                            car_model: frm.doc.car_model,
                            model_year: frm.doc.model_year,
                            status: frm.doc.status
                        });
                    }, __('Create'));
                }
            });
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
