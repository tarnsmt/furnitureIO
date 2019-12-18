// const url = "https://furnitureio.herokuapp.com/api/v1/products/";
const local_url = "http://127.0.0.1:8000/api/v1/products/";

export default class Backend {
    async getProduct(key,value) {
        let param = "?"
        for(var i = 0; i < key.length;){
            param += key[i] + "=" + value[i];
            i++;
            if(i !== key.length){
                param += "&"
            }
        }
        let temp_url = local_url + param;
        let response = await this.getData(temp_url);
        return response
    }

    getData(url){
        var response = fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }).then(
            async response => await response.json()
        ).then(json => {return json;})



        return response
    }
}