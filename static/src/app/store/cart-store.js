import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";

registry.category("services").add("fulfillmentCart", {
    start() {
        return reactive({
            // state of the app
            cart: [],
            addToCart(product) {
                const productFind = this.cart.find(p => p.id === product.id);
                if (productFind) {
                    productFind.quantity += 1;
                } else {
                    this.cart.push({ ...product, quantity: 1 });
                }
                console.log("this.cart", this.cart);
            },
            removeFromCart(product) {
                const productIndex = this.cart.findIndex(p => p.id === product.id);
                if (productIndex !== -1) {
                    this.cart.splice(productIndex, 1);
                }
            },
            incrementQuantity(product,) {
                const productFind = this.cart.find(p => p.id === product.id);
                if (productFind) {
                    productFind.quantity += 1;
                }
            },
            decrementQuantity(product,) {
                const productFind = this.cart.find(p => p.id === product.id);
                if (productFind && productFind.quantity > 1) {
                    productFind.quantity -= 1;
                }
            },
            changePrice(product, newPrice) {
                const productFind = this.cart.find(p => p.id === product.id);
                if (productFind) {
                    productFind.list_price = newPrice;
                }
            }
        });
    },
});
