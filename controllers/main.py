from odoo import http
from odoo.http import request, route


class FulfilmentOrderController(http.Controller):
    @http.route("/fulfilment", type="http", auth="user", website=True)
    def entry_point_fulfilment(self, pos_id=None):
        """
        Renders the fulfilment order page
        """
        pos_records = request.env["fulfillment.pos"].sudo().search([])

        return request.render("fulfillment_order.fulfillment_index_page")

    @http.route("/fulfillment/api/v1/get-products", type="json", auth="user")
    def get_products(self):
        return (
            request.env["product.product"]
            .sudo()
            .search_read(
                [], ["id", "name", "list_price", "image_1920", "default_code"], limit=18
            )
        )

    @http.route("/fulfillment/api/v1/get-pos", type="json", auth="user")
    def get_pos(self):
        return request.env["fulfillment.pos"].load_data()

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
