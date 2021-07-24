function manufacturer() {
    var x = document.getElementById('main-manufacturer');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

function sortByMoney() {
    var x = document.getElementById('sortByMoney');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}
//Định dạng ngày giờ
var timeString = document.getElementsByClassName('timeFormat');
var time;
for (var i = 0; i < timeString.length; i++) {
    time = new Date(timeString[i].innerHTML);
    let day = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    time = day + '-' + month + '-' + year;
    timeString[i].innerHTML = time;
    //console.log(time);
}
var timeString2 = document.getElementsByClassName('timeFormat2');
for (var i = 0; i < timeString2.length; i++) {
    time = new Date(timeString2[i].innerHTML);
    let day = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    let hour = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    time = hour + ':' + m + ':' + s + ' ngày ' + day + '-' + month + '-' + year;
    timeString2[i].innerHTML = time;
    //console.log(time);
}
//Định dạng tiền tệ
var currency = document.getElementsByClassName('currFormat');
for (let i = 0; i < currency.length; i++) {
    currency[i].innerHTML = currency[i].innerHTML
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

//hàm xem chi tiết sản phẩm
function goToDetail(productID) {
    var formShip = document.forms['shipper'];
    formShip.method = 'GET';
    formShip.action = '/product/' + productID + '/detail';
    formShip.submit();
}
