(function() {
  var DEFAULT_LANG = 'en';
  var STORAGE_KEY = 'impalango-lang';

  function getPreferredLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && TRANSLATIONS.common[stored]) return stored;
    var browserLang = navigator.language.slice(0, 2);
    if (TRANSLATIONS.common[browserLang]) return browserLang;
    return DEFAULT_LANG;
  }

  function applyTranslations(lang) {
    var page = document.body.getAttribute('data-i18n-page');
    var common = TRANSLATIONS.common[lang] || TRANSLATIONS.common[DEFAULT_LANG];
    var pageStrings = (TRANSLATIONS[page] && TRANSLATIONS[page][lang])
                      || (TRANSLATIONS[page] && TRANSLATIONS[page][DEFAULT_LANG]) || {};
    var all = {};
    for (var k in common) all[k] = common[k];
    for (var k in pageStrings) all[k] = pageStrings[k];

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (all[key]) el.textContent = all[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      if (all[key]) el.innerHTML = all[key];
    });

    var disclaimer = document.getElementById('legal-disclaimer');
    if (disclaimer) {
      disclaimer.style.display = (lang === 'en') ? 'none' : 'block';
      if (all.legalDisclaimer) disclaimer.textContent = all.legalDisclaimer;
    }

    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    document.documentElement.setAttribute('lang', lang);

    if (all.pageTitle) {
      document.title = 'ImpaLango — ' + all.pageTitle;
    }

    var select = document.getElementById('lang-select');
    if (select) select.value = lang;

    localStorage.setItem(STORAGE_KEY, lang);
  }

  document.addEventListener('DOMContentLoaded', function() {
    var select = document.getElementById('lang-select');
    if (select) {
      select.addEventListener('change', function() {
        applyTranslations(this.value);
      });
    }
    applyTranslations(getPreferredLang());
  });
})();
