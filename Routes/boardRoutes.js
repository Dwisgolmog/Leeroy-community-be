const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const cookie = require('../middlewares/checkCookie');
const boardController = require('../Controllers/boardController');

//NOTE: 이미지 저장소 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../resource/boardImg'));
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + '-' + Math.random() + path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    if (extName) {
        cb(null, true);
    } else {
        cb(new Error('이미지 파일만 업로드 가능합니다!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter,
});

router.post(
    '',
    cookie.checkCookie,
    upload.single('content_img'),
    boardController.addBoard
);

router.get('/:board_id', cookie.checkCookie, boardController.getBoard);

module.exports = router;