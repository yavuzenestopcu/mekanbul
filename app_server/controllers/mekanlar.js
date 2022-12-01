const axios = require("axios")

var apiSecenekleri = {
  sunucu: "http://localhost:3000",
  apiYolu: "/api/mekanlar/"
}

var mesafeyiFormatla = function (mesafe) {
  var yeniMesafe, birim
  if (mesafe > 1) {
    yeniMesafe = parseFloat(mesafe).toFixed(1)
    birim = " km"
  }
  else {
    yeniMesafe = parseInt(mesafe * 1000, 10)
    birim = " m"
  }
  return yeniMesafe + birim
}

const anaSayfaOlustur = function (res, mekanListesi) {
  var mesaj
  if (!(mekanListesi instanceof Array)) {
    mesaj = "API hatası!"
    mekanListesi = []
  }
  else {
    if (!mekanListesi.length) {
      mesaj = "Civarda herhangi bir mekan yok."
    }
  }
  res.render("anasayfa", {
    "baslik": "Anasayfa",
    "sayfaBaslik": {
      "siteAd": "Mekanbul",
      "slogan": "Mekanları Keşfet"
    },
    "mekanlar": mekanListesi,
    "mesaj": mesaj
  })
}

const anaSayfa = function (req, res, next) {
  axios.get(apiSecenekleri.sunucu + apiSecenekleri.apiYolu, {
    params: {
      enlem: req.query.enlem,
      boylam: req.query.boylam
    }
  }).then(function (response) {
    var i, mekanlar
    mekanlar = response.data
    for (i = 0; i < mekanlar.length; i++) {
      mekanlar[i].mesafe = mesafeyiFormatla(mekanlar[i].mesafe)
    }
    anaSayfaOlustur(res, mekanlar)
  }).catch(function (hata) {
    anaSayfaOlustur(res, hata)
  })
}

const mekanBilgisi = function (req, res, next) {
  res.render('mekanbilgisi', {
    'baslik': 'Mekan Bilgisi',
    'mekanBaslik': 'Starbucks',
    'mekanDetay': {
      'ad': 'Starbucks',
      'puan': 4,
      'adres': 'Centrum Garden AVM',
      'saatler': [
        {
          'gunler': 'Pazartesi-Cuma',
          'acilis': '07:00',
          'kapanis': '23:00',
          'kapali': false
        },
        {
          'gunler': 'Cumartesi-Pazar',
          'acilis': '09:00',
          'kapanis': '22:00',
          'kapali': false
        }
      ],
      'imkanlar': ['Dünya Kahveleri', 'Kek', 'Pasta'],
      'koordinatlar': {
        'enlem': 37.78,
        'boylam': 30.56
      },
      'yorumlar': [
        {
          'yorumYapan': 'Umut Selek',
          'yorumMetni': 'Mükemmel bir iş yeri. Güler yüzlü, tatlı dilli çalışanları var. Hijyenik bir yer.',
          'tarih': '8 Ağustos 2022',
          'puan': 4
        }
      ]
    }
  });
}

const yorumEkle = function (req, res, next) {
  res.render('yorumekle', { title: 'Yorum Ekle' });
}

module.exports = {
  anaSayfa,
  mekanBilgisi,
  yorumEkle
}