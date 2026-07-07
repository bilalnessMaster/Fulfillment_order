
import { Component, onMounted, useState } from "@odoo/owl";
import { ProductCard } from "../card-product/card-product";
import { useService } from "@web/core/utils/hooks";
import { FulfillmentAPI } from "./filfulmnetAPI";

import { rpc } from "@web/core/network/rpc";



export class ProductsList extends Component {
    static template = "fulfillment_order.sales_products_container";
    static components = {
        ProductCard
    }
    setup() {
        this.state = useState({
            products: []
        });
        this.cart = useState(useService("fulfillmentCart"));
        onMounted(() => {
            console.log("ProductsList mounted");
            this.fetchProducts();
        })
    }

    async fetchProducts() {
        const products = await FulfillmentAPI.loadProducts();
        // const products = await rpc("/fulfillment/api/v1/get-products");
        console.log("products", products);
        this.state.products = products;
    }
}
