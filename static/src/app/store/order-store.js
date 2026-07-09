import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { FulfillmentAPI } from "../api/fulfillmentAPI";

registry.category("services").add("fulfillmentOrder", {
    dependencies: ["fulfillmentCart", "fulfillmentCustomer"],
    start(env, { fulfillmentCart, fulfillmentCustomer }) {
        console.log(fulfillmentCart, fulfillmentCustomer);
        // fulfillmentCart
        // const cartStore = env.services.fulfillmentCart;
        // const customerStore = env.services.fulfillmentCustomer;
        return reactive({
            async sendToPreparation() {
                console.log("this cart items", fulfillmentCart.cart);
                console.log("this customer", fulfillmentCustomer.currentCustomer);
                console.log("this subtotal", fulfillmentCart.subtotal);
                console.log("this shipping", fulfillmentCart.shipping);
                console.log("this total", fulfillmentCart.total);
                // Here you can implement the logic to send the cart and customer data to the server for preparation.

                // validate that the cart is not empty and a customer is selected
                if (fulfillmentCart.cart.length === 0) {
                    console.error("Cart is empty. Cannot send to preparation.");
                    return;
                }

                if (!fulfillmentCustomer.currentCustomer) {
                    console.error("No customer selected. Cannot send to preparation.");
                    return;
                }

                if (fulfillmentCart.subtotal <= 0) {
                    console.error("Subtotal is zero or negative. Cannot send to preparation.");
                    return;
                }
                if (fulfillmentCart.shipping < 0) {
                    console.error("Shipping cost is negative. Cannot send to preparation.");
                    return;
                }


                await FulfillmentAPI.sendToPreparation({
                    // for the backend remove image from  line for performance 
                    lines: fulfillmentCart.cart.map(line => ({
                        product_id: line.id,
                        quantity: line.quantity,
                        price_unit: line.list_price
                    })),
                    customer_id: fulfillmentCustomer.currentCustomer.id,
                    total_amount: fulfillmentCart.total,
                    subtotal: fulfillmentCart.subtotal,
                    shipping_price: fulfillmentCart.shipping
                });

                fulfillmentCart.clearCart();
            },
        });
    },
});