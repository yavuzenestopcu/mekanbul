var mongoose = require("mongoose")
var Mekan = mongoose.model("mekan")
const cevapOlustur = function (res, status, content) {
    res.status(status).json(content)
}

const mekanlariListele = function (req, res) {
    cevapOlustur(res, 200, { "durum": "başarılı" })
}

const mekanEkle = function (req, res) {
    cevapOlustur(res, 200, { "durum": "başarılı" })
}

const mekanGetir = function (req, res) {
    cevapOlustur(res, 200, { "durum": "başarılı" })
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