frappe.ui.form.on('Vehicle Price', {
    refresh: function(frm) {
        // Set status indicator with colors based on status
        if (frm.doc.status) {
            let color = get_status_color(frm.doc.status);
            frm.page.set_indicator(__(frm.doc.status), color);
        }
    },
    
    after_save: function(frm) {
        // Refresh form to show updated status after a delay
        setTimeout(() => {
            frm.reload_doc();
        }, 2000);
    },
    
    chassis_number: function(frm) {
        if (frm.doc.chassis_number) {
            // Auto-fetch vehicle details from Vehicle Entry
            frappe.db.get_doc('Vehicle Entry', frm.doc.chassis_number).then(r => {
                if (r) {
                    frm.set_value('car_model', r.car_model);
                    frm.set_value('model_year', r.model_year);
                    frm.set_value('status', r.status);
                }
            });
            
            // Fetch availability status from Vehicle Availability
            frappe.db.get_list("Vehicle Availability", {
                fields: ["availability_status", "port_location", "shed_number", "ship_details", "showroom_address", "warehouse_address", "others_details"],
                filters: { chassis_number: frm.doc.chassis_number },
                order_by: "creation desc",
                limit: 1
            }).then(r => {
                if (r && r.length > 0) {
                    let availability = r[0];
                    frm.set_value("availability_status", availability.availability_status);
                    
                    // Format availability details based on status and available data
                    let details = format_availability_details(availability);
                    frm.set_value("availability_details", details);
                } else {
                    frm.set_value("availability_status", "");
                    frm.set_value("availability_details", "");
                    frappe.msgprint(__("No Vehicle Availability found for Chassis: {0}", [frm.doc.chassis_number]));
                }
            });
        } else {
            frm.set_value("availability_status", "");
            frm.set_value("availability_details", "");
        }
    },
    
    company_price: function(frm) {
        update_totals(frm);
    },
    customer_price: function(frm) {
        update_totals(frm);
    },
    onload: function(frm) {
        update_totals(frm);
    }
});

frappe.ui.form.on('Vehicle Price Items', {
    item: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (!row) return;

        // check duplicates
        let duplicates = (frm.doc.vehicle_items || []).filter(r => r.item === row.item);
        if (duplicates.length > 1) {
            frappe.msgprint(__('Item {0} already exists. Duplicate row removed.', [row.item]));
            frm.get_field('vehicle_items').grid.grid_rows_by_docname[cdn].remove();
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

function format_availability_details(availability) {
    let details = [];
    
    // Port details
    if (availability.port_location) {
        let port_detail = `Port Location: ${availability.port_location}`;
        if (availability.shed_number) {
            port_detail += `\n\nShed Number: ${availability.shed_number}`;
        }
        details.push(port_detail);
    } else if (availability.shed_number) {
        details.push(`Shed Number: ${availability.shed_number}`);
    }
    
    // Ship details
    if (availability.ship_details) {
        details.push(`Ship Details: ${availability.ship_details}`);
    }
    
    // Showroom address
    if (availability.showroom_address) {
        details.push(`Showroom Address: ${availability.showroom_address}`);
    }
    
    // Warehouse address
    if (availability.warehouse_address) {
        details.push(`Warehouse Address: ${availability.warehouse_address}`);
    }
    
    // Others details
    if (availability.others_details) {
        details.push(`Others: ${availability.others_details}`);
    }
    
    return details.join('\n');
}

