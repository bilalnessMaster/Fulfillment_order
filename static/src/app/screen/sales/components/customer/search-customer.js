import { Component, onMounted, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";



export class SearchCustomer extends Component {
    static template = "fulfillment_order.customer_search";
    setup() {
        this.customerStore = useState(useService("fulfillmentCustomer"));
        this.orm = useService("orm");
        onMounted(() => {

            console.log("SearchCustomer mounted");
            this.customerStore.loadCustomers();
        })
    }
}