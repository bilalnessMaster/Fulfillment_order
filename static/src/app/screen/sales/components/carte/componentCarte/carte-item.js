import { Component } from "@odoo/owl";

export class CarteItem extends Component {
    static template = "fulfillment_order.carte_item";

    static props = {
        product: Object,
        increment: Function,
        decrement: Function,
        remove: Function,
        changePrice: Function
    }
}
