frappe.ui.form.on('Vehicle Entry', {
    refresh: function(frm) {
        if (frm.doc.docstatus === 1) {  // only after Vehicle Entry is submitted

            // Create → Availability (only if none exists yet)
            frappe.db.get_list('Vehicle Availability', {
                filters: { chassis_number: frm.doc.chassis_number, docstatus: 1 },
                limit_page_length: 1
            }).then(r => {
                if (!r || r.length === 0) {
                    frm.add_custom_button(__('Availability'), function() {
                        frappe.new_doc('Vehicle Availability', {
                            chassis_number: frm.doc.chassis_number,
                            vehicle_name: frm.doc.vehicle_name,
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
                            vehicle_name: frm.doc.vehicle_name,
                            model_year: frm.doc.model_year,
                            current_status: frm.doc.status
                        });
                    }, __('Create'));
                }
            });
        }
    }
});
