import { Component } from "@odoo/owl";
import { SalesNavbar } from "./components/sales-navbar/sales-navbar.js";
import { ProductsList } from "./components/productComponents/product-container/product-container.js";
import { CarteItems } from "./components/carte/carte-items.js";
import { ContainerCustomer } from "./components/customer/container/container-customer.js";

export class SalesScreen extends Component {
    static template = "fulfillment_order.sales_screen";
    static components = {
        SalesNavbar,
        ProductsList,
        CarteItems,
        ContainerCustomer
    }
}
