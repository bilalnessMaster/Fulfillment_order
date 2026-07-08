/** @odoo-module **/

import { rpc } from "@web/core/network/rpc";
export class FulfillmentAPI {
    // porduct API
    static loadProducts() {
        return rpc("/fulfillment/api/v1/get-products");
    }
    static SearchQueryProducts(query) {
        return rpc("/fulfillment/api/v1/search-products", { query });
    }
    static createOrder(data) {
        return rpc("/fulfillment/api/order/create", data);
    }

    static updateStatus(orderId, status) {
        return rpc("/fulfillment/api/order/update_status", {
            order_id: orderId,
            status,
        });
    }

    // customer API
    static loadCustomers() {
        return rpc("/fulfillment/api/v1/get-customers");
    }
    static SearchQueryCustomers(phone) {
        return rpc("/fulfillment/api/v1/search-customers", { phone });
    }

    static createCustomer(data) {
        return rpc("/fulfillment/api/customer/create", data);
    }

    static updateCustomer(data) {
        return rpc("/fulfillment/api/customer/update", data);
    }
}