
import { Component } from "@odoo/owl";
import { SalesNavbar } from "./components/sales-navbar/sales-navbar.js";
import { ProductsList } from "./components/productComponents/product-container/product-container.js";
import { ProductCard } from "./components/productComponents/card-product/card-product.js";
import { CarteItems } from "./components/carte/carte-items.js";
import { SearchCustomer } from "./components/customer/search-customer.js";
// import { CarteItems } from "./components/carte/carte-items.js";


export class SalesScreen extends Component {
    static template = "fulfillment_order.sales_screen";
    static components = {
        SalesNavbar,
        ProductsList,
        ProductCard,
        CarteItems,
        SearchCustomer
    }
}
