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
        return  request.env["product.product"].sudo().search_read([], ["id", "name", "list_price", "image_1920", "default_code"], limit=16)

    @http.route("/fulfillment/api/v1/get-pos", type="json", auth="user")
    def get_pos(self):
        return request.env["fulfillment.pos"].load_data()
