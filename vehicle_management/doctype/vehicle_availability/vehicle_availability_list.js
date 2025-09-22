frappe.listview_settings["Vehicle Availability"] = {
    get_indicator: function (doc) {
        const status_colors = {
            'Draft': 'red',
            'To Availability and To Price': 'orange',
            'To Price': 'yellow',
            'Pending Availability': 'blue',
            'To Availability': 'brown',
            'Pending Price': 'purple', 
            'Completed': 'green',
            'Cancelled': 'red'
        };
        let status = doc.status || 'Draft';
        return [__(status), status_colors[status], "status,=," + status];
    }
};
