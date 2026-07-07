
import { Component } from "@odoo/owl";




export class ProductCard extends Component {
    static template = "fulfillment_order.sales_product_card";
    static props = {
        "product": Object,
        "addToCart": Function
    };
}
