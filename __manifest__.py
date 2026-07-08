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
        "views/fulfillment_index_page.xml",
        # # "security/ir.model.access.csv",
        # "views/fulfillment_pos.xml",
        # "views/fulfillment_pos_setting.xml",
        # "views/fulfilment_order.xml",
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
