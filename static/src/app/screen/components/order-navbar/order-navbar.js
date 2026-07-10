import { Component, useState, onMounted } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class OrderNavbar extends Component {
    static template = "fulfillment_order.orderNavbar";
    setup() {
        this.input = useState({ search: "" });
        this.orders = useState(useService("fulfillmentOrder"));
        this.profile = useState(useService("fulfillmentUser"));

        onMounted(() => {
            this.profile.loadProfile();
            this.orders.loadOrders();
        })
    }

    handleSearchInput(event) {
        if (event.key === "Enter") {
            this.orders.setSearch(this.input.search);
        }
    }

    handleSearchInputLive(event) {
        this.orders.setSearch(event.target.value);
    }

    setFilter(filter) {
        this.orders.setFilter(filter);
    }

    getFilterCount(filter) {
        return this.orders.getCountByState(filter);
    }

    isActive(filter) {
        return this.orders.activeFilter === filter;
    }
}
