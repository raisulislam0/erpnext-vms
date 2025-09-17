frappe.ui.form.on('Vehicle Price', {
    company_price: function(frm) {
        update_totals(frm);
    },
    customer_price: function(frm) {
        update_totals(frm);
    },
    onload: function(frm) {
        update_totals(frm);
    },
    chassis_number: function(frm) {
    if (frm.doc.chassis_number) {
        frappe.db.get_list("Vehicle Availability", {
            fields: ["current_status"],
            filters: { chassis_number: frm.doc.chassis_number },
            order_by: "creation desc",
            limit: 1
        }).then(r => {
            if (r && r.length > 0) {
                frm.set_value("current_status", r[0].current_status);
            } else {
                frm.set_value("current_status", "");
                frappe.msgprint(__("No Vehicle Availability found for Chassis: {0}", [frm.doc.chassis_number]));
            }
        });
    } else {
        frm.set_value("current_status", "");
    }
}
});

frappe.ui.form.on('Vehicle Price Item', {
    item: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (!row) return;

        // 🔎 check duplicates
        let duplicates = (frm.doc.vehicle_items || []).filter(r => r.item === row.item);
        if (duplicates.length > 1) {
            frappe.msgprint(__('Item {0} already exists. Duplicate row removed.', [row.item]));
            frm.get_field('vehicle_items').grid.grid_rows_by_docname[cdn].remove();
            frm.refresh_field('vehicle_items');
            return;
        }

        update_row_amount(frm, cdt, cdn);
    },
    quantity: function(frm, cdt, cdn) {
        update_row_amount(frm, cdt, cdn);
    },
    rate: function(frm, cdt, cdn) {
        update_row_amount(frm, cdt, cdn);
    },
    vehicle_items_remove: function(frm) {
        update_totals(frm);
    }
});

function update_row_amount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];

    // calculate instantly
    row.amount = (row.quantity || 0) * (row.rate || 0);

    // ✅ refresh this row’s UI immediately
    frm.fields_dict["vehicle_items"].grid.refresh_row(row.name);

    update_totals(frm);
}

function update_totals(frm) {
    let total_qty = 0, total_amt = 0;

    (frm.doc.vehicle_items || []).forEach(r => {
        total_qty += r.quantity || 0;
        total_amt += r.amount || 0;
    });

    frm.set_value("total_quantity", total_qty);
    frm.set_value("total_amount", total_amt);

    // Sale Price = Company + Customer
    let sale_price = (frm.doc.company_price || 0) + (frm.doc.customer_price || 0);
    frm.set_value("sale_price", sale_price);

    // Grand Total = Sale Price + Total Amount
    frm.set_value("grand_total", sale_price + total_amt);
}

