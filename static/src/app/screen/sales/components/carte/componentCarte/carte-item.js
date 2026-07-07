import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";





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