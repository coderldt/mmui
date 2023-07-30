let ajax = new XMLHttpRequest()

ajax.setRequestHeader('content-type', 'text/plain')
ajax.open('GET', '/api/getList')

ajax.onreadystatechange(() => {
    if (ajax.readyState === 4 && ajax.status === 200) {
        console.log('请求成功', ajax.responseText);
    }
})

ajax.send()