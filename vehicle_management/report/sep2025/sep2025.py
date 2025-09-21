# Copyright (c) 2025, Raisul Islam and contributors
# For license information, please see license.txt

import frappe
from frappe import _


def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    chart = get_chart_data()
    summary = get_summary_data()
    
    return columns, data, None, None, summary


def get_columns():
    return [
        {
            "fieldname": "chassis_number",
            "label": _("Chassis Number"),
            "fieldtype": "Link",
            "options": "Vehicle Entry",
            "width": 150
        },
        {
            "fieldname": "car_model",
            "label": _("Car Model"),
            "fieldtype": "Data",
            "width": 120
        },
        {
            "fieldname": "model_year",
            "label": _("Model Year"),
            "fieldtype": "Int",
            "width": 100
        },
        {
            "fieldname": "shape",
            "label": _("Shape"),
            "fieldtype": "Data",
            "width": 100
        },
        {
            "fieldname": "auction_grade",
            "label": _("Auction Grade"),
            "fieldtype": "Data",
            "width": 120
        },
        {
            "fieldname": "color",
            "label": _("Color"),
            "fieldtype": "Data",
            "width": 100
        },
        {
            "fieldname": "mileage",
            "label": _("Mileage"),
            "fieldtype": "Data",
            "width": 100
        },
        {
            "fieldname": "cc",
            "label": _("CC"),
            "fieldtype": "Data",
            "width": 80
        },
        {
            "fieldname": "seat_capacity",
            "label": _("Seat Capacity"),
            "fieldtype": "Int",
            "width": 100
        },
        {
            "fieldname": "country_of_origin",
            "label": _("Country"),
            "fieldtype": "Data",
            "width": 120
        },
        {
            "fieldname": "availability_status",
            "label": _("Availability"),
            "fieldtype": "Data",
            "width": 130
        },
        {
            "fieldname": "company_price",
            "label": _("Company Price"),
            "fieldtype": "Currency",
            "width": 120
        },
        {
            "fieldname": "customer_price",
            "label": _("Customer Price"),
            "fieldtype": "Currency",
            "width": 120
        },
        {
            "fieldname": "sale_price",
            "label": _("Sale Price"),
            "fieldtype": "Currency",
            "width": 120
        },
        {
            "fieldname": "other_amount",
            "label": _("Other Amount"),
            "fieldtype": "Currency",
            "width": 120
        },
        {
            "fieldname": "grand_total",
            "label": _("Grand Total"),
            "fieldtype": "Currency",
            "width": 120
        },
        {
            "fieldname": "overall_status",
            "label": _("Status"),
            "fieldtype": "Data",
            "width": 120
        }
    ]


def get_data(filters):
    conditions = ""
    
    if filters and filters.get("chassis_number"):
        conditions += " AND ve.chassis_number = %(chassis_number)s"
    if filters and filters.get("car_model"):
        conditions += " AND ve.car_model = %(car_model)s"
    if filters and filters.get("model_year"):
        conditions += " AND ve.model_year = %(model_year)s"
    if filters and filters.get("shape"):
        conditions += " AND ve.shape = %(shape)s"
    if filters and filters.get("auction_grade"):
        conditions += " AND ve.auction_grade = %(auction_grade)s"
    if filters and filters.get("color"):
        conditions += " AND ve.color = %(color)s"
    if filters and filters.get("country_of_origin"):
        conditions += " AND ve.country_of_origin = %(country_of_origin)s"
    if filters and filters.get("availability_status"):
        conditions += " AND va.availability_status = %(availability_status)s"
    if filters and filters.get("status"):
        if filters["status"] == "Cancelled":
            conditions += " AND ve.docstatus = 2"
        else:
            conditions += " AND ve.status = %(status)s AND ve.docstatus != 2"
    
    query = f"""
        SELECT 
            ve.chassis_number,
            ve.car_model,
            ve.model_year,
            ve.shape,
            ve.auction_grade,
            ve.color,
            ve.mileage,
            ve.cc,
            ve.seat_capacity,
            ve.country_of_origin,
            va.availability_status as availability_status,
            COALESCE(vp.company_price, 0) as company_price,
            COALESCE(vp.customer_price, 0) as customer_price,
            COALESCE(vp.sale_price, 0) as sale_price,
            COALESCE(vp.total_amount, 0) as other_amount,
            COALESCE(vp.grand_total, 0) as grand_total,
            CASE 
                WHEN ve.docstatus = 2 THEN 'Cancelled'
                ELSE ve.status
            END as overall_status
        FROM 
            `tabVehicle Entry` ve
        LEFT JOIN 
            `tabVehicle Availability` va ON ve.chassis_number = va.chassis_number 
            AND va.docstatus = 1
        LEFT JOIN 
            `tabVehicle Price` vp ON ve.chassis_number = vp.chassis_number 
            AND vp.docstatus = 1
        WHERE 
            ve.docstatus IN (0, 1, 2)
            {conditions}
        ORDER BY 
            ve.creation DESC
    """
    
    return frappe.db.sql(query, filters or {}, as_dict=1)


def get_summary_data():
    """Generate summary data for the report - always shows total counts regardless of filters"""
    # Get all vehicle counts without any filters
    query = """
        SELECT 
            COUNT(*) as total_vehicles,
            SUM(CASE WHEN va.availability_status = 'Port' THEN 1 ELSE 0 END) as port_count,
            SUM(CASE WHEN va.availability_status = 'Showroom' THEN 1 ELSE 0 END) as showroom_count,
            SUM(CASE WHEN va.availability_status = 'Warehouse' THEN 1 ELSE 0 END) as warehouse_count
        FROM 
            `tabVehicle Entry` ve
        LEFT JOIN 
            `tabVehicle Availability` va ON ve.chassis_number = va.chassis_number 
            AND va.docstatus = 1
        WHERE 
            ve.docstatus IN (0, 1, 2)
    """
    
    result = frappe.db.sql(query, as_dict=1)
    counts = result[0] if result else {}
    
    summary = [
        {
            "value": counts.get('total_vehicles', 0),
            "label": "Total Vehicles",
            "indicator": "Blue",
            "datatype": "Int"
        },
        {
            "value": counts.get('port_count', 0),
            "label": "In Port", 
            "indicator": "Blue",
            "datatype": "Int"
        },
        {
            "value": counts.get('showroom_count', 0),
            "label": "In Showroom",
            "indicator": "Green", 
            "datatype": "Int"
        },
        {
            "value": counts.get('warehouse_count', 0),
            "label": "In Warehouse",
            "indicator": "Orange",
            "datatype": "Int"
        }
    ]
    
    return summary


def get_chart_data():
    """Generate chart data for availability status distribution - uses total counts"""
    # Get total counts without filters (same query as summary)
    query = """
        SELECT 
            va.availability_status as status,
            COUNT(*) as count
        FROM 
            `tabVehicle Entry` ve
        LEFT JOIN 
            `tabVehicle Availability` va ON ve.chassis_number = va.chassis_number 
            AND va.docstatus = 1
        WHERE 
            ve.docstatus IN (0, 1, 2)
        GROUP BY 
            va.availability_status
        ORDER BY 
            count DESC
    """
    
    result = frappe.db.sql(query, as_dict=1)
    
    if not result:
        return None
    
    labels = [row['status'] for row in result]
    values = [row['count'] for row in result]
    
    return {
        "data": {
            "labels": labels,
            "datasets": [{
                "name": "Vehicle Distribution",
                "values": values
            }]
        },
        "type": "donut",
        "height": 300
    }
