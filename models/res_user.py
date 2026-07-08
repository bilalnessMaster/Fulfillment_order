

from odoo import models, fields, api, _


class ResUsers(models.Model):
    _inherit = 'res.users'
    
    
    allowed_fulfilment_pos_ids = fields.Many2many('fulfillment.pos', string="Allowed POS")