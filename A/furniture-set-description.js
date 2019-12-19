import Backend from "./backend.js";

var app = window.app || {},
    business_paypal = '';

var backend = new Backend();

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
        var additionalProduct = await backend.getProduct(["furnitureType"], ["Bed"]);
        var productos = [
                {
                    productCode: 1,
                    images: ['images/productlisting/table1.jpg'],
                    name: 'Table1',
                    price: 299.00,
                    desc: 'Libertad 5oz BU 1998 Contains 1 Libertad 5oz BU brilliant uncirculated .999 fine Silver. In capsule The same coin as you see in this picture. We only Ship to the US, and is FREE Shipping Shipping time 5-7 business days via UPS express with tracking and insurance. Payments only via Paypal.',
                    stock: 4
                },
                {
                    productCode: 2,
                    name: 'Table2',
                    images: ['images/productlisting/table2.jpg'],
                    price: 199.00,
                    desc: 'Libertad 5oz BU 1998 Contains 1 Libertad 5oz BU brilliant uncirculated .999 fine Silver. In capsule The same coin as you see in this picture. We only Ship to the US, and is FREE Shipping Shipping time 5-7 business days via UPS express with tracking and insurance. Payments only via Paypal.',
                    stock: 2
                },
                {
                    productCode: 3,
                    name: 'Table3',
                    images: ['images/productlisting/table3.jpg'],
                    price: 99.00,
                    desc: 'Libertad 5oz BU 1998 Contains 1 Libertad 5oz BU brilliant uncirculated .999 fine Silver. In capsule The same coin as you see in this picture. We only Ship to the US, and is FREE Shipping Shipping time 5-7 business days via UPS express with tracking and insurance. Payments only via Paypal.',
                    stock: 1
                },
                // {
                //     id: 4,
                //     name: 'Table4',
                //     image: ['images/pic01.jpg'],
                //     price: 80.00,
                //     desc: 'Libertad 5oz BU 1998 Contains 1 Libertad 5oz BU brilliant uncirculated .999 fine Silver. In capsule The same coin as you see in this picture. We only Ship to the US, and is FREE Shipping Shipping time 5-7 business days via UPS express with tracking and insurance. Payments only via Paypal.',
                //     stock: 0
                // },
                {
                    productCode: 1,
                    images: ['images/productlisting/table4.jpg'],
                    name: 'Table5',
                    price: 10.00,
                    desc: 'Libertad 5oz BU 1998 Contains 1 Libertad 5oz BU brilliant uncirculated .999 fine Silver. In capsule The same coin as you see in this picture. We only Ship to the US, and is FREE Shipping Shipping time 5-7 business days via UPS express with tracking and insurance. Payments only via Paypal.',
                    stock: 8
                }
            ],
            wrapper = $('.productosWrapper'),
            contenido = ''

        productos = productos.concat(additionalProduct);
        for (var i = 0; i < productos.length; i++) {
            let ref = 'product-description.html?id=' + productos[i].productCode;
            if (1) {
                contenido += '<div class="coin-wrapper"><a href=' + ref + '>';
                contenido += '		<img src="' + productos[i].images[0] + '" alt="' + productos[i].name + '">  <div class="middle"><a href=' + ref + '></a></div>'
                contenido += '		<span class="large-12 columns product-details">'
                contenido += '			<h3>' + productos[i].name + ' <span class="price">$ ' + productos[i].price + ' USD</span></h3>'
                // contenido += '			<h3>Stock: <span class="stock">' + productos[i].stock + '</span></h3>'
                contenido += '		</span>'
                // contenido += '		<a class="large-12 columns btn submit ladda-button prod-' + productos[i].id + '" data-style="slide-right" onclick="app.addtoCart(' + productos[i].id + ');">More Info</a>'
                contenido += '		<div class="clearfix"></div>'
                contenido += '</div>'

            }

        }

        wrapper.html(contenido)

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

    app.searchProd = function (cart, id, cant, name, price, img, available) {

        var curProd = _.find(cart.items, {'id': id})

        if (undefined != curProd && curProd != null) {

            if (curProd.cant < available) {
                curProd.cant = parseInt(curProd.cant + cant)
            } else {
                alert('No stock available')
            }

        } else {

            var prod = {
                id: id,
                cant: cant,
                name: name,
                price: price,
                img: img,
                available: available
            }
            cart.items.push(prod)

        }
        localStorage.setItem('cart', JSON.stringify(cart))
        app.init()
        app.getProducts()
        app.updatePayForm()
    }

    app.getProducts = function () {
        var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items: []},
            msg = '',
            wrapper = $('.cart'),
            total = 0
        wrapper.html('')

        if (undefined == cart || null == cart || cart == '' || cart.items.length == 0) {
            wrapper.html('<li>Cart is empty &nbsp; &nbsp;</li>');
            $('.cart').css('left', '-400%')
        } else {
            var items = '';
            _.forEach(cart.items, function (n, key) {

                total = total + (n.cant * n.price)
                items += '<li>'
                items += '<img src="' + n.img + '" />'
                items += '<h3 class="title">' + n.name + '<br><span class="price">' + n.cant + ' x $ ' + n.price + ' USD</span> </h3>'
                items += '</li>'
            });


            items += '<li id="total">Total : $ ' + total + ' <div id="submitForm"></div></li>'
            wrapper.html(items)
            $('.cart').css('left', '-500%')
        }
    }

    app.updateItem = function (id, available) {

        var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items: []},
            curProd = _.find(cart.items, {'id': id})

        curProd.cant = curProd.cant - 1;

        if (curProd.cant > 0) {
            localStorage.setItem('cart', JSON.stringify(cart))
            app.init()
            app.getProducts()
            app.updatePayForm()
        } else {
            app.deleteProd(id, true)
        }
    }

    app.delete = function (id) {
        var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items: []};
        var curProd = _.find(cart.items, {'id': id})
        _.remove(cart.items, curProd);
        localStorage.setItem('cart', JSON.stringify(cart))
        app.init()
        app.getProducts()
        app.updatePayForm()
    }

    app.deleteProd = function (id, remove) {
        if (undefined != id && id > 0) {

            if (remove == true) {
                app.delete(id)
            } else {
                var conf = confirm('Are you sure you want to delete?')
                if (conf) {
                    app.delete(id)
                }
            }

        }
    }

    app.updatePayForm = function () {
        var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items: []};
        var statics = '<form action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd" value="_cart"><input type="hidden" name="upload" value="1"><input type="hidden" name="currency_code" value="USD" /><input type="hidden" name="business" value="' + business_paypal + '">',
            dinamic = '',
            wrapper = $('#submitForm')

        wrapper.html('')

        if (undefined != cart && null != cart && cart != '') {
            var i = 1;
            _.forEach(cart.items, function (prod, key) {
                dinamic += '<input type="hidden" name="item_name_' + i + '" value="' + prod.name + '">'
                dinamic += '<input type="hidden" name="amount_' + i + '" value="' + prod.price + '">'
                dinamic += '<input type="hidden" name="item_number_' + i + '" value="' + prod.id + '" />'
                dinamic += '<input type="hidden" name="quantity_' + i + '" value="' + prod.cant + '" />'
                i++;
            })

            statics += dinamic + '<button type="submit" class="pay">Check out &nbsp;<i class="ion-chevron-right"></i></button></form>'

            wrapper.html(statics)
        }
    }

    $(document).ready(function () {
        app.init()
        app.getProducts()
        app.updatePayForm()
        app.createProducts()
    })

})(jQuery)

