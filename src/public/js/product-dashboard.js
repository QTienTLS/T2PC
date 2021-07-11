//sự kiện khi modal thêm product xuất hiện
var modalAddPro = document.getElementById('modalAddProduct');
modalAddPro.addEventListener('show.bs.modal', function (event) {
    var btnTrigger = event.relatedTarget;
    var formAction = btnTrigger.getAttribute('data-bs-action');
    var btnsubmit = document.getElementById('btnSubmit');
    var formAdd = document.forms['form-add-product'];
    if (formAction == 'add') {
        btnsubmit.onclick = function () {
            if (!document.getElementById('inputDesImg').value)
                formAdd.action = '/admin/addsproduct';
            formAdd.submit();
        };
    } else {
        //lấy dữ liệu về sản phẩm cần sửa
        var proID = btnTrigger.getAttribute('data-bs-proID');
        var proName = btnTrigger.getAttribute('data-bs-proName');
        var proType = btnTrigger.getAttribute('data-bs-proType');
        var proBrand = btnTrigger.getAttribute('data-bs-proBrand');
        var proPrice = parseInt(btnTrigger.getAttribute('data-bs-proPrice'));
        var proOriginPrice = parseInt(
            btnTrigger.getAttribute('data-bs-proOriginPrice'),
        );
        var proSpec = btnTrigger.getAttribute('data-bs-proSpec');
        var proDes = btnTrigger.getAttribute('data-bs-proDes');
        var proStored = parseInt(btnTrigger.getAttribute('data-bs-proStored'));
        //đổ dữ liệu lên các trường
        document.getElementById('proType').value = proType;
        chooseInput(proType);
        document.getElementById(proType).value = proBrand;
        document.getElementById('inputProName').value = proName;
        document.getElementById('inputOriginPrice').value = proOriginPrice;
        document.getElementById('inputPrice').value = proPrice;
        document.getElementById('inputStored').value = proStored;
        document.getElementById('inputDescription').value = proDes;
        document.getElementById('inputSpec').value = proSpec.replace(
            /,/g,
            '\n',
        );
        //chỉnh lại giao diện 1 chút
        document.getElementById('exampleModalLabel').innerHTML =
            'Sửa gì nào bạn ơii';
        document.getElementById('btnCancel').innerHTML = 'Thôi chả sửa nữa';
        btnsubmit.innerHTML = 'Sửa sản phẩm này';
        btnsubmit.classList.add('btn-warning');
        //các trường hợp cập nhật hình ảnh
        var op;
        var a = document.getElementById('inputProImg');
        var b = document.getElementById('inputDesImg');
        btnsubmit.onclick = function () {
            if (!a.value && !b.value) op = 1;
            else if (a.value && !b.value) op = 2;
            else if (!a.value && b.value) op = 3;
            else op = 4;
            formAdd.action =
                '/admin/product/' + op + '/' + proID + '?_method=PUT';
            formAdd.submit();
            // alert(a.value);
        };
    }
    //tự chọn value cho loại sp và hãng đang chọn
    var data = document.getElementById('pre-choose-type');
    var preType = data.getAttribute('data-type');
    var preBrand = data.getAttribute('data-brand');
    chooseInput(document.getElementById('proType').value);
    if (preType) {
        document.getElementById('proType').value = preType;
        chooseInput(preType);
        document.getElementById(preType).value = preBrand;
    }
});
modalAddPro.addEventListener('hidden.bs.modal', function (event) {
    //chỉnh lại giao diện
    var title = document.getElementById('exampleModalLabel').innerHTML;
    if (title == 'Sửa gì nào bạn ơii') {
        title = 'Thêm sản phẩm mới nào bạn ơiiii';
        document.getElementById('btnCancel').innerHTML = 'Thôi chả thêm nữa';
        var btnSubmit = document.getElementById('btnSubmit');
        btnSubmit.innerHTML = 'Thêm thì thêm';
        btnSubmit.classList.remove('btn-warning');
        //làm sạch thẻ input
        var form = document.forms['form-add-product'];
        var input = form.getElementsByTagName('input');
        var i;
        for (i = 0; i < input.length; i++) input[i].value = '';
        //làm sạch thẻ textarea
        var textA = form.getElementsByTagName('textarea');
        for (i = 0; i < textA.length; i++) textA[i].value = '';
    }
});
//hàm chọn input hãng sx
function chooseInput(v) {
    var sl = document.getElementsByClassName('brand-select');
    for (let i = 0; i < sl.length; i++) {
        if (sl[i].id == v) sl[i].style.display = 'block';
        else {
            sl[i].style.display = 'none';
            sl[i].value = '';
        }
    }
}
document
    .getElementById('modalXoa')
    .addEventListener('show.bs.modal', function (event) {
        var btn = event.relatedTarget;
        var proID = btn.getAttribute('data-bs-proID');
        var formDel = document.forms['shipper'];
        var btnSubmit = document.getElementById('btn-delete-product');
        formDel.action = '/admin/product/' + proID + '?_method=DELETE';
        btnSubmit.onclick = function () {
            formDel.submit();
        };
    });
