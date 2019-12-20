import backend from "./backend.js";

var app = window.app || {},
    business_paypal = '';



(function ($) {
    'use strict';


    app.init = function () {

        var total = 0,
            items = 0

        var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items: []};

        if (undefined != cart.items && cart.items != null && cart.items != '' && cart.items.length > 0) {
            _.forEach(cart.items, function (n, key) {
                items = (items + n.cant)
                total = total + (n.cant * n.price)
            });

        }

        $('#totalItems').text(items)
        $('.totalAmount').text('$ ' + total + ' USD')

    }

    app.createProducts = async function () {
        var productos = await backend.getProduct('products', ["furnitureType"], ["Bed"]),
            wrapper = $('.productosWrapper'),
            contenido = ''

        var codeList = []
        for (var i = 0; i < productos.length; i++) {
            let code = productos[i].productCode
            let ref = 'product-description.html?id=' + code;
            contenido += '<div class="coin-wrapper"><a href=' + ref + '>';
            contenido += '		<img src="' + productos[i].images[0] + '" alt="' + productos[i].name + '">  <div class="middle"><a href=' + ref + '><span class="label-product">More Info &#8594;</span></a></div>'
            contenido += '		<span class="large-12 columns product-details">'
            contenido += '			<h3>' + productos[i].name + ' <span class="price">$ ' + productos[i].price + ' USD</span></h3>'
            contenido += '		</span>'
            contenido += '		<a id="' + code + '"class="large-12 columns btn submit ladda-button prod-' + code + '" data-style="slide-right">Add to cart</a>'
            contenido += '		<div class="clearfix"></div>'
            contenido += '</div>'
            wrapper.html(contenido)

            codeList = codeList.concat([code]);
        }

        for (var i =0;i < codeList.length;i++) {
            document.getElementById(codeList[i]).onclick = backend.addtoCart
        }


        localStorage.setItem('productos', JSON.stringify(productos))
    };

    app.addtoCart = function (id) {
        var l = Ladda.create(document.querySelector('.prod-' + id));

        l.start();
        var productos = JSON.parse(localStorage.getItem('productos')),
            producto = _.find(productos, {'id': id}),
            cant = 1
        if (cant <= producto.stock) {
            if (undefined != producto) {
                if (cant > 0) {
                    setTimeout(function () {
                        var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items: []};
                        app.searchProd(cart, producto.id, parseInt(cant), producto.name, producto.price, producto.img, producto.stock)
                        l.stop();
                    }, 2000)
                } else {
                    alert('Solo se permiten cantidades mayores a cero')
                }
            } else {
                alert('Oops! algo malo ocurrió, inténtalo de nuevo más tarde')
            }
        } else {
            alert('No stock available')
        }
    }

    $(document).ready(function () {
        app.init()
        app.createProducts()
    })

})(jQuery)

