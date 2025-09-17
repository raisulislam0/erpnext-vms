frappe.listview_settings["Vehicle Price"] = {
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
        let status = doc.status || 'Draft';
        return [__(status), status_colors[status], "status,=," + status];
    }
};
