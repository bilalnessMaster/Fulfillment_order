import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { FulfillmentAPI } from "../api/fulfillmentAPI";

registry.category("services").add("fulfillmentCustomer", {
    start() {
        const store = reactive({
            isContainerOpen: false,
            isSearchOpen: false,
            isCreateOpen: false,
            isEditOpen: false,
            customers: [],
            currentCustomer: {},
            newCustomer: {
                name: "",
                phone: "",
                city: "",
                address: "",
            },
            newInfoCustomer: {
                name: "",
                phone: "",
                city: "",
                address: "",
            },
            searchQuery: "",
            message_after_request: "",
            async loadCustomers() {
                try {
                    const response = await FulfillmentAPI.loadCustomers();
                    store.customers = response || [];
                } catch (e) {
                    console.error("Failed to load customers", e);
                    store.customers = [];
                }
            },
            handleSearch(query) {
                store.searchQuery = query;
            },
            async searchCustomers(ev) {
                console.log("Search query:", store.searchQuery);
                if (ev.key === "Enter") {
                    try {
                        const response = await FulfillmentAPI.SearchQueryCustomers(store.searchQuery);
                        store.customers = response || [];
                    } catch (e) {
                        console.error("Failed to search customers", e);
                        store.customers = [];
                    }
                }
            },
            setSearchOpen(isOpen) {
                store.isSearchOpen = isOpen;
                store.isContainerOpen = isOpen;
                store.message_after_request = "";
                store.isCreateOpen = false;
                store.isEditOpen = false;
            },
            setCreateOpen(isOpen) {
                store.isCreateOpen = isOpen;
                store.isContainerOpen = isOpen;
                store.message_after_request = "";
                store.isEditOpen = false;
                store.isSearchOpen = false;
            },
            setEditOpen(isOpen) {
                store.message_after_request = "";
                store.isCreateOpen = false;
                store.isSearchOpen = false;
                if (!store.currentCustomer || Object.keys(store.currentCustomer).length === 0) return;
                if (isOpen) {
                    store.newInfoCustomer = {
                        id: store.currentCustomer.id,
                        name: store.currentCustomer.name,
                        phone: store.currentCustomer.phone,
                        city: store.currentCustomer.city,
                        address: store.currentCustomer.address,
                    }
                }
                store.isEditOpen = isOpen;
                store.isContainerOpen = isOpen;
            },
            selectCustomer(customer) {
                store.currentCustomer = {
                    id: customer.id,
                    city: customer.city,
                    name: customer.name,
                    phone: customer.phone,
                    address: customer.street,
                };
                store.isSearchOpen = false;
                store.isCreateOpen = false;
                store.isContainerOpen = false;
            },
            updateNewCustomer(key, value) {
                store.newCustomer[key] = value;
            },
            editCustomer(key, value) {
                store.newInfoCustomer[key] = value;
            },
            async saveNewCustomer() {
                try {
                    const response = await FulfillmentAPI.createCustomer(store.newCustomer);
                    if (response && response.error) {
                        store.message_after_request = response.error;
                    } else if (response && response.length > 0) {
                        store.currentCustomer = {
                            city: response[0].city,
                            name: response[0].name,
                            phone: response[0].phone,
                            address: response[0].street,
                            id: response[0].id
                        };
                        store.message_after_request = "Customer created successfully";
                        store.newCustomer = {
                            name: "",
                            phone: "",
                            city: "",
                            address: "",
                        };
                    }
                } catch (e) {
                    console.error("Failed to create customer", e);
                    store.message_after_request = "Failed to create customer";
                }
            },
            async saveExistedCustomer() {
                try {
                    const response = await FulfillmentAPI.updateCustomer(store.newInfoCustomer);
                    if (response && response.error) {
                        store.message_after_request = response.error;
                    } else if (response && response.length > 0) {
                        // console.log("Response from updateCustomer:", response);
                        store.currentCustomer = {
                            city: response[0].city,
                            name: response[0].name,
                            phone: response[0].phone,
                            address: response[0].street,
                            id: response[0].id
                        };
                        store.message_after_request = "Customer updated successfully";
                        // console.log("Updated customer:", store.currentCustomer);
                    }
                } catch (e) {
                    console.error("Failed to update customer", e);
                    store.message_after_request = "Failed to update customer";
                }
            }
        });
        return store;
    },
});
