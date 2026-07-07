import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { CarteItem } from "./componentCarte/carte-item.js";





export class CarteItems extends Component {
    static template = "fulfillment_order.carte_items";
    static components = {
        CarteItem
    }
    setup() {
        this.cart = useState(useService("fulfillmentCart"));
    }
}