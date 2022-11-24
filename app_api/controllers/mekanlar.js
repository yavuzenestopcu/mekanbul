var mongoose = require("mongoose")
var Mekan = mongoose.model("mekan")
const cevapOlustur = function (res, status, content) {
    res.status(status).json(content)
}
var cevrimler = (function () {
    var dunyaYariCap = 6371
    var radyan2Kilometre = function (radyan) {
        return parseFloat(radyan * dunyaYariCap)
    }
    var kilometre2Radyan = function (mesafe) {
        return parseFloat(mesafe / dunyaYariCap)
    }
    return {
        radyan2Kilometre: radyan2Kilometre,
        kilometre2Radyan: kilometre2Radyan
    }
})()

const mekanlariListele = async (req, res) => {
    var boylam = parseFloat(req.query.boylam)
    var enlem = parseFloat(req.query.enlem)
    
    var koordinat = {
        type: "Point",
        coordinates: [enlem, boylam]
    }
    
    var geoOptions = {
        distanceField: "mesafe",
        spherical: true
    }
    
    if ((!enlem && boylam !== 0) || (enlem !== 0 && !boylam )) {
        cevapOlustur(res, 404, {
            "hata" : "enlem ve boylam zorunlu parametreler"
        })
        return
    }
    
    try {
        const sonuc = await Mekan.aggregate([
            {
                $geoNear: {
                    near: koordinat,
                    ...geoOptions
                }
            }
        ])
        
        const mekanlar = sonuc.map((mekan) => {
            return {
                mesafe: cevrimler.kilometre2Radyan(mekan.mesafe),
                ad: mekan.ad,
                adres: mekan.adres,
                puan: mekan.puan,
                imkanlar: mekan.imkanlar,
                _id: mekan._id
            }
        })
        cevapOlustur(res, 200, mekanlar)
    } catch (e) {
        cevapOlustur(res, 404, e)
    }
}

const mekanEkle = function (req, res) {
    Mekan.create(
        {
          ad: req.body.ad,
          adres: req.body.adres,
          imkanlar: req.body.imkanlar.split(","),
          koordinat: [parseFloat(req.body.enlem), parseFloat(req.body.boylam)],
          saatler: [
            {
              gunler: req.body.gunler1,
              acilis: req.body.acilis1,
              kapanis: req.body.kapanis1,
              kapali: req.body.kapali1,
            },
            {
              gunler: req.body.gunler2,
              acilis: req.body.acilis2,
              kapanis: req.body.kapanis2,
              kapali: req.body.kapali2,
            },
          ],
        },
        (hata, mekan) => {
          if (hata) {
            cevapOlustur(res, 400, hata);
          } else {
            cevapOlustur(res, 200, mekan);
          }
        }
      );
}

const mekanGetir = function (req, res) {
    if (req.params && req.params.mekanid) {
        Mekan.findById(req.params.mekanid).exec(function (hata, mekan) {
            if (!mekan) {
                cevapOlustur(res, 404, { "hata": "Böyle bir mekan yok!" })
            } else if (hata) {
                cevapOlustur(res, 404, { "hata": hata })
            } else {
                cevapOlustur(res, 200, mekan)
            }
        })
    } else {
        cevapOlustur(res, 404, { "hata": "İstekte mekanid yok!" })
    }
}

const mekanGuncelle = function (req, res) {
    cevapOlustur(res, 200, { "durum": "başarılı" })
}

const mekanSil = function (req, res) {
    cevapOlustur(res, 200, { "durum": "başarılı" })
}

module.exports = {
    mekanEkle,
    mekanGetir,
    mekanGuncelle,
    mekanSil,
    mekanlariListele
}