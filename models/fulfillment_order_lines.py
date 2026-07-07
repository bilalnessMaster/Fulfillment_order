from odoo import models, fields, api, _


class FulfilmentLines(models.Model):
    _name = "fulfillment.order.lines"
    _description = "Fulfilment Order Lines"

    order_id = fields.Many2one("fulfilment.orders", string="Order", required=True)

    product_id = fields.Many2one("product.product", string="Product", required=True)

    quantity = fields.Integer(string="Quantity", required=True)

    unit_price = fields.Float(string="Unit Price", required=True)

    total_amount = fields.Float(
        string="Total Amount", compute="_compute_total_amount", store=True
    )

    @api.depends("quantity", "unit_price")
    def _compute_total_amount(self):
        for line in self:
            line.total_amount = (line.quantity or 0) * (line.unit_price or 0)
