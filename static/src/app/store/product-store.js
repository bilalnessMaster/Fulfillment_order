import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { FulfillmentAPI } from "../api/fulfillmentAPI";

registry.category("services").add("fulfillmentProduct", {
    start() {
        const store = reactive({
            products: [],
            productLocation: "",
            loading: false,
            async loadProducts() {

                if (!this.productLocation) return;
                store.loading = true;
                try {
                    const response = await FulfillmentAPI.loadProducts(this.productLocation);
                    console.log("response", response);
                    store.products = response || [];
                } catch (e) {
                    console.error("Failed to load products", e);
                    store.products = [];
                } finally {
                    store.loading = false;
                }
            },
            async searchProducts(query) { 
                if (!this.productLocation || !query) return;
                store.loading = true;
                try {
                    const response = await FulfillmentAPI.SearchQueryProducts(query, this.productLocation);
                    store.products = response || [];
                } catch (e) {
                    console.error("Failed to search products", e);
                    store.products = [];
                } finally {
                    store.loading = false;
                }
            }
        });
        return store;
    },
});
