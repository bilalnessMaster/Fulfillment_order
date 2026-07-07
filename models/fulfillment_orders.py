from odoo import fields, models, api, _


class FulfilmentOrders(models.Model):
    _name = "fulfillment.orders"
    _description = "Fulfilment Orders"

    name = fields.Char(string="Order Name", required=True)

    fulfilment_pos_id = fields.Many2one(
        "fulfillment.pos", string="Pos", required=True, help="helps assign POS for the order"
    )

    order_date = fields.Datetime(string="Order Date", default=fields.Datetime.now)

    order_lines = fields.One2many(
        "fulfillment.order.lines", "order_id", string="Order Lines"
    )

    order_taker = fields.Many2one(
        "res.users", string="Order Taker", default=lambda self: self.env.user.id
    )
    
    shipping_price = fields.Float(string="Shipping Price")
    total_amount = fields.Float(string="Total Amount" , compute="_compute_total_amount", store=True)
    customer_id = fields.Many2one("res.partner", string="Customer")

    state = fields.Selection(
        [
            ("draft", "Draft"),
            ("confirmed", "Confirmed"),
            ("processing", "Processing"),
            ("shipped", "Shipped"),
            ("delivered", "Delivered"),
            ("cancelled", "Cancelled"),
        ],
        default="draft",
        string="State",
    )
    
    
    @api.depends("order_lines.total_amount", "shipping_price")
    def _compute_total_amount(self):
        for order in self:
            order.total_amount = sum(line.total_amount for line in order.order_lines) + order.shipping_price
