import { mount, reactive, whenReady } from "@odoo/owl";
import { mountComponent } from "@web/env";
import { FulfillmentOrderApp } from "./FulfillmentOrderApp";
import { getTemplate } from "@web/core/templates";
import { Loader } from "@fulfillment_order/app/loader/loader";
import { _t } from "@web/core/l10n/translation";
// TODO: adding loader while the app is loading

// const loader = reactive({ isShown: true });

// whenReady(() => {
//     mount(Loader, document.body, {
//         getTemplate,
//         props: { loader },
//         translatableAttributes: ["data-tooltip"],
//         translateFn: _t,
//     });
// });


(
    async () => {

        await whenReady();
        await mountComponent(FulfillmentOrderApp, document.body, {
            props: {
                name: "Fulfillment Order",
                // props: { disableLoader: () => (loader.isShown = false) },
            },
        });

    }
)();