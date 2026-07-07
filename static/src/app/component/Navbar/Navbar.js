

import { Component, onMounted } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class Navbar extends Component {
    static template = "fulfillment_order.Navbar";

    setup() {
        this.store = useService("fulfillmentStore");

        onMounted(() => {
            console.log("Navbar mounted");
        });

    }
    goSales() {
        console.log("goSales");
        this.store.show("sales");
        console.log("this.store", this.store.activeScreen);
    }

    goOrders() {
        console.log("goOrders")
        this.store.show("orders");
        console.log("this.store", this.store.activeScreen);
    }
}