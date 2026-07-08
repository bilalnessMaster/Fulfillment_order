import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { FulfillmentAPI } from "../api/filfulmnetAPI";

registry.category("services").add("fulfillmentCustomer", {
    start() {
        return reactive({
            // state of the app
            isSearchOpen: false,
            customers: [],
            currentCustomer: [],
            async loadCustomers() {
                const response = await FulfillmentAPI.loadCustomers();
                console.log("loadCustomers", response);
                this.customers = response || []
            },
            async searchCustomer(phone) {
                const response = await FulfillmentAPI.SearchQueryProducts(phone);
                console.log("searchCustomer", phone, response);
                this.customers = response || [];
            },
            setSearchOpen(isOpen) {
                this.isSearchOpen = isOpen;
            },
            selectCustomer(customer) {
                this.currentCustomer = customer;
                this.isSearchOpen = false;
            }
        });
    },
});