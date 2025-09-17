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
            fields: ["availability_status"],
            filters: { chassis_number: frm.doc.chassis_number },
            order_by: "creation desc",
            limit: 1
        }).then(r => {
            if (r && r.length > 0) {
                frm.set_value("availability_status", r[0].availability_status);
            } else {
                frm.set_value("availability_status", "");
                frappe.msgprint(__("No Vehicle Availability found for Chassis: {0}", [frm.doc.chassis_number]));
            }
        });
    } else {
        frm.set_value("availability_status", "");
    }
}
});

frappe.ui.form.on('Vehicle Price Item', {
    item: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (!row) return;

        // check duplicates
        let duplicates = (frm.doc.vehicle_items || []).filter(r => r.item === row.item);
        if (duplicates.length > 1) {
            frappe.msgprint(__('Item {0} already exists. Duplicate row removed.', [row.item]));
            frm.get_field('vehicle_items').grid.grid_rows_by_docname[cdn].remove();
            frm.refresh_field('vehicle_items');
            return;
        }

        calculate_amount(frm, cdt, cdn);
    },
    quantity: function(frm, cdt, cdn) {
        calculate_amount(frm, cdt, cdn);
    },
    rate: function(frm, cdt, cdn) {
        calculate_amount(frm, cdt, cdn);
    },
    vehicle_items_remove: function(frm) {
        update_totals(frm);
    }
});

function calculate_amount(frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    let amount = flt(row.quantity || 0) * flt(row.rate || 0);
    
    frappe.model.set_value(cdt, cdn, 'amount', amount);
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

