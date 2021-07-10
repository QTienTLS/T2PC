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

function sortByInch() {
    var x = document.getElementById('sortByInch');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

function sortByIntel() {
    var x = document.getElementById('sortByIntel');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

function nVidia() {
    var x = document.getElementById('nVidia');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

function amd() {
    var x = document.getElementById('amd');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

function psu() {
    var x = document.getElementById('psu');
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
    console.log(time);
}
//Định dạng tiền tệ
var currency = document.getElementsByClassName('currFormat');
for (let i = 0; i < currency.length; i++) {
    currency[i].innerHTML = currency[i].innerHTML
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
//hàm thêm sản phẩm vào giỏ hàng
function addToCart(productID) {
    // var btn = event.target;
    // var productID = btn.getAttribute('proid');
    // console.log(productID);
    var formShip = document.forms['shipper'];
    formShip.action = '/product/' + productID + '/addtocart';
    formShip.submit();
}
//hàm xem chi tiết sản phẩm
function goToDetail(productID) {
    var formShip = document.forms['shipper'];
    formShip.method = 'GET';
    formShip.action = '/product/' + productID + '/detail';
    formShip.submit();
}

// Button trái phải của các nhãn hàng
