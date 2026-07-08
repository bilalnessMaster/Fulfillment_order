import { whenReady } from "@odoo/owl";
import { mountComponent } from "@web/env";
import { FulfillmentOrderApp } from "./FulfillmentOrderApp";

(
    async () => {
        await whenReady();
        await mountComponent(FulfillmentOrderApp, document.body);
    }
)();
