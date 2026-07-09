from odoo import models, fields, api, _


class FulfilmentPos(models.Model):
    _name = "fulfillment.pos"
    _description = "Fulfilment POS"

    name = fields.Char(string="Name", required=True)
    description = fields.Text(string="Description")
    active = fields.Boolean(string="Active", default=True)
    website_link = fields.Char(string="Website Link")

    warehouse_ids = fields.Many2many(
        "stock.warehouse", string="Warehouses", required=True
    )
    sequence_order_id = fields.Many2one(
        "ir.sequence", string="Order Sequence", required=True
    )

    @api.model
    def load_data(self):
        return self.search_read([], ["id", "name", "description", "website_link"])
