//sự kiện khi modal thêm product xuất hiện
var modalAddPro = document.getElementById('modalAddProduct');
modalAddPro.addEventListener('show.bs.modal', function (event) {

    var btnsubmit = document.getElementById('btnSubmit');
    var formAdd = document.forms['form-add-product'];
    btnsubmit.onclick = function () {
        formAdd.submit();
    }
    //tự chọn value cho loại sp và hãng đang chọn
    var data = document.getElementById('pre-choose-type');
    var preType = data.getAttribute('data-type');
    var preBrand = data.getAttribute('data-brand');
    chooseInput(document.getElementById('proType').value);
    if(preType){
    document.getElementById('proType').value = preType;
    chooseInput(preType);
    document.getElementById(preType).value = preBrand;
    }
});


//hàm chọn input hãng sx
function chooseInput(v) {

    var sl = document.getElementsByClassName('brand-select');
    for (let i = 0; i < sl.length; i++) {
        if (sl[i].id == v)
            sl[i].style.display = 'block';
        else {
            sl[i].style.display = 'none';
            sl[i].value = '';
        }
    }
}
