{
    "name": "Fulfillment Order",
    "version": "1.0",
    "category": "Inventory",
    "sequence": 1,
    "summary": "Fulfillment Order",
    "description": """
        Fulfillment Order
    """,
    "author": "Odoo",
    "website": "http://www.odoo.com",
    "depends": ["base", "web", "stock"],
    "data": [
        "security/ir.model.access.csv",
        "views/res_user.xml",
        "views/fulfillment_pos_views.xml",
        "views/fulfillment_pos_setting_views.xml",
        "views/fulfillment_order_lines_views.xml",
        "views/fulfillment_orders_views.xml",
        "views/fulfillment_location_views.xml",
        "views/fulfillment_menu.xml",
        "views/fulfillment_index_page.xml",
        "views/fulfillment_orders_reciept.xml",
        "views/fulfillment_order_actoin_report.xml",
    ],
    "assets": {
        "fulfillment_order._assets_app": [
            "fulfillment_order/static/src/app/**/*.js",
            "fulfillment_order/static/src/app/**/*.xml",
            "fulfillment_order/static/src/app/**/*.scss",
        ],
        "fulfillment_order.assets_prod": [
            ("include", "fulfillment_order._assets_app"),
            "fulfillment_order/static/src/app/main.js",
        ],
    },
    "installable": True,
    "auto_install": False,
    "application": True,
}
