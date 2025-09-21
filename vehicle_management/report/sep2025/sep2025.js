// Copyright (c) 2025, Raisul Islam and contributors
// For license information, please see license.txt

frappe.query_reports["Sep2025"] = {
	"onload": function(report) {
		// Add custom buttons
		report.page.add_inner_button(__("Export to Excel"), function() {
			frappe.utils.csvDownload(report.data, report.columns, __("Sep2025_Report"));
		});
		
		report.page.add_inner_button(__("Print"), function() {
			frappe.utils.print_table(report.data, report.columns, __("Sep2025 Report"));
		});
	},

	"filters": [
		{
			"fieldname": "chassis_number",
			"label": __("Chassis Number"),
			"fieldtype": "Link",
			"options": "Vehicle Entry",
			"width": "80px"
		},
		{
			"fieldname": "car_model",
			"label": __("Car Model"),
			"fieldtype": "Link",
			"options": "Car Model",
			"width": "80px"
		},
		{
			"fieldname": "model_year",
			"label": __("Model Year"),
			"fieldtype": "Link",
			"options": "Model Year",
			"width": "80px"
		},
		{
			"fieldname": "shape",
			"label": __("Shape"),
			"fieldtype": "Select",
			"options": "\nNew\nOld",
			"width": "80px"
		},
		{
			"fieldname": "auction_grade",
			"label": __("Auction Grade"),
			"fieldtype": "Link",
			"options": "Auction Grade",
			"width": "80px"
		},
		{
			"fieldname": "color",
			"label": __("Color"),
			"fieldtype": "Link",
			"options": "Color",
			"width": "80px"
		},
		{
			"fieldname": "country_of_origin",
			"label": __("Country"),
			"fieldtype": "Link",
			"options": "Country",
			"width": "80px"
		},
		{
			"fieldname": "availability_status",
			"label": __("Availability"),
			"fieldtype": "Select",
			"options": "\nPort\nShowroom\nWarehouse\nOnship\nOthers",
			"width": "80px"
		},
		{
			"fieldname": "status",
			"label": __("Status"),
			"fieldtype": "Select",
			"options": "\nDraft\nTo Availability and To Price\nTo Price\nPending Availability\nCompleted\nTo Availability\nPending Price\nCancelled",
			"width": "80px"
		}
	],
	
	"formatter": function (value, row, column, data, default_formatter) {
		value = default_formatter(value, row, column, data);
		
		if (column.fieldname == "availability_status") {
			if (value == "Port") {
				value = `<span class="indicator blue">${value}</span>`;
			} else if (value == "Showroom") {
				value = `<span class="indicator green">${value}</span>`;
			} else if (value == "Warehouse") {
				value = `<span class="indicator orange">${value}</span>`;
			} else if (value == "Onship") {
				value = `<span class="indicator red">${value}</span>`;
			} else if (value == "Others") {
				value = `<span class="indicator yellow">${value}</span>`;
			}
		}
		
		if (column.fieldname == "overall_status") {
			if (value == "Draft") {
				value = `<span class="indicator red">${value}</span>`;
			} else if (value == "To Availability and To Price") {
				value = `<span class="indicator orange">${value}</span>`;
			} else if (value == "To Price") {
				value = `<span class="indicator yellow">${value}</span>`;
			} else if (value == "Pending Availability") {
				value = `<span class="indicator blue">${value}</span>`;
			} else if (value == "Completed") {
				value = `<span class="indicator green">${value}</span>`;
			} else if (value == "Cancelled") {
				value = `<span class="indicator red">${value}</span>`;
			}
		}
		
		return value;
	},
	
	"onload": function(report) {
		// Add custom buttons
		report.page.add_inner_button(__("Export to Excel"), function() {
			frappe.utils.csvDownload(report.data, report.columns, __("Sep2025_Report"));
		});
		
		report.page.add_inner_button(__("Print"), function() {
			frappe.utils.print_table(report.data, report.columns, __("Sep2025 Report"));
		});
	},


};
