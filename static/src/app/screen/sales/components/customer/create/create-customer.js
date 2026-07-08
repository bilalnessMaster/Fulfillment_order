import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class CreateCustomer extends Component {
    static template = "fulfillment_order.customer_create";
    setup() {
        this.customerStore = useState(useService("fulfillmentCustomer"));
    }
}
