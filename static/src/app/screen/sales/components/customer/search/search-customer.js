import { Component, onMounted, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { CreateCustomer } from "../create/create-customer";
import { EditCustomer } from "../edit/edit-customer";

export class SearchCustomer extends Component {
    static template = "fulfillment_order.customer_search";
    static components = {
        CreateCustomer,
        EditCustomer
    }
    setup() {
        this.customerStore = useState(useService("fulfillmentCustomer"));
        onMounted(() => {
            this.customerStore.loadCustomers();
        })
    }
}
