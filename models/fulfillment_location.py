from odoo import fields, models, api




class FulfilmentLocation(models.Model):
    _name = "fulfillment.location"
    _description = "Fulfilment Location"

    name = fields.Char(string="Name", required=True)
    description = fields.Text(string="Description")
    active = fields.Boolean(string="Active", default=True)
    website_link = fields.Char(string="Website Link")

    warehouse_ids = fields.Many2many(
        "stock.warehouse", string="Warehouses", required=True
    )