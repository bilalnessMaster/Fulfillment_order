import { Component, onMounted, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { OrderCard } from "../order-card/order-card";

export class OrderContainer extends Component {
    static template = "fulfillment_order.orders_orders_container";
    static components = {
        OrderCard
    }
    setup() {
        this.orders = useState(useService("fulfillmentOrder"));
        onMounted(() => {
            this.orders.loadOrders();
        })
    }
}
