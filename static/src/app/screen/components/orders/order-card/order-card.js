import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class OrderCard extends Component {
    static template = "fulfillment_order.order_card";
    static props = ["order"];
    setup() {
        this.orders = useState(useService("fulfillmentOrder"));
    }

    selectOrder() {
        this.orders.selectOrder(this.props.order);
    }

    getStateColor(state) {
        const colors = {
            draft: "bg-gray-100 text-gray-700 border-gray-200",
            confirmed: "bg-blue-100 text-blue-700 border-blue-200",
            processing: "bg-yellow-100 text-yellow-700 border-yellow-200",
            shipped: "bg-purple-100 text-purple-700 border-purple-200",
            delivered: "bg-green-100 text-green-700 border-green-200",
            returned: "bg-orange-100 text-orange-700 border-orange-200",
            cancelled: "bg-red-100 text-red-700 border-red-200",
        };
        return colors[state] || "bg-gray-100 text-gray-700";
    }

    formatDate(dateStr) {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    }
}
