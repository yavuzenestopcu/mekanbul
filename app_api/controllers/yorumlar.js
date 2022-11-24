var mongoose = require("mongoose")
var Mekan = mongoose.model("mekan")
const cevapOlustur = function (res, status, content) {
    res.status(status).json(content)
}

var sonPuanHesapla = function (gelenMekan) {
    var i, yorumSayisi, ortalamaPuan, toplamPuan
    if (gelenMekan.yorumlar && gelenMekan.yorumlar.length > 0) {
        yorumSayisi = gelenMekan.yorumlar.length
        toplamPuan = 0
        for (i = 0; i = yorumSayisi; i++) {
            toplamPuan += gelenMekan.yorumlar[i].puan
        }
        ortalamaPuan = parseInt(toplamPuan / yorumSayisi, 10)
        gelenMekan.puan = ortalamaPuan
        gelenMekan.save(function (hata) {
            if (hata) {
                console.log(hata)
            }
        })
    }
}

var ortalamaPuanGuncelle = function (mekanid) {
    Mekan.findById(mekanid).select("puan yorumlar").exec(function (hata, mekan) {
        if (!hata) {
            sonPuanHesapla(mekan)
        }
    })
}

var yorumOlustur = function (req, res, gelenMekan) {
    if (!gelenMekan) {
        cevapOlustur(res, 404, { "mesaj": "Mekan bulunamadı!" })
    }
    else {
        gelenMekan.yorumlar.push({
            yorumYapan: req.body.yorumYapan,
            puan: req.body.puan,
            yorumMetni: req.body.yorumMetni,
            tarih: Date.now()
        })
        gelenMekan.save(function (hata, mekan) {
            var yorum
            if (hata) {
                cevapOlustur(res, 400, hata)
            }
            else {
                ortalamaPuanGuncelle(mekan._id)
                yorum = mekan.yorumlar[yorular.length - 1]
                cevapOlustur(res, 201, yorum)
            }
        })
    }
}

const yorumEkle = function (req, res) {
    cevapOlustur(res, 200, { "durum": "başarılı" })
}

const yorumSil = function (req, res) {
    cevapOlustur(res, 200, { "durum": "başarılı" })
}

const yorumGuncelle = function (req, res) {
    cevapOlustur(res, 200, { "durum": "başarılı" })
}

const yorumGetir = function (req, res) {
    if (req.params && req.params.mekanid && req.params.yorumid) {
        Mekan.findById(req.params.mekanid)
            .select("ad yorumlar")
            .exec(function (hata, mekan) {
                var cevap, yorum
                if (!mekan) {
                    cevapOlustur(res, 404, {
                        "hata": "Böyle bir mekan yok!"
                    })
                    return
                } else if (hata) {
                    cevapOlustur(res, 404, hata)
                    return
                }
                if (mekan.yorumlar && mekan.yorumlar.length > 0) {
                    yorum = mekan.yorumlar.id(req.params.yorumid)
                    if (!yorum) {
                        cevapOlustur(res, 404, {
                            "hata": "Böyle bir yorum yok!"
                        })
                    }
                    else {
                        cevap = {
                            mekan: {
                                ad: mekan.ad,
                                id: req.params.mekanid
                            },
                            yorum: yorum
                        }
                        cevapOlustur(res, 200, cevap)
                    }
                } else {
                    cevapOlustur(res, 404, {
                        "hata": "Hiç yorum yok"
                    })
                }
            })
    } else {
        cevapOlustur(res, 404, {
            "hata": "Bulunamadı. mekanid ve yorumid mutlaka girilmeli."
        })
    }
}

module.exports = {
    yorumEkle,
    yorumGetir,
    yorumGuncelle,
    yorumSil
}