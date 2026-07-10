from odoo import http
from odoo.http import request, route
import logging

_logger = logging.getLogger(__name__)


class FulfilmentOrderController(http.Controller):
    # Entry point for the fulfilment order page
    @http.route("/fulfilment", type="http", auth="user", website=True)
    def entry_point_fulfilment(self, pos_id=None):
        """
        Renders the fulfilment order page
        """

        if not pos_id:
            pos_id = request.env.user.fulfilment_pos_id

        pos_records = (
            request.env["fulfillment.pos"].sudo().search([("id", "=", pos_id.id)])
        )

        values = {
            "user": request.env.user.read(["id", "name", "login"])[0],
            "pos": pos_records.read(["id", "name"])[0],
            "fulfillment_locations": request.env.user.fulfillment_location_ids.read(
                ["id", "name"]
            ),
            "fulfillment_role": request.env.user.fulfillment_role,
        }

        print(values)

        return request.render(
            "fulfillment_order.fulfillment_index_page",
            values,
        )

    # API Endpoints for the Fulfillment Order Page fetch current user pos
    @http.route("/fulfillment/api/v1/get-pos", type="json", auth="user")
    def get_pos(self):
        return request.env["fulfillment.pos"].load_data()

    # <----------- Products API Endpoints ------------>
    # API Endpoint for fetching products
    @http.route("/fulfillment/api/v1/get-products", type="json", auth="user")
    def get_products(self, location_id):
        try:
            location_id = int(location_id)

            location = (
                request.env["fulfillment.location"]
                .sudo()
                .browse(int(location_id))
                .read(["warehouse_ids"])[0]
            )
            _logger.info(location)
            warehouse = request.env["stock.warehouse"].browse(
                location["warehouse_ids"][0]
            )

            quants = (
                request.env["stock.quant"]
                .sudo()
                .search(
                    [
                        ("location_id", "child_of", warehouse.lot_stock_id.id),
                        ("quantity", ">", 0),
                    ],
                    limit=18,
                )
            )

            products = {}

            for quant in quants:
                pid = quant.product_id.id

                if pid not in products:
                    products[pid] = {
                        "id": pid,
                        "name": quant.product_id.name,
                        "list_price": quant.product_id.list_price,
                        "default_code": quant.product_id.default_code,
                        "image_1920": quant.product_id.image_1920,
                        "qty_available": 0,
                    }

                products[pid]["qty_available"] += quant.quantity

            return list(products.values())
        except Exception as e:
            return {"error": str(e), "location": location}

    # API Endpoint for searching products based on a query
    @http.route("/fulfillment/api/v1/search-products", type="json", auth="user")
    def search_products(self, query, location_id):
        # location_id
        try:
            query = query.strip()
            # location_id = int(location_id)

            location = (
                request.env["fulfillment.location"]
                .sudo()
                .browse(int(location_id))
                .read(["warehouse_ids"])[0]
            )
            _logger.info(location)
            warehouse = request.env["stock.warehouse"].browse(
                location["warehouse_ids"][0]
            )
            quants = (
                request.env["stock.quant"]
                .sudo()
                .search(
                    [
                        ("product_id.default_code", "ilike", query),
                        ("location_id", "child_of", warehouse.lot_stock_id.id),
                        ("quantity", ">", 0),
                    ],
                    limit=18,
                )
            )
            products = {}

            for quant in quants:
                pid = quant.product_id.id

                if pid not in products:
                    products[pid] = {
                        "id": pid,
                        "name": quant.product_id.name,
                        "list_price": quant.product_id.list_price,
                        "default_code": quant.product_id.default_code,
                        "image_1920": quant.product_id.image_1920,
                        "qty_available": 0,
                    }

                products[pid]["qty_available"] += quant.quantity

            return list(products.values())
        except Exception as e:
            return {"error": str(e), "location": location}

    # <----------- Customers API Endpoints ------------>
    # API Endpoint for fetching customers
    @http.route("/fulfillment/api/v1/get-customers", type="json", auth="user")
    def get_customers(self):
        return (
            request.env["res.partner"]
            .sudo()
            .search_read(
                [],
                [
                    "id",
                    "name",
                    "phone",
                    "city",
                    "street",
                ],
                limit=6,
            )
        )

    # API Endpoint for creating a new customer
    @http.route(
        "/fulfillment/api/customer/create", type="json", auth="user", methods=["POST"]
    )
    def create_customer(self, **kwargs):
        existing_customer = (
            request.env["res.partner"]
            .sudo()
            .search([("phone", "=", kwargs.get("phone"))], limit=1)
        )

        if existing_customer:
            return {"error": "Customer with this phone number already exists"}
        vals = {
            "name": kwargs.get("name"),
            "phone": kwargs.get("phone"),
            # "email": kwargs.get("email"),
            "city": kwargs.get("city"),
            "street": kwargs.get("address"),
        }

        return (
            request.env["res.partner"]
            .create(vals)
            .sudo()
            .read(["id", "name", "phone", "city", "street"])
        )

    # API Endpoint for updating a customer
    @http.route(
        "/fulfillment/api/customer/update", type="json", auth="user", methods=["POST"]
    )
    def update_customer(self, **kwargs):

        try:

            partner = request.env["res.partner"].sudo().browse(int(kwargs.get("id")))

            partner.write(
                {
                    "name": kwargs.get("name"),
                    "phone": kwargs.get("phone"),
                    "city": kwargs.get("city"),
                    "street": kwargs.get("address"),
                }
            )

            return partner.read(["id", "name", "phone", "city", "street"])

        except Exception as e:
            return {"error": str(e)}

    # API Endpoint for searching customers
    @http.route("/fulfillment/api/v1/search-customers", type="json", auth="user")
    def search_customers(self, query):
        query = query.strip()
        return (
            request.env["res.partner"]
            .sudo()
            .search_read(
                [
                    "|",
                    ("name", "ilike", query),
                    ("phone", "ilike", query),
                ],
                ["id", "name", "phone", "city", "street"],
                limit=6,
            )
        )

    # <----------- Orders API Endpoints ------------>
    # API Endpoint for creating a new order
    @http.route(
        "/fulfillment/api/v1/order/send-to-preparation",
        type="json",
        auth="user",
        methods=["POST"],
    )
    def send_to_preparation(self, **kwargs):
        _logger.info("Received order data: %s", kwargs)  # Log the received data
        pos = (
            request.env["fulfillment.pos"]
            .sudo()
            .browse(int(kwargs.get("fulfilment_pos_id")))
        )
        sequence = pos.sequence_order_id

        if not sequence:
            return {"error": "No order sequence found for the POS"}

        next_order_name = sequence.next_by_id()
        try:
            lines = kwargs.get("lines")
            if not lines:
                return {"error": "No order lines provided"}

            # Create a new order record
            order = (
                request.env["fulfillment.orders"]
                .sudo()
                .create(
                    {
                        "name_order": next_order_name,
                        "customer_id": kwargs.get("customer_id"),
                        "total_amount": kwargs.get("total_amount"),
                        "shipping_price": kwargs.get("shipping_price"),
                        "state": "draft",
                        "fulfilment_pos_id": pos.id,
                        "location_id": kwargs.get("location_id"),
                    }
                )
            )
            order_lines = []
            # Create order lines
            for item in lines:
                line = (
                    request.env["fulfillment.order.lines"]
                    .sudo()
                    .create(
                        {
                            "order_id": order.id,
                            "product_id": item.get("product_id"),
                            "quantity": item.get("quantity"),
                            "unit_price": item.get("price_unit"),
                        }
                    )
                )
                order_lines.append(line.id)

            order.write({"order_lines": [(6, 0, order_lines)]})
            return {"success": True, "order_id": order.id}

        except Exception as e:
            return {"error": str(e)}

    @http.route("/fulfillment/api/v1/profile", type="json", auth="user")
    def get_profile(self):
        user = request.env.user
        pos = request.env["fulfillment.pos"].sudo().browse(user.fulfilment_pos_id.id)
        return {
            "user": user.read(["id", "name", "login"])[0],
            "pos": pos.read(["id", "name"])[0],
            "location": user.fulfillment_location_ids.read(["id", "name"]),
            "fulfillment_role": user.fulfillment_role,
        }

    @http.route("/fulfillment/api/v1/orders", type="json", auth="user")
    def get_orders(self):
        user = request.env.user
        location_ids = user.fulfillment_location_ids.ids

        orders = (
            request.env["fulfillment.orders"]
            .sudo()
            .search(
                [
                    ("location_id", "in", location_ids),
                    ("state", "in", ["draft", "confirmed", "processing", "shipped"]),
                ]
            )
            .read(["id", "name_order", "order_date", "state", "total_amount",
                    "shipping_price", "customer_id", "location_id", "fulfilment_pos_id"])
        )
        for order in orders:
            order["order_lines"] = (
                request.env["fulfillment.order.lines"]
                .sudo()
                .search([("order_id", "=", order["id"])])
                .read(["id", "product_id", "quantity", "unit_price", "total_amount"])
            )
            if order["customer_id"]:
                order["customer_id"] = (
                    request.env["res.partner"]
                    .sudo()
                    .browse(order["customer_id"][0])
                    .read(["id", "name", "phone"])[0]
                )
            if order["location_id"]:
                order["location_id"] = (
                    request.env["fulfillment.location"]
                    .sudo()
                    .browse(order["location_id"][0])
                    .read(["id", "name"])[0]
                )

        return orders

    @http.route("/fulfillment/api/v1/order/update-status", type="json", auth="user")
    def update_order_status(self, order_id, status):
        try:
            order = request.env["fulfillment.orders"].sudo().browse(int(order_id))
            if not order.exists():
                return {"error": "Order not found"}
            valid_states = ["draft", "confirmed", "processing", "shipped", "delivered", "returned", "cancelled"]
            if status not in valid_states:
                return {"error": f"Invalid state: {status}"}
            order.write({"state": status})
            return {"success": True, "order_id": order.id, "state": order.state}
        except Exception as e:
            return {"error": str(e)}
