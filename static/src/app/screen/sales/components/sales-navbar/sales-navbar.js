import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";





export class SalesNavbar extends Component {
    static template = "fulfillment_order.SalesNavbar";
    setup() {
        this.input = useState({ search: "" });
        this.orm = useService("orm");
        this.state = useState(useService("fulfillmentProduct"));
    }
    handleSearchInput(event) {
        if (event.key === "Enter") {
            this.state.searchProducts(this.input.search);
        }
    }
}
