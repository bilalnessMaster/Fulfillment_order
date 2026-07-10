import { Component, useState, onMounted } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class SalesNavbar extends Component {
    static template = "fulfillment_order.SalesNavbar";
    setup() {
        this.input = useState({ search: "" });
        this.state = useState(useService("fulfillmentProduct"));
        this.profile = useState(useService("fulfillmentUser"));
        // this.user = useService("user")
        onMounted(() => {
            this.profile.loadProfile();
            console.log("profile", this.profile.user , this.profile.pos);
            console.log("SalesNavbar mounted");
        })
    }
    handleSearchInput(event) {
        if (event.key === "Enter") {
            this.state.searchProducts(this.input.search);
        }
    }
    handlelocationChange(event) {
        this.state.productLocation = event.target.value;
        this.state.loadProducts();
    }
}
