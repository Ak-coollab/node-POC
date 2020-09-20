const multer = require('multer');
const path = require('path') ;
const fs = require('fs');
const db = require('../../models/index');
const models = require('../../models');
const User = models.Users;

const utils = {};

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

uploads = (req, res) => { 
    let upload = multer({ 
        fileFilter: imageFilter,
        storage: multer.diskStorage({
            destination: 'public/uploads/files',
            filename: function (req, file, cb) {
                ////cnole.log(file);
                const start = Date.now();
                cb(null, `file${start}${path.extname(file.originalname)}`);
            }
        })
    }).single('uploads');
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
    
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send({error : 'Please select an image to upload'});
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
    
        if (!(!!req.file && !!req.file.filename)) {
            return res.notFound({ message: 'file not found' });
        }
        // console.log("hi", req.file.buffer.toString('base64'))
        const path = `public/uploads/files/${req.file.filename}`;
        var binaryData = fs.readFileSync(path);
        var base64String = new Buffer(binaryData).toString("base64");
        res.status(200).json({
            "description": "File uploaded Successfully",
            "filrURL": path,
            "base64String" :base64String
        });
    });
}


uploadsUpdate = (req, res) => { 
    let upload = multer({ 
        fileFilter: imageFilter,
        storage: multer.diskStorage({
            destination: 'public/uploads/files',
            filename: function (req, file, cb) {
                ////cnole.log(file);
                const start = Date.now();
                cb(null, `file${start}${path.extname(file.originalname)}`);
            }
        })
    }).single('uploads');
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
    
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send({error : 'Please select an image to upload'});
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
    
        if (!(!!req.file && !!req.file.filename)) {
            return res.notFound({ message: 'file not found' });
        }
        // console.log("hi", req.file.buffer.toString('base64'))
        const path = `public/uploads/files/${req.file.filename}`;
        var binaryData = fs.readFileSync(path);
        var base64String = new Buffer(binaryData).toString("base64");


        let { params } = req;
        User.update( {
            image: path,
            base64Content: base64String,
        },
        { 
            where : {id : params.id} ,
        }).then(users => {
            if (users == 1) {
                User.findOne({
                    where : {id : params.id}
                }).then(user => {
                    res.status(200).json({
                        "description": "Profile Picture Updated successfully",
                        "book": user
                    });
                });
            } else {
                res.status(200).json({
                    "description": "User not found",
                    "user": {}
                });	
            }
        }).catch(err => {
            res.status(500).send("Fail! Error -> " + err);
        });

    });
}

isIdUnique =  (id, modelName) => {
    if (modelName == "class") {
        return db.Classes.count({ where: { id: id } })
          .then(count => {
            if (count != 0) {
              return false;
            }
            return true;
        });
    } else if (modelName == "section") {
        return db.Section.count({ where: { id: id } })
        .then(count => {
          if (count != 0) {
            return false;
          }
          return true;
      });
    }
}


utils.uploads = uploads;
utils.isIdUnique = isIdUnique;
utils.uploadsUpdate = uploadsUpdate;

module.exports = utils;