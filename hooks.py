app_name = "vehicle_management"
app_title = "Vehicle Management"
app_publisher = "Raisul Islam"
app_description = "Tracks Vehicle details, stock, and price"
app_email = "raisul.fusion@gmail.com"
app_license = "mit"
app_include_icons = "/home/fusion/frappe-bench/apps/vehicle_management/vehicle_management/public/icons/car.svg"

doc_events = {
    "Vehicle Availability": {
        "on_submit": "vehicle_management.vehicle_management.doctype.vehicle_entry.vehicle_entry.update_vehicle_entry_status",
        "on_cancel": "vehicle_management.vehicle_management.doctype.vehicle_entry.vehicle_entry.update_vehicle_entry_status"
    },
    "Vehicle Price": {
        "on_submit": "vehicle_management.vehicle_management.doctype.vehicle_entry.vehicle_entry.update_vehicle_entry_status",
        "on_cancel": "vehicle_management.vehicle_management.doctype.vehicle_entry.vehicle_entry.update_vehicle_entry_status"
    }
}

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "vehicle_management",
# 		"logo": "/assets/vehicle_management/logo.png",
# 		"title": "Vehicle Management",
# 		"route": "/vehicle_management",
# 		"has_permission": "vehicle_management.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/vehicle_management/css/vehicle_management.css"
# app_include_js = "/assets/vehicle_management/js/vehicle_management.js"

# include js, css files in header of web template
# web_include_css = "/assets/vehicle_management/css/vehicle_management.css"
# web_include_js = "/assets/vehicle_management/js/vehicle_management.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "vehicle_management/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "vehicle_management/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "vehicle_management.utils.jinja_methods",
# 	"filters": "vehicle_management.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "vehicle_management.install.before_install"
# after_install = "vehicle_management.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "vehicle_management.uninstall.before_uninstall"
# after_uninstall = "vehicle_management.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "vehicle_management.utils.before_app_install"
# after_app_install = "vehicle_management.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "vehicle_management.utils.before_app_uninstall"
# after_app_uninstall = "vehicle_management.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "vehicle_management.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"vehicle_management.tasks.all"
# 	],
# 	"daily": [
# 		"vehicle_management.tasks.daily"
# 	],
# 	"hourly": [
# 		"vehicle_management.tasks.hourly"
# 	],
# 	"weekly": [
# 		"vehicle_management.tasks.weekly"
# 	],
# 	"monthly": [
# 		"vehicle_management.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "vehicle_management.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "vehicle_management.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "vehicle_management.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["vehicle_management.utils.before_request"]
# after_request = ["vehicle_management.utils.after_request"]

# Job Events
# ----------
# before_job = ["vehicle_management.utils.before_job"]
# after_job = ["vehicle_management.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"vehicle_management.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

