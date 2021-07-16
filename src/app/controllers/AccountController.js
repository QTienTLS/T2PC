const bcryt = require('bcrypt');
const Account = require('../models/Account');
const Product = require('../models/Product');
const Order = require('../models/Order');
const session = require('express-session');
const path = require('path');
const { mongooseToObject } = require('../../tools/mongoose');
const { mutipleMongooseToObject } = require('../../tools/mongoose');
const multer = require('multer');

//khởi tạo biến cấu hình cho lưu trữ ảnh đại diện
const diskStorageforAvt = multer.diskStorage({
    destination: (req, file, callback) => {
        // Định nghĩa nơi file upload sẽ được lưu lại
        callback(null, path.join(`${__dirname}../../../public/img/avt`));
    },
    filename: (req, file, callback) => {
        // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
        let math = ['image/png', 'image/jpeg'];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
        let filename = `${Date.now()}-T2PC-${file.originalname}`;
        callback(null, filename);
    },
});
var help;
class AccountController {
    login(req, res) {
        res.render('account/login');
    }

    register(req, res) {
        res.render('account/register');
    }
    save(req, res, next) {
        const formData = req.body;
        // if (formData.sex == 'male') formData.img = '/img/user-default.png';
        // else formData.img = '/img/user-default-female.png';
        const salt = bcryt.genSaltSync(10);
        formData.password = bcryt.hashSync(
            formData.password,
            salt,
            function (err, hash) {},
        );
        const account = new Account(formData);
        account.save();
        res.redirect('/account/login');
    }
    logingin(req, res, next) {
        Account.findOne({ username: req.body.inputName }, function (err, acc) {
            if (err) handleError(err);
            if (acc) {
                const kq = bcryt.compareSync(
                    req.body.inputPassword,
                    acc.password,
                );
                if (kq) {
                    req.session.User = {
                        checkLogin: 'true',
                        img: acc.img,
                        name: acc.username,
                        role: acc.role,
                        id: acc._id,
                    };

                    res.redirect('/');
                } else {
                    help = {
                        loginHelp:
                            'Tên đăng nhập hoặc mật khẩu không đúng ! Vui lòng kiểm tra lại',
                    };
                    res.render('account/login', { help });
                }
            } else {
                help = {
                    loginHelp:
                        'Tài khoản không tồn tại ! Vui lòng kiểm tra lại',
                };
                res.render('account/login', { help });
            }
        });
    }
    logout(req, res) {
        req.session.destroy(function (err) {
            return res.redirect('/');
        });
    }
    detail(req, res) {
        if (!req.session.User) res.render('partials/404');
        else {
            Account.findOne({ _id: req.session.User.id }, function (err, acc) {
                res.render('account/detail', { acc: mongooseToObject(acc) });
                // res.json(acc);
            });
        }
    }
    changeAvt(req, res, next) {
        //upload ảnh đã chọn lên sever
        let uploadFile = multer({ storage: diskStorageforAvt }).single(
            'updateAvt',
        );
        uploadFile(req, res, (error) => {
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            }
        });
        //xóa ảnh cũ đi và update ảnh vào database
        Account.findOne({ _id: req.params.id }, function (err, acc) {
            if (err) console.log(err);
            //nếu k có file ảnh nào thì trở về trang cũ
            if (!req.file) res.redirect('back');
            else {
                if (acc.img != '/img/avt/user-default.png') {
                    var fs = require('fs');
                    fs.unlink(
                        path.join(`${__dirname}..\\..\\..\\public` + acc.img),
                        function (err) {
                            if (err) throw err;
                        },
                    );
                }
                var newAcc = acc;
                newAcc.img = '\\img\\avt\\' + req.file.filename;

                Account.updateOne({ _id: req.params.id }, newAcc)
                    .then(() => {
                        req.session.reload(function (err) {
                            req.session.User = {
                                checkLogin: 'true',
                                img: acc.img,
                                name: acc.username,
                                role: acc.role,
                                id: acc._id,
                            };
                            res.redirect('back');
                        });
                    })
                    .catch(next);
            }
        });
    }
    updateAcc(req, res, next) {
        Account.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.redirect('back');
            })
            .catch(next);
    }
    async checkout(req, res, next) {
        var cart = req.body;
        cart.id = cart.id.split(',');
        cart.amount = cart.amount.split(',');
        var pros = [];
        for (let i = 0; i < cart.id.length; i++) {
            var pro = await Product.findById(cart.id[i]);
            var nPro = {
                name: pro.name,
                img: pro.img,
                price: pro.price,
                id: pro.id,
                amount: cart.amount[i],
            };
            pros.push(nPro);
        }
        var totalAmount = cart.numPro;
        var totalPrice = cart.totalPrice;
        Account.findById(req.session.User.id, function (err, acc) {
            acc = mongooseToObject(acc);
            res.render('account/checkout', {
                pros,
                acc,
                totalAmount,
                totalPrice,
            });
        });
    }
    submitOrder(req, res) {
        var order = new Order(req.body);
        order.listProID = req.body.listProID.split(',');
        order.listPro = req.body.listPro.split('`');
        order.listImg = req.body.listProImg.split(',');
        order.listPrice = req.body.listProPrice.split(',').map((x) => +x);
        order.amount = req.body.amount.split(',').map((x) => +x);
        order.save();
        //res.json(order);
        res.render('account/done-order');
    }
}
module.exports = new AccountController();
