var objetPublic = function () {
  if (typeof(module) === 'undefined' || module.exports === undefined)
    return window;

  return module.exports;
};

(function (exports) {
  var debug = false,
      jourDepart = 25,

      rendsSurvolable = function ($element) {
        $element.mouseenter(function () { $(this).addClass("survol"); });
        $element.mouseleave(function () { $(this).removeClass("survol"); });
        $element.click(function () { $(this).removeClass("survol"); });
      },

      voletEstAvantDate = function (jourVolet, date) {
        return debug || (31 + jourVolet - jourDepart) % 31 <= jours_ecoules(date);
      },

      jours_ecoules = function (date) {
        return Math.floor((date - new Date('2014-12-'+ jourDepart)) / 86400000);
      },

      creeSurprise = function (position, jourCourant) {
        var $surprise = $(
            '<div class="case" style="'
            + 'left:' + (position.left + 1) + '%;'
            +'top:' + (position.top + 2) + '%;'
            + '">' + image(jourCourant) + '</div>');
        rendsSurvolable($surprise);
        return $surprise;
      },

      calcule_class_chiffres = function (numero) {
        if (numero < 10)
         return "un-chiffre";
        return "deux-chiffres";
      },

      image = function (numero) {
        return '<div style="background: url(\'cases/case_' +
               numero +
               '.jpg\') center; background-size: cover;"></div>';
      },

      creeVolet = function (position, jourCourant) {
        var $volet = $(
          '<div class="numero" style="'
          + 'left:' + (position.left + 0.5) + '%;'
          +'top:' + (position.top + 1) + '%;'
          + '"> <div class="' + calcule_class_chiffres(jourCourant) + '">'
          + jourCourant + '</div></div>');

          if (voletEstAvantDate(jourCourant, new Date())) {
            $volet.addClass("avec-contour");
            rendsSurvolable($volet);
          }
        return $volet;
      },

      add_click = function ($calendrier, volet, surprise, jour) {
        volet.on('click', function() {
          if (voletEstAvantDate(jour, new Date())) {
            $calendrier.append(surprise);
            volet.addClass('ouvert');
            surprise.click(function () { zoome_sur(surprise); });
          } else {
            $("#message-trop-tot").css("display", "block");
            setTimeout(function() {
              $("#message-trop-tot").css("display", "none");
            }, 2000);
          }
        });
      },

      zoome_sur = function (element) {
        var hirez;
        hirez = element.clone();
        hirez.css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3
        });
        $('body').append(hirez);
        hirez.click(function() { hirez.remove(); });
      },

      construis_le_calendrier = function ($calendrier, nbLignes, nbColonnes) {
        var largeur = 100 / nbColonnes,
            hauteur = 80 / nbLignes,

        construis_les_cases = function () {
          var positions = construis_les_positions(nbLignes, nbColonnes),
            jourCourant = jourDepart - 1;

          positions.forEach(function (position) {
            var surprise, volet;

            jourCourant = (jourCourant + 1) % 31 || 31;
            if (jourCourant >= 25 || jourCourant < 21) {
              surprise = creeSurprise(position, jourCourant);
              volet = creeVolet(position, jourCourant);
              $calendrier.append(volet);

              add_click($calendrier, volet, surprise, jourCourant);
            }
          });
        },

        construis_les_positions = function () {
          var positions = [];
          for (var row = 0; row < nbLignes; row++) {
            for (var column = 0; column < nbColonnes; column++) {
              positions.push({left: largeur * column, top: hauteur * row});
            }
          }
          return positions;
        },


        ajuste_la_taille_des_cases = function () {
          $('head').append('<style>'
          + '.case {'
          + 'height:' + (hauteur - 4) + '%;'
          + 'width:' + (largeur - 2) + '%;'
          + '}'
          + '.numero {'
          + 'height:' + (hauteur - 2) + '%;'
          + 'width:' + (largeur - 1) + '%;'
          + '}'
          + '</style>')
        }

        construis_les_cases();
        ajuste_la_taille_des_cases();
      }

  exports.construis_le_calendrier = construis_le_calendrier;
  exports.voletEstAvantDate = voletEstAvantDate;

})(objetPublic());
