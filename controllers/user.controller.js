const User = require('../models/user_model');
const path = require('path');

const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  },
  fileFilter: (req, file, cb) => {
    let extname = path.extname(file.originalname);
    if (extname === '.png' || extname === '.jpg') {
      return cb(null, true);
    }
    return cb(new Error('Only accept .png and .jpg image'), false);
  }
}).single('image');

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'firebase-demo-flutter.appspot.com'
});
const bucket = admin.storage().bucket();

module.exports.getAll = async (req, res) => {
  try {
    const user = await User.getAllUsers();
    res.status(200).json(user);
  } catch (e) {
    res.status(e.status).json({ message: e.message });
  }
};

module.exports.getByPhone = async (req, res) => {
  try {
    const user = await User.getUserByPhone(req.params.phone);
    res.status(200).json(user);
  } catch (e) {
    res.status(e.status).json({ message: e.message });
  }
};

module.exports.createNew = async (req, res) => {
  console.log(req.body);
  
  const { phone, name, birthday, address } = req.body;
  if (!phone || !name || !birthday || !address) {
    return res
      .status(422)
      .json({ message: 'Missing phone, name, birthday and address' });
  }

  try {
    const newUser = await User.createUser(phone, name, birthday, address);
    res.status(200).json(newUser);
  } catch (e) {
    res.status(e.status).json({ message: e.message });
  }
};

module.exports.uploadImage = [
  upload,
  function(req, res) {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded!' });
      return;
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(
      `${req.params.phone}${path.extname(req.file.originalname)}`
    );
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });

    blobStream.on('error', err => {
      res.status(500).json({ message: err.message || 'Unknown error' });
    });

    blobStream.on('finish', () => {
      blob
        .getSignedUrl({ action: 'read', expires: '03-09-2491' })
        .then(signedUrls => signedUrls[0])
        .then(downloadUrl => User.updateImageUrl(req.params.phone, downloadUrl))
        .then(user => res.status(200).json(user))
        .catch(e => res.status(500).json({ message: e.message }));
    });

    blobStream.end(req.file.buffer);
  }
];
