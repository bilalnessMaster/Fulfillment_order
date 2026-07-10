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
        try:
            user = self.env.user.read(
                [
                    "id",
                    "fulfilment_pos_id",
                    "name",
                    "login",
                    "fulfillment_role",
                    "fulfillment_location_ids",
                ]
            )[0]
            location = (
                self.env["fulfillment.location"]
                .search([("id", "in", user["fulfillment_location_ids"])])
                .read(["id", "name"])
            )
            pos = self.search([("id", "=", user["fulfilment_pos_id"][0])]).read(
                ["id", "name"]
            )[0]
            return {"user": user, "pos": pos, "location": location}
        except Exception as e:
            return {"error": str(e), "pos": pos, "user": user}
