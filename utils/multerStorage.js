const multer  = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudStorage.js');
const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params: {
        folder:"Memestream",
        allowed_formats:['jpeg','jpg','png','gif']
    }
})
const upload = multer({storage }) // used to parse the multiparse-Data.

module.exports={upload}