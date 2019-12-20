import backend from "./backend.js";

/* Set rates + misc */
var taxRate = 0.05;
var shippingRate = 15.00;
var fadeTime = 300;


/* Recalculate cart */
function recalculateCart() {
    var subtotal = 0;
    /* Sum up row totals */
    $('.product').each(function () {
        let value = $(this).children('.product-line-price').text()
        if (!isNaN(parseFloat(value))) {
            subtotal += parseFloat(value);
        }
    });

    /* Calculate totals */
    var tax = subtotal * taxRate;
    var shipping = (subtotal > 0 ? shippingRate : 0);
    var total = subtotal + tax + shipping;


    /* Update totals display */
    $('.totals-value').fadeOut(fadeTime, function () {
        $('#cart-subtotal').html(subtotal.toFixed(2));
        $('#cart-tax').html(tax.toFixed(2));
        $('#cart-shipping').html(shipping.toFixed(2));
        $('#cart-total').html(total.toFixed(2));
        if (total == 0) {
            $('.checkout').fadeOut(fadeTime);
        } else {
            $('.checkout').fadeIn(fadeTime);
        }
        $('.totals-value').fadeIn(fadeTime);
    });


}


/* Update quantity */
function updateQuantity(quantityInput) {
    /* Calculate line price */
    var productRow = $(quantityInput).parent().parent();
    var price = parseFloat(productRow.children('.product-price').text());
    var quantity = $(quantityInput).val();
    var linePrice = price * quantity;

    /* Update line price display and recalc cart totals */
    productRow.children('.product-line-price').each(function () {
        $(this).fadeOut(fadeTime, function () {
            $(this).text(linePrice.toFixed(2));
            recalculateCart();
            $(this).fadeIn(fadeTime);
        });
    });


}


/* Remove item from cart */
function removeItem(removeButton) {
    /* Remove row from DOM and recalc cart total */
    var productRow = $(removeButton).parent().parent();
    productRow.slideUp(fadeTime, function () {
        productRow.remove();
        recalculateCart();
    });
}


function checkOut(){
    alert("\tCheck Out Complete!!!\nThank for using Our Service\nWe will contact back in 48 hours")
}


$(document).ready(async function () {
    let cart = await backend.getCart();
    let html = "";
    let lineprice = ['12.49','45.99']
    for (let i = 0; i < cart.length; i++) {
        let product = cart[i].item
        let number = cart[i].number
        html += ' <div class="product">\n' +
            '            <div class="product-image">\n' +
            '                <img src="' + product.images[0] + '">\n' +
            '            </div>\n' +
            '            <div class="product-details">\n' +
            '                <div class="product-title">' + product.name + '</div>\n' +
            '                <p class="product-description">' + product.description + '</p>\n' +
            '            </div>\n' +
            '            <div class="product-price">' + product.price + '</div>\n' +
            '            <div class="product-quantity">\n' +
            '                <input type="number" value="' + 5 + '" min="1">\n' +
            '            </div>\n' +
            '            <div class="product-removal">\n' +
            '                <button class="remove-product">\n' +
            '                    Remove\n' +
            '                </button>\n' +
            '            </div>\n' +
            '            <div class="product-line-price"></div>\n' +
            '        </div>'
        lineprice.push(parseFloat(product.price) * number)
    }

    document.getElementById("product-container").innerHTML = html;
    $('.product-quantity input').change(function () {
        updateQuantity(this);
    });
    $('.product-removal button').click(function () {
        removeItem(this);
    });

    let index = 0;
    $('.product').each(function () {
        console.log(lineprice[index]);
        $(this).children('.product-line-price').html(lineprice[index])
        index++;
    });

    $('.checkout').click(checkOut)
    recalculateCart()
})