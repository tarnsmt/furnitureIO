import Backend from "./backend.js";

var backend = new Backend()

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

    preserveProduct: async function() {
        let response = await backend.getProduct(["productCode"], [id]);
        let item =  response[0];
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
        document.getElementById("product-price").innerHTML = '<span>$    </span><span>'+ item.price +'</span>'
        document.getElementById("product-description").innerHTML = '<p>' + item.description + '</p>'
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

