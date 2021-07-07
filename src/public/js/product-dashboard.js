//sự kiện khi modal thêm product xuất hiện
var modalAddPro = document.getElementById('modalAddProduct');
modalAddPro.addEventListener('show.bs.modal', function(event){
   
    var btnsubmit = document.getElementById('btnSubmit');
    var formAdd = document.forms['form-add-product'];
    btnsubmit.onclick = function(){
        formAdd.submit();
    }
    chooseInput(document.getElementById('proType').value);
});
//hàm chọn input hãng sx
function chooseInput(v){
    
    var sl = document.getElementsByClassName('brand-select');
    for(let i = 0; i<sl.length; i++)
    {
        if(sl[i].id == v)
            sl[i].style.display = 'block';
        else{
        sl[i].style.display = 'none';
        sl[i].value = '';
        }
    }
}