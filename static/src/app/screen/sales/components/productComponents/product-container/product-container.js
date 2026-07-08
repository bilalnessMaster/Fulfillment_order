import { Component, onMounted, useState } from "@odoo/owl";
import { ProductCard } from "../card-product/card-product";
import { useService } from "@web/core/utils/hooks";

export class ProductsList extends Component {
    static template = "fulfillment_order.sales_products_container";
    static components = {
        ProductCard
    }
    setup() {
        this.state = useState(useService("fulfillmentProduct"));
        this.cart = useState(useService("fulfillmentCart"));
        onMounted(() => {
            this.state.loadProducts();
        })
    }
}
