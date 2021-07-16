//số lượng sản phẩm trong cart
var nP = document.getElementsByClassName('numProduct')[0];

if (!sessionStorage.Cart || !sessionStorage.numPro) nP.innerHTML = 0;
else nP.innerHTML = sessionStorage.numPro;
//list sản phẩm trong cart
var mainList = document.getElementById('main-list');
//node root để nhân bản
var root = document.getElementById('pro-node');
//hiển thị số sản phẩm trong cart chi tiết
var detailNumPro = document.getElementsByClassName('gtx__1')[0];
//hiển thị tổng giá trị đơn hàng
var totalPrice = document.getElementsByClassName('gtx__2')[0];
//hàm thêm sản phẩm vào giỏ hàng
function addToCart(productID, proName, price, stored, btn, n) {
    // var btn = document.getElementById(id);
    if (stored < n) {
        alert('Bạn đã nhập quá số lượng hàng cho phép ! Vui lòng kiểm tra lại');
        return;
    }
    img = btn.getAttribute('data-img');

    n = parseInt(n);
    if (!sessionStorage.Cart) {
        var cartObj = {
            id: [productID],
            proName: [proName],
            amount: [n],
            price: [price],
            stored: [stored],
            img: [img],
        };
        sessionStorage.totalPrice = price * n;
        sessionStorage.numPro = n;
        sessionStorage.setItem('Cart', JSON.stringify(cartObj));
    } else {
        var cartObj = JSON.parse(sessionStorage.getItem('Cart'));
        var isPush = true;
        for (let i = 0; i < cartObj.proName.length; i++) {
            if (proName == cartObj.proName[i]) {
                if (cartObj.stored[i] < n + cartObj.amount[i]) {
                    alert(
                        'Bạn đã nhập quá số lượng hàng cho phép ! Vui lòng kiểm tra lại',
                    );
                    return;
                }
                cartObj.amount[i] += n;
                isPush = false;
                break;
            }
        }
        if (isPush) {
            cartObj.proName.push(proName);
            cartObj.id.push(productID);
            cartObj.amount.push(n);
            cartObj.price.push(price);
            cartObj.stored.push(stored);
            cartObj.img.push(img);
        }

        sessionStorage.numPro = parseInt(sessionStorage.numPro) + n;
        sessionStorage.totalPrice =
            parseInt(sessionStorage.totalPrice) + price * n;
    }

    sessionStorage.setItem('Cart', JSON.stringify(cartObj));
    nP.innerHTML = sessionStorage.numPro;
}
// Modal cart
var modalCart = document.getElementById('modalCart');
// sự kiện khi mở chi tiết cart
modalCart.addEventListener('show.bs.modal', function (event) {
    if (sessionStorage.numPro == undefined) {
        sessionStorage.numPro = 0;
        sessionStorage.totalPrice = 0;
    }
    refeshModal();
    mainList.innerHTML = '';
    if (sessionStorage.Cart || Number(sessionStorage.numPro)) {
        //lấy session về
        var cart = JSON.parse(sessionStorage.getItem('Cart'));
        for (let i = 0; i < cart.proName.length; i++) {
            var cloneNode = root.cloneNode(true);
            cloneNode.childNodes[1].childNodes[0].src = cart.img[i];
            cloneNode.style.display = 'flex';
            cloneNode.classList.remove('root-node');
            var namePrice = cloneNode.childNodes[3];
            namePrice.childNodes[1].innerHTML = cart.proName[i];
            namePrice.childNodes[3].innerHTML = (
                cart.price[i] * cart.amount[i] +
                ' đ'
            ).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            namePrice.childNodes[5].innerHTML =
                'Còn ' + cart.stored[i] + ' sản phẩm';
            //thanh số lượng
            var amountGr = cloneNode.childNodes[5];
            amountGr.childNodes[1].addEventListener('click', function () {
                var x = this.parentElement.childNodes[3];
                x.value--;
                changeAmount(x, i);
            });
            amountGr.childNodes[5].onclick = function () {
                var x = this.parentElement.childNodes[3];
                if (x.value == cart.stored[i]) {
                    alert(
                        'Số lượng nhập vượt quá lượng hàng trong kho ! Vui lòng kiểm tra lại ! ',
                    );
                } else {
                    x.value++;
                    changeAmount(x, i);
                }
            };
            amountGr.childNodes[3].onchange = function () {
                if (this.value > cart.stored[i]) {
                    this.value = cart.stored[i];
                    alert(
                        'Số lượng nhập vượt quá lượng hàng trong kho ! Vui lòng kiểm tra lại ! ',
                    );
                } else changeAmount(this, i);
            };
            amountGr.childNodes[3].addEventListener('keyup', function (event) {
                if (event.keyCode == 13) {
                    this.blur();
                }
            });
            amountGr.childNodes[3].value = cart.amount[i];
            //nút xóa sản phẩm
            var btnDel = cloneNode.childNodes[7];
            btnDel.setAttribute('namePro', cart.proName[i]);
            btnDel.onclick = function () {
                mainList.childNodes[i].style.display = 'none';
                var index = cart.proName.indexOf(this.getAttribute('namePro'));
                sessionStorage.numPro =
                    parseInt(sessionStorage.numPro) - cart.amount[index];
                sessionStorage.totalPrice =
                    parseInt(sessionStorage.totalPrice) -
                    cart.amount[index] * cart.price[index];
                cart.proName.splice(index, 1);
                cart.id.splice(index, 1);
                cart.amount.splice(index, 1);
                cart.img.splice(index, 1);
                cart.price.splice(index, 1);
                sessionStorage.setItem('Cart', JSON.stringify(cart));
                cart = JSON.parse(sessionStorage.getItem('Cart'));
                refeshModal();
            };
            mainList.appendChild(cloneNode);
        }
        function changeAmount(e, oi) {
            newAmount = parseInt(e.value);
            //nếu nhập quá số lượng
            //lấy tên sp đang thay đổi
            var pro =
                e.parentElement.parentElement.childNodes[7].getAttribute(
                    'namePro',
                );
            //xóa sản phẩm nếu amount đạt tới 0
            var index = cart.proName.indexOf(pro);
            if (newAmount <= 0) {
                //ẩn hình ảnh hiển thị
                mainList.childNodes[oi].style.display = 'none';
                sessionStorage.numPro =
                    parseInt(sessionStorage.numPro) - cart.amount[index];
                sessionStorage.totalPrice =
                    parseInt(sessionStorage.totalPrice) -
                    cart.amount[index] * cart.price[index];
                cart.proName.splice(index, 1);
                cart.id.splice(index, 1);
                cart.amount.splice(index, 1);
                cart.img.splice(index, 1);
                cart.price.splice(index, 1);
                sessionStorage.setItem('Cart', JSON.stringify(cart));
                cart = JSON.parse(sessionStorage.getItem('Cart'));
                refeshModal();
            } else {
                sessionStorage.numPro =
                    parseInt(sessionStorage.numPro) +
                    newAmount -
                    cart.amount[index];
                sessionStorage.totalPrice =
                    parseInt(sessionStorage.totalPrice) +
                    (newAmount - cart.amount[index]) * cart.price[index];
                cart.amount[index] = newAmount;
                e.parentElement.parentElement.childNodes[3].childNodes[3].innerHTML =
                    (cart.price[index] * cart.amount[index] + ' đ').replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        '.',
                    );
            }
            sessionStorage.setItem('Cart', JSON.stringify(cart));
            cart = JSON.parse(sessionStorage.getItem('Cart'));
            refeshModal();
            e.value = newAmount;
        }
    }
});
function refeshModal() {
    var warningCartEmpty = document.getElementById('nothing-in-cart-warning');
    if (!sessionStorage.Cart || sessionStorage.numPro == '0')
        warningCartEmpty.style.display = 'block';
    else warningCartEmpty.style.display = 'none';
    detailNumPro.innerHTML = sessionStorage.numPro;
    totalPrice.innerHTML = (sessionStorage.totalPrice + ' đ').replace(
        /\B(?=(\d{3})+(?!\d))/g,
        '.',
    );
    nP.innerHTML = sessionStorage.numPro;
}
modalCart.addEventListener('hidden.bs.modal', function (event) {
    mainList.innerHTML = '';
});
function remindLogin() {
    var x = confirm('Vui lòng đăng nhập để mua hàng ! ');
    if (x) window.location.href = '/account/login';
}
function remindEmptyCart() {
    alert('Giỏ hàng của bạn hiện không có gì cả ! Hãy tiếp tục mua hàng !');
}
function checkout() {
    var numPro = parseInt(sessionStorage.numPro);
    if (!numPro)
        alert('Giỏ hàng của bạn hiện không có gì cả ! Hãy tiếp tục mua hàng !');
    else {
        document.forms['new-cart'].action = '/account/checkout';
        var cart = JSON.parse(sessionStorage.getItem('Cart'));
        $('#id-checkout').val(cart.id);
        $('#amount-checkout').val(cart.amount);
        $('#num-checkout').val(numPro);
        $('#totalPrice-checkout').val(parseInt(sessionStorage.totalPrice));
        document.forms['new-cart'].submit();
        //window.location.href = '/account/checkout';
    }
}
function delCart() {
    sessionStorage.removeItem('Cart');
    sessionStorage.numPro = 0;
    sessionStorage.totalPrice = 0;
    mainList.innerHTML = '';
    refeshModal();
}
function detailToCart(id, name, price, stored, btn) {
    //alert('ad');
    var n = document.getElementById('amount-d-cart').value;
    addToCart(id, name, price, stored, btn, n);
}
