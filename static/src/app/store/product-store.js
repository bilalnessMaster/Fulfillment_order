import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { FulfillmentAPI } from "../api/filfulmnetAPI";

registry.category("services").add("fulfillmentProduct", {
    start() {
        return reactive({
            // state of the app
            products: [],
            async loadProducts() {
                const response = await FulfillmentAPI.loadProducts();
                console.log("loadProducts", response);
                this.products = response || []
            },
            async searchProducts(query) {
                const response = await FulfillmentAPI.SearchQueryProducts(query);
                console.log("searchProducts", query, response);
                this.products = response || [];
            }
        });
    },
});