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
    def get_products(self):
        return (
            request.env["product.product"]
            .sudo()
            .search_read(
                [], ["id", "name", "list_price", "image_1920", "default_code"], limit=18
            )
        )

    # API Endpoint for searching products based on a query
    @http.route("/fulfillment/api/v1/search-products", type="json", auth="user")
    def search_products(self, query):
        query = query.strip()
        return (
            request.env["product.product"]
            .sudo()
            .search_read(
                [
                    "|",
                    "|",
                    ("name", "ilike", query),
                    ("default_code", "ilike", query),
                    ("barcode", "ilike", query),
                ],
                ["id", "name", "list_price", "image_1920", "default_code"],
                limit=18,
            )
        )

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
                        # "name": 1,
                        "customer_id": kwargs.get("customer_id"),
                        "total_amount": kwargs.get("total_amount"),
                        "shipping_price": kwargs.get("shipping_price"),
                        "state": "draft",
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
