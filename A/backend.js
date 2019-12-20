const local_url = "https://furnitureio.herokuapp.com/api/v1/";
// const local_url = "http://127.0.0.1:8000/api/v1/";

var cart = {};
var size = Object.keys(cart).length;

class Backend {
    async getProduct(type, key, value) {
        let param = "?";
        for (var i = 0; i < key.length;) {
            param += key[i] + "=" + value[i];
            i++;
            if (i !== key.length) {
                param += "&"
            }
        }
        let temp_url = local_url + type + "/" + param;
        let response = await this.getData(temp_url);
        return response
    }


    getData(url) {
        var response = fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }).then(
            async response => await response.json()
        ).then(json => {
            return json;
        })


        return response
    }

    addtoCart(element) {
        console.log(size)
        let inCart = false;
        let keys = Object.keys(cart);
        for (let i = 0; i < keys.length; i++) {
            if (this.id === keys[i]) {
                cart[this.id] += 1
                size++
                inCart = true;
                break;
            }
        }
        if (!inCart) {
            cart[this.id] = 1
            size++
        }

        document.getElementById("totalItems").innerText = size.toString()
        console.log(cart)
    }
}


var backend = new Backend();
export default backend;