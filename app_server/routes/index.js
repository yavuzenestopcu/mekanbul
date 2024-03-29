var express = require('express');
var router = express.Router();
var ctrlMekanlar = require('../controllers/mekanlar.js')
var ctrlDigerleri = require('../controllers/digerleri.js')

/* GET home page. */
router.get('/', ctrlMekanlar.anaSayfa);
router.get('/mekan/:mekanid', ctrlMekanlar.mekanBilgisi);
router.get('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumEkle);
router.post('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumumuEkle);
router.get('/hakkinda', ctrlDigerleri.hakkinda);

module.exports = router;
