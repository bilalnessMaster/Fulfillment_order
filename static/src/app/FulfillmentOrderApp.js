import { reactive, Component, onMounted, onWillStart, useState } from "@odoo/owl";
// import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";
import { Navbar } from "./component/Navbar/Navbar";
import { SalesScreen } from "./screen/sales/sales";
import { OrdersScreen } from "./screen/orders/orders";
import { FulfillmentAPI } from "./api/fulfillmentAPI";

// root component of the fulfillment order app

export class FulfillmentOrderApp extends Component {
    static template = "fulfillment_order.FulfillmentOrderApp";
    static components = {
        Navbar,
        SalesScreen,
        OrdersScreen,
    };
    setup() {
        this.store = useState(useService("fulfillmentStore"));
        onMounted(async () => {
            // console.log(window.fulfillment.pos);
            // console.log(window.fulfillment.fulfillment_locations);
            // console.log(window.fulfillment.fulfillment_role);
            // console.log(window.fulfillment.user);
            // const profile = await FulfillmentAPI.laodProfile();
            // console.log("profile", profile);
            console.log("FulfillmentOrderApp mounted");
        })
    }
}