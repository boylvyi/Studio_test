function myAxios(config) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        if(config.params) {
            const paramsObj = new URLSearchParams(config.params)
            const queryString = paramsObj.toString()
            config.url += `?${queryString}`
            console.log(config.url);
        }
        xhr.open(config.method || 'GET', config.url)
        xhr.addEventListener('loadend', () => {
            if (xhr.status >= 200 && xhr.status <300) {
                resolve(JSON.parse(xhr.response))
            } else {
                reject(new Error(xhr.response))
            }
        })
        if (config.data) {
            const jsonStr = JSON.stringify(config.data)
            xhr.setRequestHeader('Content-Tpye', 'application/json')
            xhr.send(jsonStr)
        }   else{
            xhr.send()
        }
    })
}

