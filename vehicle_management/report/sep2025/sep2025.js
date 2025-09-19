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
		
		// Add summary after report loads
		this.add_summary_section();
	},

	"refresh": function(report) {
		// Re-add summary when report refreshes (after filter changes)
		this.add_summary_section();
	},

	"add_summary_section": function() {
		// Remove existing summary if any
		if ($('.custom-report-summary').length) {
			$('.custom-report-summary').remove();
		}
		
		// Get total counts from backend
		frappe.call({
			method: "vehicle_management.report.sep2025.sep2025.get_total_counts",
			callback: function(r) {
				if (r.message) {
					let counts = r.message;
					
					// Create summary HTML
					let summary_html = `
						<div class="custom-report-summary" style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
							<h5 style="margin-bottom: 15px; color: #495057;">Summary Overview</h5>
							<div class="row">
								<div class="col-md-2">
									<div class="summary-item" style="text-align: center; padding: 10px;">
										<div style="font-size: 24px; font-weight: bold; color: #007bff;">${counts.total_vehicles}</div>
										<div style="font-size: 12px; color: #6c757d;">Total Vehicles</div>
									</div>
								</div>
								<div class="col-md-2">
									<div class="summary-item" style="text-align: center; padding: 10px;">
										<div style="font-size: 20px; font-weight: bold; color: #007bff;">${counts.port_count}</div>
										<div style="font-size: 12px; color: #6c757d;">In Port</div>
									</div>
								</div>
								<div class="col-md-2">
									<div class="summary-item" style="text-align: center; padding: 10px;">
										<div style="font-size: 20px; font-weight: bold; color: #28a745;">${counts.showroom_count}</div>
										<div style="font-size: 12px; color: #6c757d;">In Showroom</div>
									</div>
								</div>
								<div class="col-md-2">
									<div class="summary-item" style="text-align: center; padding: 10px;">
										<div style="font-size: 20px; font-weight: bold; color: #fd7e14;">${counts.warehouse_count}</div>
										<div style="font-size: 12px; color: #6c757d;">In Warehouse</div>
									</div>
								</div>
								<div class="col-md-2">
									<div class="summary-item" style="text-align: center; padding: 10px;">
										<div style="font-size: 20px; font-weight: bold; color: #dc3545;">${counts.onship_count}</div>
										<div style="font-size: 12px; color: #6c757d;">On Ship</div>
									</div>
								</div>
								<div class="col-md-2">
									<div class="summary-item" style="text-align: center; padding: 10px;">
										<div style="font-size: 20px; font-weight: bold; color: #ffc107;">${counts.others_count}</div>
										<div style="font-size: 12px; color: #6c757d;">Others</div>
									</div>
								</div>
							</div>
						</div>
					`;
					
					// Insert summary after filters
					setTimeout(() => {
						let target = $('.page-form').length ? $('.page-form') : $('.filter-section');
						if (target.length) {
							target.after(summary_html);
						} else {
							$('.layout-main-section').prepend(summary_html);
						}
					}, 500);
				}
			}
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
			"label": __("Origin Country"),
			"fieldtype": "Link",
			"options": "Country",
			"width": "80px"
		},
		{
			"fieldname": "availability_status",
			"label": __("Availability Status"),
			"fieldtype": "Select",
			"options": "\nPort\nShowroom\nWarehouse\nOnship\nOthers",
			"width": "80px"
		},
		{
			"fieldname": "status",
			"label": __("Status"),
			"fieldtype": "Select",
			"options": "\nDraft\nTo Availability and To Price\nTo Price\nPending Availability\nCompleted\nRollback",
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
			} else if (value == "Rollback") {
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
