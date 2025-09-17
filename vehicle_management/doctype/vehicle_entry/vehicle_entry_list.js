frappe.listview_settings["Vehicle Entry"] = {
    get_indicator: function (doc) {
        const status_colors = {
            'Draft': 'red',
            'To Availability and To Price': 'orange',
            'To Price': 'yellow',
            'Pending Availability': 'blue', 
            'Completed': 'green',
            'Rollback': 'red',
            'Cancelled': 'red'
        };
        return [__(doc.status), status_colors[doc.status], "status,=," + doc.status];
    }
};