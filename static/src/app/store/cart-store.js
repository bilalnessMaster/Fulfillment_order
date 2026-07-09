import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";

registry.category("services").add("fulfillmentCart", {
    start() {
        const store = reactive({
            cart: [],
            subtotal: 0,
            shipping: 0,
            total: 0,
            addToCart(product) {
                const productFind = store.cart.find(p => p.id === product.id);
                if (productFind) {
                    productFind.quantity += 1;
                } else {
                    store.cart.push({ ...product, quantity: 1 });
                }
                store.calculateTotals();
            },
            removeFromCart(product) {
                const productIndex = store.cart.findIndex(p => p.id === product.id);
                if (productIndex !== -1) {
                    store.cart.splice(productIndex, 1);
                }
                store.calculateTotals();
            },
            incrementQuantity(product) {
                const productFind = store.cart.find(p => p.id === product.id);
                if (productFind) {
                    productFind.quantity += 1;
                }
                store.calculateTotals();
            },
            decrementQuantity(product) {
                const productFind = store.cart.find(p => p.id === product.id);
                if (productFind && productFind.quantity > 1) {
                    productFind.quantity -= 1;
                }
                store.calculateTotals();
            },
            changePrice(product, newPrice) {
                const productFind = store.cart.find(p => p.id === product.id);
                if (productFind) {
                    productFind.list_price = newPrice;
                }
                store.calculateTotals();
            },
            setShipping(price) {
                store.shipping = price;
                store.calculateTotals();
            },
            calculateTotals() {
                store.subtotal = store.cart.reduce((sum, item) => sum + (item.list_price * item.quantity), 0);
                store.total = store.subtotal + store.shipping;
            },
            clearCart() {
                store.cart = [];
                store.subtotal = 0;
                store.shipping = 0;
                store.total = 0;
            },
        });
        return store;
    },
});
