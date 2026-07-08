import { Component, useEffect } from "@odoo/owl";

export class Loader extends Component {
    static template = "fulfillment_order.Loader";
    static props = { loader: { type: Object, shape: { isShown: Boolean } } };
    setup() {
        useEffect(
            (isShown) => {
                if (!isShown) {
                    setTimeout(() => {
                        this.__owl__.app.destroy();
                    }, 1000);
                }
            },
            () => [this.props.loader.isShown]
        );
    }
}
