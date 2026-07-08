import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class EditCustomer extends Component {
    static template = "fulfillment_order.customer_edit";
    setup() {
        this.customerStore = useState(useService("fulfillmentCustomer"));
    }
}
