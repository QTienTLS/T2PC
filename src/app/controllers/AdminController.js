const session = require('express-session');
const Event = require('../models/Event');
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
}

module.exports = new AdminController();
