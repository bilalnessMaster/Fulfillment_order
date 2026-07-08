
import { Component, onMounted, useState } from "@odoo/owl";
import { ProductCard } from "../card-product/card-product";
import { useService } from "@web/core/utils/hooks";
import { FulfillmentAPI } from "../../../../../api/filfulmnetAPI";
;



export class ProductsList extends Component {
    static template = "fulfillment_order.sales_products_container";
    static components = {
        ProductCard
    }
    setup() {
        this.state = useState(useService("fulfillmentProduct"));
        this.cart = useState(useService("fulfillmentCart"));
        onMounted(() => {
            console.log("ProductsList mounted");
            this.state.loadProducts();
            console.log("ProductsList mounted", this.state.products);
        })
    }

}
