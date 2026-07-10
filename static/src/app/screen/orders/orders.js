import { Component, onMounted } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { OrderNavbar } from "../components/order-navbar/order-navbar";
import { OrderContainer } from "../components/orders/orders-container/orders-container";
import { OrderDetail } from "../components/orders/order-detail/order-detail";

export class OrdersScreen extends Component {
    static template = "fulfillment_order.orders_screen";
    static components = {
        OrderNavbar,
        OrderContainer,
        OrderDetail
    }
}
