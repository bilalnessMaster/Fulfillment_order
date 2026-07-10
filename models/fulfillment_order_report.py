from odoo import models, fields, api, _
import logging

_logger = logging.getLogger(__name__)


class PackageReport(models.AbstractModel):
    _name = "report.fulfillment_order.fulfillment_orders_report"
    _description = "Order Reciepte"

    def _get_report_values(self, docids, data=None):
        _logger.info(f"Model id: {docids}")
        order = self.env["fulfillment.orders"].browse(docids).ensure_one()

        lines = order.order_lines
        client = order.customer_id
        data = {"order": order, "lines": lines, "client": client}

        return data
