import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";

registry.category("services").add("fulfillmentStore", {
    start() {
        return reactive({
            // state of the app
            activeScreen: "sales",
            show(screen) {
                this.activeScreen = screen;
            },
            
        });
    },
});