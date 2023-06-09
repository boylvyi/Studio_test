window.onload = function () {
    GetCityHtml(1);
}
var Myjson = [];
function GetCityHtml(page) {
    myAxios({
        url: 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json'
    }).then(result => {
        const CityObj = result.slice(1, 101);
        for (let i = 0; i < CityObj.length; i++) {
            Myjson.push(result[i]);
        }
        City_messageHTML(Myjson, page);
    }).catch(error => {
        console.log(error);
    })
    // 模糊匹配，在输入文字时执行
    document.querySelector('.search_city').addEventListener('input', (e) => {
        Myjson = [];
        myAxios({
            url: 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json'
        }).then(result => {
            const CityObj = result.slice(0, 101);
            let regexp = new RegExp(e.target.value, "i")
            for (let i = 0; i < CityObj.length; i++) {
                if (regexp.test(CityObj[i].city) || regexp.test(CityObj[i].state)) {
                    console.log(CityObj[i].city, CityObj[i].state, CityObj[i]);
                    Myjson.push(CityObj[i]);
                }
            }
            City_messageHTML(Myjson, page);
        }).catch(error => {
            console.log(error);
        })
    })
}
function City_messageHTML(data, page) {
    let city_message_box = document.querySelector('.city_message_box');
    let pagination = document.querySelector('.pagination');
    city_message_box.innerHTML = "";
    pagination.innerHTML = "";
    /*分页*/
    var pagenum = (page - 1) * 4;
    var PageContent = Math.ceil(data.length / 4); //总页数
    for (var j = pagenum; j < (pagenum + 4); j++) {
        if (j < data.length) {//判断是否超出范围
            const ciitydata = `
            <div class="city_title d-flex justify-content-center">
                <h5><sapn><img src="./images/city.png" alt=""></span>${data[j].city}</h5>
            </div>
            <div class="d-flex justify-content-center">
                <div class="col d-flex justify-content-center">
                    <div class="city_message">
                        <p>2000-2013城市增长长度：${data[j].growth_from_2000_to_2013}</p>
                        <p>所处经度：${data[j].latitude}</p>
                        <p>所处纬度：${data[j].longitude}</p>
                        <p>人口数：${data[j].population}</p>
                        <p>城市排名：${data[j].rank}</p>
                        <p>所属州/省：${data[j].state}</p>
                    </div>
                </div>
            </div>
            `
            city_message_box.innerHTML += ciitydata;
        }
    }
    //判断是否出现分页
    if (PageContent > 1) {
        pagination.innerHTML +=
            `
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                  <li class="page-item" id='firstpage'><a class="page-link" href="javascript:;">首页</a></li>
                  <li class="page-item" id='pageup'><a class="page-link" href="javascript:;">上一页</a></li>
                  <li class="page-item" id='nowpage'><a class="page-link" href="javascript:;">${page}</a></li>
                  <li class="page-item" id='pagedown'><a class="page-link" href="javascript:;">下一页</a></li>
                  <li class="page-item" id='lastpage'><a class="page-link" href="javascript:;">尾页</a></li>
                </ul>
            </nav>
            `
        var pageup = document.querySelector("#pageup");
        var pagedown = document.querySelector("#pagedown");
        var firstpage = document.querySelector("#firstpage");
        var lastpage = document.querySelector("#lastpage");
        pageup.onclick = function () {
            var PageUp = (page - 1) <= 1 ? 1 : page - 1; //上一页
            City_messageHTML(Myjson, PageUp);
        }
        pagedown.onclick = function () {
            var PageDown = (page + 1) > PageContent ? PageContent : page + 1; //下一页
            City_messageHTML(Myjson, PageDown);
        }
        firstpage.onclick = function () {
            var Fpage = 1; //上一页
            City_messageHTML(Myjson, Fpage);
        }
        lastpage.onclick = function () {
            var Lpage = PageContent; //下一页
            City_messageHTML(Myjson, Lpage);
        }
    }
}
// 搜索菜单
// 搜索菜单显示与隐藏
let search_list = document.querySelector('.search_list');
let search_city = document.querySelector('.search_city');
// 绑定input事件，获取关键字
document.querySelector('.search_city').addEventListener('input', (e) => {
    // 获取城市列表数据
    myAxios({
        url: 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json',
        city: e.target.value
    }).then(result => {
        const CityObj = result.slice(1, 101);
        const liStr = CityObj.map(item => {
            // 如果json数据中的城市中不包含输入的字符串，就返回-1，所以不返回-1就是在json数据中存在
            if (item.city.indexOf(e.target.value) != -1) {
                return `<li><a class="search_item" data-city="${item.city}">${item.city},${item.state}</a></li>`
            }
        }).join('')
        document.querySelector('.search_list').innerHTML = liStr;
    })
})
// 搜索列表的显示与隐藏
document.querySelector('.search_city').addEventListener('click', e => {
    search_list.style.display = 'block';
    $(".search_list").mouseleave(function () {
        search_list.style.display = 'none';
    });
})
// 点击搜索列表后返回对应的的值渲染在页面上
document.querySelector('.search_list').addEventListener('click', e => {
    if (e.target.classList.contains('search_item')) {
        // 只有点击了li才执行这段代码
        const cityName = e.target.dataset.city;
        Change_city(cityName);
    }
    search_list.style.display = 'none';
})
function Change_city(cityName) {
    myAxios({
        url: 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json',
        city: cityName
    }).then(result => {
        const CityObj = result.slice(0, 101);
        for (let i = 0; i < CityObj.length; i++) {
            if (CityObj[i].city == cityName) {
                Myjson = [];
                Myjson.push(result[i]);
                page = Myjson.length;
                City_messageHTML(Myjson, page);
            }
        }
    }).catch(error => {
        console.log(error);
    })
}

