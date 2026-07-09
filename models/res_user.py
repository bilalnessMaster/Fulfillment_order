from odoo import models, fields, api, _


class ResUsers(models.Model):
    _inherit = "res.users"

    fulfilment_pos_id = fields.Many2one(
        "fulfillment.pos", string="Default fulfillment POS"
    )
    fulfillment_role = fields.Selection(
        [("manager", "Manager"), ("taker", "Taker"), ("processor", "Processor")],
        string="Fulfillment Role",
    )
    fulfillment_location_ids = fields.Many2many(
        "fulfillment.location", string="Fulfillment Locations"
    )
