//modal cart
//Modal cart
var modalCart = document.getElementById('modalCart');
modalCart.addEventListener('show.bs.modal', function (event) {
    var totalPrice = 0;
    var product = document.getElementById('product-list').innerHTML.split(',');
    var imglist = document.getElementById('image-list').innerHTML.split(',');
    var amount = document.getElementById('amount-list').innerHTML.split(',').map(x => +x);
    var price = document.getElementById('price-list').innerHTML.split(',').map(x => +x);
    var numPro = parseInt(document.getElementById('numPro-cart').innerHTML);
    var numRow = parseInt(document.getElementById('numRow-cart').innerHTML);
    for(let i = 0; i< numRow;i++){
        var cloneNode = document.getElementById('pro-node').cloneNode(true);
        cloneNode.childNodes[1].src = imglist[i];
        cloneNode.style.display = 'flex';
        cloneNode.classList.remove('root-node');
        totalPrice += amount[i]*price[i];
        var namePrice = cloneNode.childNodes[3];
        namePrice.childNodes[1].innerHTML = product[i];
        namePrice.childNodes[3].innerHTML = (price[i]*amount[i] + ' đ').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
       document.getElementById('main-list').appendChild(cloneNode);
       //tính tổng chi phí
       document.getElementsByClassName('gtx__2')[0].innerHTML =( totalPrice + ' đ').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

});
modalCart.addEventListener('hidden.bs.modal',function(event){
    var mainList = document.getElementById('main-list');
    var root = document.getElementsByClassName('root-node')[0];
   mainList.innerHTML ='';
   mainList.appendChild(root);
});