/*!***************************************************
 * google-translate.js v1.0.4
 * https://Get-Web.Site/
 * author: Vitalii P.
 *****************************************************/

const googleTranslateConfig = {
	/* Original language */
	lang: "ru",

	/* The language we translate into on the first visit*/
	/* Язык, на который переводим при первом посещении */
	 langFirstVisit: 'ru', 

	/* Если скрипт не работает или работает неправильно, раскомментируйте и укажите основной домен в свойстве domain */
	/* If the script does not work or does not work correctly, uncomment and specify the main domain in the domain property */
	/* domain: "Get-Web.Site" */
};

$(function () {
	/* Подключаем виджет google translate */
	/* Connecting the google translate widget */
	let script = document.createElement("script");
	script.src = `https://translate.google.com/translate_a/element.js?cb=TranslateWidgetIsLoaded`;
	/*script.src = `file:///C:/Users/opilane/Desktop/google-translate-custom-widget-master/jquery/js/translate.js`;*/
	document.getElementsByTagName("head")[0].appendChild(script);
});

function TranslateWidgetIsLoaded() {
	TranslateInit(googleTranslateConfig);
}

function TranslateInit(config) {
	if (config.langFirstVisit && !$.cookie("googtrans")) {
		/* Если установлен язык перевода для первого посещения и куки не назначены */
		/* If the translation language is installed for the first visit and cookies are not assigned */
		TranslateCookieHandler("/auto/" + config.langFirstVisit);
	}

	let code = TranslateGetCode(config);

	TranslateHtmlHandler(code);

	if (code == config.lang) {
		/* Если язык по умолчанию, совпадает с языком на который переводим, то очищаем куки */
		/* If the default language is the same as the language we are translating into, then we clear the cookies */
		TranslateCookieHandler(null, config.domain);
	}

	/* Инициализируем виджет с языком по умолчанию */
	/* Initialize the widget with the default language */
	new google.translate.TranslateElement({
		pageLanguage: config.lang,
	});

	/* Вешаем событие  клик на флаги */
	/* Assigning a handler to the flags */
	$("[data-google-lang]").click(function () {
		TranslateCookieHandler(
			"/auto/" + $(this).attr("data-google-lang"),
			config.domain
		);
		/* Перезагружаем страницу */
		/* Reloading the page */
		window.location.reload();
	});
}

function TranslateGetCode(config) {
	/* Если куки нет, то передаем дефолтный язык */
	/* If there are no cookies, then we pass the default language */
	let lang =
		$.cookie("googtrans") != undefined && $.cookie("googtrans") != "null"
			? $.cookie("googtrans")
			: config.lang;
	return lang.match(/(?!^\/)[^\/]*$/gm)[0];
}

function TranslateCookieHandler(val, domain) {
	/* Записываем куки /язык_который_переводим/язык_на_который_переводим */
	/* Writing down cookies /language_for_translation/the_language_we_are_translating_into */
	$.cookie("googtrans", val);
	$.cookie("googtrans", val, {
		domain: "." + document.domain,
	});

	if (domain == "undefined") return;
	/* записываем куки для домена, если он назначен в конфиге */
	/* Writing down cookies for the domain, if it is assigned in the config */
	$.cookie("googtrans", val, {
		domain: domain,
	});

	$.cookie("googtrans", val, {
		domain: "." + domain,
	});
}

function TranslateHtmlHandler(code) {
	/* Получаем язык на который переводим и производим необходимые манипуляции с DOM */
	/* We get the language to which we translate and produce the necessary manipulations with DOM */
	$('[data-google-lang="' + code + '"]').addClass("language__img_active");
}