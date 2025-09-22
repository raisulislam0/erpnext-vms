frappe.listview_settings["Vehicle Entry"] = {
    get_indicator: function (doc) {
        const status_colors = {
            'Draft': 'red',
            'To Availability and To Price': 'orange',
            'To Price': 'yellow',
            'Pending Availability': 'blue', 
            'Completed': 'green',
            'To Availability': 'brown',
            'Pending Price': 'purple',
            'Cancelled': 'red'
        };
        return [__(doc.status), status_colors[doc.status], "status,=," + doc.status];
    }
};