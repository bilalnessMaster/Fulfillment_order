import { Component, onMounted, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { CreateCustomer } from "../create/create-customer";
import { EditCustomer } from "../edit/edit-customer";
import { SearchCustomer } from "../search/search-customer";

export class ContainerCustomer extends Component {
    static template = "fulfillment_order.customer_container";
    static components = {
        CreateCustomer,
        EditCustomer,
        SearchCustomer
    }
    setup() {
        this.customerStore = useState(useService("fulfillmentCustomer"));
        onMounted(() => {
            this.customerStore.loadCustomers();
        })
    }
}
