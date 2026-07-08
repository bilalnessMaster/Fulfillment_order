import { Component, onMounted, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class Navbar extends Component {
    static template = "fulfillment_order.Navbar";

    setup() {
        this.store = useState(useService("fulfillmentStore"));

        onMounted(() => {
            console.log("Navbar mounted");
        });

    }
    goSales() {
        this.store.show("sales");
    }

    goOrders() {
        this.store.show("orders");
    }
}
