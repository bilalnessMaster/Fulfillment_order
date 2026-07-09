import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class SalesNavbar extends Component {
    static template = "fulfillment_order.SalesNavbar";
    setup() {
        this.input = useState({ search: "" });
        this.state = useState(useService("fulfillmentProduct"));
        // this.user = useService("user")
    }
    handleSearchInput(event) {
        if (event.key === "Enter") {
            this.state.searchProducts(this.input.search);
        }
    }
    handlelocationChange(event) {
        
        this.state.productLocation = event.target.value;
    }
}
