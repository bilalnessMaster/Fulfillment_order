import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { FulfillmentAPI } from "../api/fulfillmentAPI";

registry.category("services").add("fulfillmentProduct", {
    start() {
        const store = reactive({
            products: [],
            loading: false,
            async loadProducts() {
                store.loading = true;
                try {
                    const response = await FulfillmentAPI.loadProducts();
                    store.products = response || [];
                } catch (e) {
                    console.error("Failed to load products", e);
                    store.products = [];
                } finally {
                    store.loading = false;
                }
            },
            async searchProducts(query) {
                store.loading = true;
                try {
                    const response = await FulfillmentAPI.SearchQueryProducts(query);
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
