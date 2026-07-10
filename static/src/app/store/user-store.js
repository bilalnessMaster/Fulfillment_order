import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { FulfillmentAPI } from "../api/fulfillmentAPI";

registry.category("services").add("fulfillmentUser", {
    start() {
        return reactive({
            // state of the app
            user: {},
            pos: {},
            location: {},
            async loadProfile() {
                try {
                    const response = await FulfillmentAPI.loadProfile();
                    console.log("response", response);
                    this.user = response.user
                    this.pos = response.pos
                    this.location = response.location
                } catch (e) {
                    console.error("Failed to load profile", e);
                }
            }

        });
    },
});