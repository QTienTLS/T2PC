const session = require('express-session');
const Event = require('../models/Event');
const Product = require('../models/Product');
const { mongooseToObject } = require('../../tools/mongoose');
const { mutipleMongooseToObject } = require('../../tools/mongoose');
const { countDocuments } = require('../models/Event');
const path = require('path');
const multer = require('multer');

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

var check;

class AdminController {
    dashboard(req, res) {
        check = {
            opendashboard: true,
        };

        res.render('admin-dashboard/dashboard', { check });
    }
    event(req, res, next) {
        check = {
            opendashboard: true,
        };
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
        Product.find({}, function (err, pro) {
            if (err) console.log(err);
            check = {
                opendashboard: true,
            };
            var products = mutipleMongooseToObject(pro);
            res.render('admin-dashboard/product', { products, check });
        });
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
                    .replace(/(\r\n|\n|\r)/gm, ',')
                    .split(/,+/),
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
                    .replace(/(\r\n|\n|\r)/gm, ',')
                    .split(/,+/),
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
        Product.findOneAndDelete({ _id: req.params.id }, function (err, p) {
            if (err) console.log(err);
            var fs = require('fs');
            fs.unlink(
                path.join(`${__dirname}..\\..\\..\\public` + p.img),
                function (err) {
                    if (err) throw err;
                },
            );
            if (p.desImg)
                fs.unlink(
                    path.join(`${__dirname}..\\..\\..\\public` + p.desImg),
                    function (err) {
                        if (err) throw err;
                    },
                );
            res.redirect('back');
        });
    }
    updatePro(req,res,next)
    {
        var fs = require('fs');
        var addPro;
        switch( req.params.op){
            case '1':
                addPro = multer().none();
                break;
            case '2':
                addPro = multer({ storage: diskStorageforProduct }).single('inputProImg',);
                break;
            case '3':
                addPro = multer({ storage: diskStorageforProduct }).single('inputDesImg',);
                break;
            case '4': 
                addPro = multer({ storage: diskStorageforProduct }).fields([
                    { name: 'inputProImg' },
                    { name: 'inputDesImg' },
                ]);
                break;
        };
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
                    .replace(/(\r\n|\n|\r)/gm, ',')
                    .split(/,+/),
            };
            if(req.params.op ==  '2')
            {
                newPro.img =  '\\img\\products\\' + req.file.filename;
            }
            else if(req.params.op ==  '3')
                newPro.desImg =  '\\img\\description\\' + req.file.filename;
            else if(req.params.op ==  '4')
            {
                newPro.img = '\\img\\products\\' + req.files['inputProImg'][0].filename;
                newPro.desImg =
                    '\\img\\description\\' +
                    req.files['inputDesImg'][0].filename;
            }
            newPro.discount = Math.round(
                ((newPro.originPrice - newPro.price) / newPro.originPrice) *
                    100,
            );
            Product.updateOne({_id: req.params.id}, newPro)
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
}

module.exports = new AdminController();
