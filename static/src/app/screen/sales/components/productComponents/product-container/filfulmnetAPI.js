/** @odoo-module **/

import { rpc } from "@web/core/network/rpc";
export class FulfillmentAPI {
    static loadProducts() {
        return rpc("/fulfillment/api/v1/get-products");
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
}