//modal cart
//Modal cart
var modalCart = document.getElementById('modalCart');
modalCart.addEventListener('show.bs.modal', function (event) {
    var totalPrice = 0;
    var mainList = document.getElementById('main-list');
    var root = document.getElementById('pro-node');
    mainList.innerHTML = '';
    var tp = document.getElementsByClassName('gtx__2')[0];
    var product = document.getElementById('product-list').innerHTML.split(',');
    var imglist = document.getElementById('image-list').innerHTML.split(',');
    var amount = document
        .getElementById('amount-list')
        .innerHTML.split(',')
        .map((x) => +x);
    var price = document
        .getElementById('price-list')
        .innerHTML.split(',')
        .map((x) => +x);
    var numPro = parseInt(document.getElementById('numPro-cart').innerHTML);
    var numRow = parseInt(document.getElementById('numRow-cart').innerHTML);
    for (let i = 0; i < numRow; i++) {
        var cloneNode = root.cloneNode(true);
        cloneNode.childNodes[1].childNodes[0].src = imglist[i];
        cloneNode.style.display = 'flex';
        cloneNode.classList.remove('root-node');
        totalPrice += amount[i] * price[i];
        var namePrice = cloneNode.childNodes[3];
        namePrice.childNodes[1].innerHTML = product[i];
        namePrice.childNodes[3].innerHTML = (
            price[i] * amount[i] +
            ' đ'
        ).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        //thanh số lượng
        var amountGr = cloneNode.childNodes[5];
        amountGr.childNodes[1].addEventListener('click', function () {
            var x = this.parentElement.childNodes[3];
            x.value--;
            changeAmount(x, i);
        });
        amountGr.childNodes[5].onclick = function () {
            var x = this.parentElement.childNodes[3];
            x.value++;
            changeAmount(x, i);
        };
        amountGr.childNodes[3].onchange = function () {
            changeAmount(this, i);
        };
        amountGr.childNodes[3].addEventListener('keyup', function (event) {
            if (event.keyCode == 13) {
                this.blur();
            }
        });
        amountGr.childNodes[3].value = amount[i];
        //nút xóa sản phẩm
        var btnDel = cloneNode.childNodes[7];
        btnDel.setAttribute('namePro', product[i]);
        btnDel.onclick = function () {
            mainList.childNodes[i].style.display = 'none';
            var index = product.indexOf(this.getAttribute('namePro'));
            numPro -= amount[index];
            product.splice(index, 1);
            amount.splice(index, 1);
            imglist.splice(index, 1);
            price.splice(index, 1);
            numRow--;
            refeshModal();
        };
        mainList.appendChild(cloneNode);
    }
    function changeAmount(e, oi) {
        newAmount = parseInt(e.value);
        //lấy tên sp đang thay đổi
        var pro =
            e.parentElement.parentElement.childNodes[7].getAttribute('namePro');
        //xóa sản phẩm nếu amount đạt tới 0
        var index = product.indexOf(pro);
        if (newAmount <= 0) {
            //ẩn hình ảnh hiển thị
            mainList.childNodes[oi].style.display = 'none';
            numPro -= amount[index];
            product.splice(index, 1);
            amount.splice(index, 1);
            imglist.splice(index, 1);
            price.splice(index, 1);
            numRow--;
        } else {
            numPro += newAmount - amount[index];
            amount[index] = newAmount;
            e.parentElement.parentElement.childNodes[3].childNodes[3].innerHTML =
                (price[index] * amount[index] + ' đ').replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    '.',
                );
        }
        refeshModal();
        e.value = newAmount;
    }
    function refeshModal() {
        var newP = 0;
        for (let i = 0; i < numRow; i++) {
            newP += amount[i] * price[i];
        }
        tp.innerHTML = (newP + ' đ').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        document.getElementsByClassName('gtx__1')[0].innerHTML = numPro;
    }

    //tính tổng chi phí
    tp.innerHTML = (totalPrice + ' đ').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    document.getElementsByClassName('gtx__1')[0].innerHTML = numPro;
});
modalCart.addEventListener('hidden.bs.modal', function (event) {
    //refesh lại main-list
    var mainList = document.getElementById('main-list');
    var root = document.getElementsByClassName('root-node')[0];
    mainList.innerHTML = '';
    var cloneRoot =  root.cloneNode(true);
     mainList.appendChild( cloneRoot );
    
});
