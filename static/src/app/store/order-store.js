import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { FulfillmentAPI } from "../api/fulfillmentAPI";

registry.category("services").add("fulfillmentOrder", {
    dependencies: ["fulfillmentCart", "fulfillmentCustomer", "fulfillmentUser", "fulfillmentProduct"],
    start(env, { fulfillmentCart, fulfillmentCustomer, fulfillmentUser, fulfillmentProduct }) {
        return reactive({
            orders: [],
            filteredOrders: [],
            selectedOrder: null,
            activeFilter: "all",
            searchQuery: "",

            async sendToPreparation() {
                if (fulfillmentCart.cart.length === 0) {
                    console.error("Cart is empty.");
                    return;
                }
                if (!fulfillmentCustomer.currentCustomer.id) {
                    console.error("No customer selected.");
                    return;
                }
                if (fulfillmentCart.total <= 0) {
                    console.error("Total is zero or negative.");
                    return;
                }
                if (!fulfillmentUser.user?.name || !fulfillmentUser.pos.id) {
                    console.error("User not logged in.");
                    return;
                }
                if (!fulfillmentProduct?.productLocation) {
                    console.error("Location not selected.");
                    return;
                }

                await FulfillmentAPI.sendToPreparation({
                    fulfilment_pos_id: fulfillmentUser.pos.id,
                    lines: fulfillmentCart.cart.map(line => ({
                        product_id: line.id,
                        quantity: line.quantity,
                        price_unit: line.list_price
                    })),
                    customer_id: fulfillmentCustomer.currentCustomer.id,
                    total_amount: fulfillmentCart.total,
                    subtotal: fulfillmentCart.subtotal,
                    shipping_price: fulfillmentCart.shipping,
                    location_id: fulfillmentProduct.productLocation
                });

                fulfillmentCart.clearCart();
                await this.loadOrders();
            },

            async loadOrders() {
                try {
                    const response = await FulfillmentAPI.loadOrders();
                    this.orders = response || [];
                    this._applyFilters();
                } catch (e) {
                    console.error("Failed to load orders", e);
                    this.orders = [];
                    this.filteredOrders = [];
                }
            },

            setFilter(filter) {
                this.activeFilter = filter;
                this._applyFilters();
            },

            setSearch(query) {
                this.searchQuery = query.toLowerCase();
                this._applyFilters();
            },

            selectOrder(order) {
                this.selectedOrder = order;
            },

            closeDetail() {
                this.selectedOrder = null;
            },

            async updateOrderStatus(orderId, newStatus) {
                try {
                    await FulfillmentAPI.updateOrderStatus(orderId, newStatus);
                    await this.loadOrders();
                    if (this.selectedOrder && this.selectedOrder.id === orderId) {
                        this.selectedOrder = this.filteredOrders.find(o => o.id === orderId) || null;
                    }
                } catch (e) {
                    console.error("Failed to update order status", e);
                }
            },

            _applyFilters() {
                let result = [...this.orders];

                if (this.activeFilter !== "all") {
                    result = result.filter(o => o.state === this.activeFilter);
                }

                if (this.searchQuery) {
                    result = result.filter(o => {
                        const name = (o.name_order || "").toLowerCase();
                        const customer = (o.customer_id?.name || "").toLowerCase();
                        return name.includes(this.searchQuery) || customer.includes(this.searchQuery);
                    });
                }

                this.filteredOrders = result;
            },

            getCountByState(state) {
                if (state === "all") return this.orders.length;
                return this.orders.filter(o => o.state === state).length;
            },

            getNextStates(currentState) {
                const transitions = {
                    draft: ["confirmed", "cancelled"],
                    confirmed: ["processing", "cancelled"],
                    processing: ["shipped", "cancelled"],
                    shipped: ["delivered"],
                    delivered: [],
                    returned: [],
                    cancelled: [],
                };
                return transitions[currentState] || [];
            },
        });
    },
});
