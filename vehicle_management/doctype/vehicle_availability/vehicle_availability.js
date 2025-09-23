// Copyright (c) 2025, Raisul Islam and contributors
// For license information, please see license.txt


frappe.ui.form.on('Vehicle Availability', {
    refresh: function (frm) {
        // Set status indicator with colors based on status
        if (frm.doc.status) {
            let avail_status = frm.doc.status
            if (avail_status === "To Availability" || avail_status === "Pending Availability" || avail_status === "To Availability and To Price") {
                avail_status = "Cancelled"
            }
            let color = get_status_color(avail_status);
            frm.page.set_indicator(__(avail_status), color);
        }

    },

    after_save: function (frm) {
        setTimeout(() => {
            frm.reload_doc();
        }, 1000);
    },

    availability_status: function (frm) {

        frm.set_value('port_location', '');
        frm.set_value('shed_number', '');
        frm.set_value('ship_details', '');
        frm.set_value('showroom_address', '');
        frm.set_value('warehouse_address', '');
        frm.set_value('others_details', '');
    },
    onload: function (frm) {
        frm.set_query('chassis_number', function () {
            return {
                filters: [
                    ["Vehicle Entry", "docstatus", "=", 1],
                    ["Vehicle Entry", "status", "not in", ["Completed", "To Price", "Pending Price"]]
                ]
            };
        });
        update_totals(frm);
    },

    before_save: function (frm) {
        if (frm.doc.docstatus === 0) {
            frm.set_value('status', 'Draft');
        }
    }
});

function get_status_color(status) {
    const status_colors = {
        'Draft': 'red',
        'To Price': 'yellow',
        'Completed': 'green',
        'Cancelled': 'red',
        'Pending Price': 'purple',
    };
    return status_colors[status] || 'gray';
}



