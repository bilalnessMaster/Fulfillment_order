from odoo import fields, models, api, _



class FulfilmentPosSetting(models.Model):
    _name = 'fulfillment.pos.setting'
    _description = 'Fulfilment POS Setting'

    name = fields.Char(string="Name", required=True)
    active = fields.Boolean(string="Active", default=True)
    website_link = fields.Char(string="Website Link")
    warehouse_ids = fields.Many2many('stock.warehouse', string="Warehouses", required=True)
    pos_ids = fields.Many2many('pos.config', string="POS", required=True)
    
    
    