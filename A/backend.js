const local_url = "https://furnitureio.herokuapp.com/api/v1/";

// const local_url = "http://127.0.0.1:8000/api/v1/";


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

    async getCart() {
        let items = []
        let instanceCart = JSON.parse(localStorage.getItem('cart'));
        let instanceKey = Object.keys(instanceCart)
        for (var i = 0; i < instanceKey.length; i++) {
            let item = await this.getProduct("products", ['productCode'], [instanceKey[i]])
            items.push({item: item[0], number: instanceCart[instanceKey[i]]})
        }

        return items
    }
}


var backend = new Backend();
export default backend;

export function addtoCart(element) {
    let inCart = false;
    let instanceCart = JSON.parse(localStorage.getItem('cart'));
    let instanceSize = JSON.parse(localStorage.getItem('size'));
    let keys = Object.keys(instanceCart);
    for (let i = 0; i < keys.length; i++) {
        if (this.id === keys[i]) {
            instanceCart[this.id] += 1
            instanceSize++;
            inCart = true;
            break;
        }
    }
    if (!inCart) {
        instanceCart[this.id] = 1
        instanceSize++
    }
    localStorage.setItem('cart', JSON.stringify(instanceCart))
    localStorage.setItem('size', JSON.stringify(instanceSize))
    document.getElementById("totalItems").innerText = localStorage.size.toString()
}


