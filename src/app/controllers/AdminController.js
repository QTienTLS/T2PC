const session = require('express-session');
const Event = require('../models/Event');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Account = require('../models/Account');
const ProductSold = require('../models/ProductSold');
const { mongooseToObject } = require('../../tools/mongoose');
const { mutipleMongooseToObject } = require('../../tools/mongoose');
const { countDocuments } = require('../models/Event');
const path = require('path');
const multer = require('multer');
const { resolveSoa } = require('dns');

var formData;

//khởi tạo biến cấu hình cho lưu trữ
const diskStorageforEvent = multer.diskStorage({
    destination: (req, file, callback) => {
        // Định nghĩa nơi file upload sẽ được lưu lại
        callback(null, path.join(`${__dirname}../../../public/img/banner`));
    },
    filename: (req, file, callback) => {
        // chỉ cho phép tải lên các loại ảnh png & jpg
        let math = ['image/png', 'image/jpeg'];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        // Tên của file nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
        let filename = `${Date.now()}-T2PC-${file.originalname}`;
        callback(null, filename);
    },
});
// lưu trữ ảnh sản phẩm
const diskStorageforProduct = multer.diskStorage({
    destination: (req, file, callback) => {
        // Định nghĩa nơi file upload sẽ được lưu lại
        if (file.fieldname == 'inputProImg')
            callback(
                null,
                path.join(`${__dirname}../../../public/img/products`),
            );
        else if (file.fieldname == 'inputDesImg')
            callback(
                null,
                path.join(`${__dirname}../../../public/img/description`),
            );
    },
    filename: (req, file, callback) => {
        // chỉ cho phép tải lên các loại ảnh png & jpg
        let math = ['image/png', 'image/jpeg'];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        // Tên của file nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
        let filename = `${Date.now()}-T2PC-${file.originalname}`;
        callback(null, filename);
    },
});

var check = {
    opendashboard: true,
};

class AdminController {
    async dashboard(req, res) {
        check = {
            opendashboard: true,
        };
        var numPro = await Product.countDocuments({});
        var numAcc = await Account.countDocuments({});
        var numOrder = await Order.countDocuments({ status: 3 });
        var numOrderFail = await Order.countDocuments({ status: 2 });
        res.render('admin-dashboard/dashboard', {
            check,
            numPro,
            numAcc,
            numOrder,
            numOrderFail,
        });
    }
    event(req, res, next) {
        Event.find({})
            .then((events) => {
                res.render('admin-dashboard/event', {
                    events: mutipleMongooseToObject(events),
                    check,
                });
            })
            .catch(next);
        //    res.render('admin-dashboard/event',{check});
    }
    addEvent(req, res, next) {
        //upload ảnh lên sever
        let uploadFile = multer({ storage: diskStorageforEvent }).single(
            'addImg',
        );
        uploadFile(req, res, (error) => {
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            }
        });
        // Tiến hành thêm event

        Event.countDocuments({}, function (err, countEvent) {
            formData = {
                link: req.body.inputLink,
                img: '\\img\\banner\\' + req.file.filename,
                name: req.body.inputEventName,
            };

            const event = new Event(formData);
            event.save();
            res.redirect('/admin/event');
        });
    }
    delEvent(req, res, next) {
        Event.findOneAndDelete({ _id: req.params.id }, function (err, ev) {
            if (err) console.log(err);
            var fs = require('fs');
            fs.unlink(
                path.join(`${__dirname}..\\..\\..\\public` + ev.img),
                function (err) {
                    if (err) throw err;
                },
            );
            console.log('deleted image name: ' + ev.img);
            res.redirect('back');
        });
    }
    updateEvent(req, res, next) {
        //upload ảnh lên sever
        let uploadFile = multer({ storage: diskStorageforEvent }).single(
            'updateImg',
        );
        uploadFile(req, res, (error) => {
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            }
        });
        Event.findOne({ _id: req.params.id }, function (err, ev) {
            if (err) console.log(err);
            var fs = require('fs');
            formData = {
                name: req.body.updateName,
                link: req.body.updateLink,
                img: '',
            };
            if (req.file) {
                fs.unlink(
                    path.join(`${__dirname}..\\..\\..\\public` + ev.img),
                    function (err) {
                        if (err) throw err;
                    },
                );
                formData.img = '\\img\\banner\\' + req.file.filename;
            } else {
                formData.img = ev.img;
            }
            Event.updateOne({ _id: req.params.id }, formData)
                .then(() => res.redirect('/admin/event'))
                .catch(next);
        });
    }
    showProduct(req, res) {
        Product.find({}).sort({stored : 'desc'})
        .then((products)=>{
            products = mutipleMongooseToObject(products);
            res.render('admin-dashboard/product', { products, check });
        })

    }

    addFullProduct(req, res, next) {
        var addPro = multer({ storage: diskStorageforProduct }).fields([
            { name: 'inputProImg' },
            { name: 'inputDesImg' },
        ]);

        addPro(req, res, function (error) {
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            }
            var newPro = {
                img: '\\img\\products\\' + req.files['inputProImg'][0].filename,
                desImg:
                    '\\img\\description\\' +
                    req.files['inputDesImg'][0].filename,
                price: parseInt(req.body.inputPrice),
                originPrice: parseInt(req.body.inputOriginPrice),
                stored: parseInt(req.body.inputStored),
                description: req.body.inputDescription,
                brand: req.body.brand,
                type: req.body.type,
                name: req.body.inputProName,
                spec: req.body.inputSpec
                    .replace(/(\r\n|\n|\r)/gm, '~')
                    .split(/~+/),
            };
            newPro.discount = Math.round(
                ((newPro.originPrice - newPro.price) / newPro.originPrice) *
                    100,
            );
            const pro = new Product(newPro);
            pro.save();
            req.session.curentAdd = {
                type: req.body.type,
                brand: req.body.brand,
            };
            res.redirect('back');
        });
    }
    addSemiProduct(req, res, next) {
        var addPro = multer({ storage: diskStorageforProduct }).single(
            'inputProImg',
        );

        addPro(req, res, function (error) {
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            }
            var newPro = {
                img: '\\img\\products\\' + req.file.filename,
                desImg: '',
                price: parseInt(req.body.inputPrice),
                originPrice: parseInt(req.body.inputOriginPrice),
                stored: parseInt(req.body.inputStored),
                description: req.body.inputDescription,
                brand: req.body.brand,
                type: req.body.type,
                name: req.body.inputProName,
                spec: req.body.inputSpec
                    .replace(/(\r\n|\n|\r)/gm, '~')
                    .split(/~+/),
            };
            newPro.discount = Math.round(
                ((newPro.originPrice - newPro.price) / newPro.originPrice) *
                    100,
            );
            const pro = new Product(newPro);
            pro.save();
            req.session.curentAdd = {
                type: req.body.type,
                brand: req.body.brand,
            };
            res.redirect('back');
        });
    }
    delPro(req, res, next) {
        Product.findOne({ _id: req.params.id })
        .then((pro) => {
            pro.stored = 0;
            pro.save();
            res.redirect('back');
        })
    }
    updatePro(req, res, next) {
        var fs = require('fs');
        var addPro;
        switch (req.params.op) {
            case '1':
                addPro = multer().none();
                break;
            case '2':
                addPro = multer({ storage: diskStorageforProduct }).single(
                    'inputProImg',
                );
                break;
            case '3':
                addPro = multer({ storage: diskStorageforProduct }).single(
                    'inputDesImg',
                );
                break;
            case '4':
                addPro = multer({ storage: diskStorageforProduct }).fields([
                    { name: 'inputProImg' },
                    { name: 'inputDesImg' },
                ]);
                break;
        }
        addPro(req, res, function (error) {
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            }
            var newPro = {
                price: parseInt(req.body.inputPrice),
                originPrice: parseInt(req.body.inputOriginPrice),
                stored: parseInt(req.body.inputStored),
                description: req.body.inputDescription,
                brand: req.body.brand,
                type: req.body.type,
                name: req.body.inputProName,
                spec: req.body.inputSpec
                    .replace(/(\r\n|\n|\r)/gm, '~')
                    .split(/~+/),
            };
            if (req.params.op == '2') {
                newPro.img = '\\img\\products\\' + req.file.filename;
            } else if (req.params.op == '3')
                newPro.desImg = '\\img\\description\\' + req.file.filename;
            else if (req.params.op == '4') {
                newPro.img =
                    '\\img\\products\\' + req.files['inputProImg'][0].filename;
                newPro.desImg =
                    '\\img\\description\\' +
                    req.files['inputDesImg'][0].filename;
            }
            newPro.discount = Math.round(
                ((newPro.originPrice - newPro.price) / newPro.originPrice) *
                    100,
            );
            Product.updateOne({ _id: req.params.id }, newPro)
                .then(() => {
                    req.session.curentAdd = {
                        type: req.body.type,
                        brand: req.body.brand,
                    };
                    res.redirect('back');
                })
                .catch(next);
        });
    }
    async goToOrder(req, res) {
        var link = 'admin-dashboard/' + req.params.link;
        var status;
        if (req.params.link == 'pending') status = 0;
        else if (req.params.link == 'shipping') status = 1;
        else if (req.params.link == 'done') status = 3;
        else if (req.params.link == 'canceled') status = 2;
        else if (req.params.link == 'cancel-request') status = 4;
        var orders = await Order.find({ status: status });
        orders = mutipleMongooseToObject(orders);
        for (let i = 0; i < orders.length; i++) {
            if (orders[i - 1] && orders[i - 1].userID == orders[i].userID)
                orders[i].acc = orders[i - 1].acc;
            else {
                var acc = await Account.findOne({ _id: orders[i].userID });
                acc = mongooseToObject(acc);
                orders[i].acc = acc;
            }
            orders[i].proNameString = orders[i].listPro.join('`');
        }
        res.render(link, { check, orders });
    }
    async banUser(req, res, next) {
        var reason = req.body.why;
        var update = {
            reasonBan: reason,
            status: 2,
        };
        // res.send(req.params.id);
        var acc = await Account.updateOne({ _id: req.params.id }, update);
        res.redirect('back');
    }
    updateOrder(req, res, next) {
        var update = {
            status: req.params.status,
        };
        if (req.body.adminNote) update.adminNote += req.body.adminNote;
        else
            update.adminNote =
                'Đơn hàng đã hoàn thành ! Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi';

        Order.findOne({ _id: req.params.id })
            .then((order) => {
                order.status = update.status;
                order.adminNote = update.adminNote;
                order.save();
                order = mongooseToObject(order);
                var n = order.listPro.length;
                if (req.params.status == 1) {
                    for (let i = 0; i < n; i++) {
                        Product.findOne(
                            { _id: order.listProID[i] },
                            function (err, pro) {
                                if (err) console.log(err);
                                pro.stored -= order.amount[i];
                                pro.save();
                            },
                        );
                    }
                } else if (req.params.status == 3) {
                    Account.findOne({ _id: order.userID }, function (err, acc) {
                        if (err) console.log(err);
                        acc.totalSpend += order.totalPrice;
                        acc.save();
                    });
                    for (let i = 0; i < n; i++) {
                        var d = new Date();
                        ProductSold.findOne({
                            proID: order.listProID[i],
                            month: d.getMonth() + 1,
                            year: d.getFullYear(),
                        })
                            .then((proSold) => {
                                if (!proSold) {
                                    var newProSold = new ProductSold();
                                    newProSold.proID = order.listProID[i];
                                    newProSold.sold = order.amount[i];
                                    newProSold.month = d.getMonth() + 1;
                                    newProSold.year = d.getFullYear();
                                    newProSold.save();
                                } else {
                                    proSold.sold += order.amount[i];
                                    proSold.save();
                                }
                            })
                            .catch(next);
                    }
                }

                res.redirect('back');
            })
            .catch(next);
    }
    async findTopSeller(req, res) {
        var allpro = await Product.find({});
        for (let i = 0; i < allpro.length; i++) {
            allpro[i].topseller = 0;
            allpro[i].save();
        }
        var topSeller = await ProductSold.find({})
            .sort({ year: 'desc', month: 'desc', sold: 'desc' })
            .limit(6);
        topSeller = mutipleMongooseToObject(topSeller);
        for (let i = 0; i < 6; i++) {
            var pro = await Product.findById(topSeller[i].proID);
            pro.topseller = 1;
            pro.save();
        }
        res.redirect('back');
    }
    showAccount(req,res,next){
        Account.find({})
        .then((acc)=>
        {
            acc = mutipleMongooseToObject(acc);
            res.render('admin-dashboard/account',{acc,check});
        })
        .catch(next);
    }
}


module.exports = new AdminController();
