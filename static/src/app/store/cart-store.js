import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";

registry.category("services").add("fulfillmentCart", {
    start() {
        return reactive({
            // state of the app
            cart: [],
            subtotal: 0,
            tax: 0,
            total: 0,
            addToCart(product) {
                // console.log("product", product.id ,this.cart);
                const productFind = this.cart?.find(p => p.id === product.id);
                if (productFind) {
                    productFind.quantity += 1;
                } else {
                    this.cart.push({ ...product, quantity: 1 });
                }
                // console.log("this.cart", this.cart);
                this.calculateTotals();
            },
            removeFromCart(product) {
                const productIndex = this.cart.findIndex(p => p.id === product.id);
                if (productIndex !== -1) {
                    this.cart.splice(productIndex, 1);
                }
                this.calculateTotals();
            },
            incrementQuantity(product,) {
                const productFind = this.cart?.find(p => p.id === product.id);
                if (productFind) {
                    productFind.quantity += 1;
                }
                this.calculateTotals();
            },
            decrementQuantity(product,) {
                const productFind = this.cart?.find(p => p.id === product.id);
                if (productFind && productFind.quantity > 1) {
                    productFind.quantity -= 1;
                }
                this.calculateTotals();
            },
            changePrice(product, newPrice) {
                const productFind = this.cart?.find(p => p.id === product.id);
                if (productFind) {
                    productFind.list_price = newPrice;
                }
                this.calculateTotals();
            },
            calculateTotals() {
                this.subtotal = this.cart.reduce((sum, item) => sum + (item.list_price * item.quantity), 0);
                this.tax = this.subtotal * 0.08;
                this.total = this.subtotal + this.tax;
            }
        });
    },
});
