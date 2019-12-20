import backend from "./backend.js";


var urlParam = new URLSearchParams(location.search);
var id = urlParam.get("id")

var Chef = {
    init: function () {
        this.preserveProduct().then(
            () => {
                this.productImagePreview();
                this.menuToggle();
                this.misc();
            }
        );
    },

    preserveProduct: async function () {
        try {
            let response = await backend.getProduct("products",["productCode"], [id]);
            let item = response[0];
            let htmlList = "";
            for (let index = 0; index < item.images.length; index++) {
                if (index === 0) {
                    htmlList += '<li class="preview"><img src="' + item.images[index] + '" alt=""></li>';
                    htmlList += '<li><a href="javascript:void(0)"><img src="' + item.images[index] + '" alt=""></a></li>';
                    continue;
                }
                htmlList += '<li><a href="javascript:void(0)"><img src="' + item.images[index] + '" alt=""></a></li>'
            }

            document.getElementById("imageList").innerHTML = htmlList;
            document.getElementById("product-name").innerText = item.name;
            document.getElementById("product-price").innerHTML = '<span>$    </span><span>' + item.price + '</span>'
            document.getElementById("product-description").innerHTML = '<p>' + item.description + '</p>'
        } catch (e) {
            if (e.name === 'TypeError') {
                document.getElementById("imageList").innerHTML = '<li class="preview"><img src="images/product-description/download.jpg" alt=""></li>' +
                    '<li><a href="javascript:void(0)"><img src="images/product-description/download.jpg" alt=""></a></li>' +
                    '<li><a href="javascript:void(0)"><img src="images/product-description/download-1.jpg" alt=""></a></li>' +
                    '<li><a href="javascript:void(0)"><img src="images/product-description/download-2.jpg" alt=""></a></li>' +
                    '<li><a href="javascript:void(0)"><img src="images/product-description/download-3.jpg" alt=""></a></li>' +
                    '<li><a href="javascript:void(0)"><img src="images/product-description/download-4.jpg" alt=""></a></li>'
                document.getElementById("product-name").innerText = 'Modern Table';
                document.getElementById("product-price").innerHTML = '<span>$ 1000</span>'
                document.getElementById("product-description").innerHTML = '<p>This string is randomly generated. The standard default text is designed to ramble about nothing. The standard default text is designed to ramble about nothing. This string is randomly  generated.</p>' +
                    '<p>Whoever evaluates your text cannot evaluate the way you write. Default text creates the illusion of real text. Your design looks awesome by the way. If it is not real text, they will focus on the design.</p>'
            } else console.log(e);
        }

    },

    productImagePreview: function () {
        $(document).on('click', '.product-images li', function () {
            if (!$(this).hasClass('preview')) {
                var src = $(this).find('img').attr('src');
                $('.product-images .preview img').attr('src', src);
            }
        });
    },

    menuToggle: function () {
        $(document).on('click', '#menu .trigger', function () {
            // Toggle open and close icons
            $(this).find('img').each(function () {
                if ($(this).hasClass('hidden')) {
                    $(this).removeClass('hidden');
                } else {
                    $(this).addClass('hidden');
                }
            });

            // Toggle menu links
            $(this).siblings('.links').stop(true, true).slideToggle(200);

            // Toggle open class
            $('#menu').toggleClass('open');
        });
    },

    misc: function () {
        // Misc stuff

        for (var i = 1; i <= 3; i++) {
            $('.product').parent().eq(0).clone().appendTo('.product-list');
        }
    }
};

$(function () {
    Chef.init();
});

