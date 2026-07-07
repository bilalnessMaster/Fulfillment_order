import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";





export class SalesNavbar extends Component {
    static template = "fulfillment_order.SalesNavbar";
    setup() {
        this.orm = useService("orm");
        this.state = useState({
            searchQuery: "",
        })
    }


    searchProducts() {

    }
}
