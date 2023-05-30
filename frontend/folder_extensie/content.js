const defaultProductInfo = {
    isValid: false,
    name: 'produs neidentificat',
    productCode: '-',
    price: '-1.00',
    buttonXpath: 'h1'
}
function evomag() {

    var r = defaultProductInfo;
    if ($('.product_name').length) {
        r.isValid = true;

        r.name = $('.product_name').text().trim();
        r.productCode = $('.product_codes > span').first().text().slice(7, -2);
        r.price = $(".product_right .pret_rons").text().slice(0, -4).replace(/\./g, "").replace(/,/g, ".");
        r.buttonXpath = ".product_right .pret_ron";
    }

    return r;
}


function flanco() {

    var r = defaultProductInfo;
    if ($("div[class='partnumber'] > div[class='value']").length) {
        r.isValid = true;

        r.name = $(".product-title").text();
        r.productCode = $("div[class='partnumber'] > div[class='value']").text();
        r.price = $("meta[property='product:price:amount']").prop('content');
        r.buttonXpath = "div[class='product-info-price'] > span[class='price']";
    }

    return r;
}


function cel() {

    var r = defaultProductInfo;
    if ($('#product-name').length) {
        r.isValid = true;

        r.name = $('#product-name').text().trim();
        r.productCode = $('#cod').text();
        r.price = $('#product-price').text() + ".00";
        r.buttonXpath=".pret";
    }

    return r;
}

function fashiondays() {

    var r = defaultProductInfo;
    if ($('#buy-box').length) {
        r.isValid = true;

        r.name = $("#tab_about_the_brand").text().trim() + " " + $(".product-brand-desc").text().trim();
        r.productCode = $("#product_details > span").text();
        r.price = $("#product-box > span.new-price").text().trim().slice(0, -4);
        r.price = r.price.substr(0, r.price.length - 2) + "." + r.price.substr(r.price.length - 2);
        r.buttonXpath=".product-buy-box .new-price";
    }

    return r;
}

function intersport() {

    var r = defaultProductInfo;
    if ($('.pd-box').length) {
        r.isValid = true;

        r.name = $("[data-property='Name']").first().text();
        r.productCode = $(".code:eq(1)").text();
        r.price = $("[itemprop='price']").first().text().slice(0, -4).replace(/\./g, "").replace(/,/g, '.');
        r.buttonXpath = ".pd-box-one  span[itemprop='price']";
    }

    return r;
}

function colectare_date_emag() {
    var r = defaultProductInfo;

    var breadcrumbs = '';
    if ($(".breadcrumb").length)
        breadcrumbs = $(".breadcrumb").text();
    breadcrumbs = breadcrumbs.toLowerCase();
    if ($(".product-code-display").length && $(".page-title").length && !breadcrumbs.includes("supermarket")) {
        r.isValid = true;

        r.name = $(".page-title").first().text().trim();
        r.productCode = $(".product-code-display").first().text().replace("Cod produs", "").replace(":", "").trim();

        r.price = $("div.product-page-pricing p.product-new-price").first().text().toLowerCase().replace("lei", "").replace(/\./g, "").replace(/,/g, '').trim();
        r.price = r.price.substr(0, r.price.length - 2) + "." + r.price.substr(r.price.length - 2);
        r.buttonXpath = "div.product-page-pricing p.product-new-price span";

    }

    return r;
}

function colectare_date_pcgarage() {
    var r = defaultProductInfo;

    var breadcrumbs = '';
    if ($(".breadcrumb").length)
        breadcrumbs = $(".breadcrumb").text();
    breadcrumbs = breadcrumbs.toLowerCase();
    if ($("h1#product_name").length && $("[itemprop='mpn']").length) {
        r.isValid = true;

        r.name = $("h1#product_name").first().text().trim();
        r.productCode = $("[itemprop='mpn']").first().text().trim();

        r.price = $(".ps_sell_price span.price_num").first().text().slice(0, -4).replace(/\./g, "").replace(/,/g, ".").trim();
        r.buttonXpath = ".ps_sell_price span.price_num";
    }

    return r;
}

function colectareDatePcFun() {
        var r = defaultProductInfo;

        if ($(".product-brand").length) {
            r.isValid = true;
            r.name = $("h5")[0].innerText;
            let priceP = $(".product-price")[0].innerText;
            let indexPrice = priceP.indexOf("Lei");
            let newPrice = priceP.slice(0, indexPrice).trim().replace("\.", "");
            newPrice = newPrice.replace(",", ".");
            r.price = newPrice;
            let div = $(".product-brand")[0].innerText;
            let indexProductCode = div.indexOf("\n");
            div = div.slice(16, indexProductCode);
            r.productCode = div;
            r.buttonXpath = '.product-price';
        }
        return r;
}

function colectareDateAsusRomania() {
    var r = defaultProductInfo;

    if ($("#code").length) {
        r.isValid = true;
        r.name = $("h1")[0].innerText;
        r.productCode = $("#code")[0].value;
        let p = $(".price")[1].innerHTML;
        let indexP = p.indexOf("<sup>");
        p = p.slice(0, indexP);
        r.price = p;
        r.buttonXpath = '.price-box.final-price-section span.price';
    }
    return r;
}

function colectareDateDedeman() {
    var r = defaultProductInfo;

    if ($(".product-code").length) {
        r.isValid = true;
        r.name = $("h1")[0].innerText;
        r.productCode = $(".product-code")[0].innerText.slice(12);
        let intPart = $(".bold > .bold")[0].innerText;
        let floatPart = $(".bold > .decimal")[0].innerText;
        if (floatPart.length < 2) {
            floatPart = floatPart + "00";
        }
        r.price = intPart + floatPart;
        r.buttonXpath = $("h1")[0];
    }
    return r;
}

function colectareDateIdeall() {
    var r = defaultProductInfo;
    if ($("#product-main-image").length) {
        r.isValid = true;
        r.name =  $("h1")[0].innerText;
        r.productCode = $("h2")[0].innerText.slice(5);
        let mainP = $("#price_mainprod")[0].innerText;
        let indexP = mainP.indexOf("lei");
        mainP = mainP.slice(0, indexP).trim().replace("\,", "");
        r.price = mainP;
        r.buttonXpath = "#price_mainprod";
    }
    return r;
}

function colectareDateForIt() {
    var r = defaultProductInfo;
    if ($(".lpad-lg").length === 2){
        r.isValid = true;
        r.name = $("h1")[0].innerText;
        r.productCode = $(".lpad-lg")[1].innerText.slice(12);
        let mainP = $(".price-value")[0].innerText.replace("\.", "");
        let indexP = mainP.indexOf("lei");
        mainP = mainP.slice(0, indexP).trim().replace("\,", ".");
        r.price = mainP;
        r.buttonXpath = "h1[itemprop='name']"
    }
    return r;
}


function colectare_date_siteuri() {
    var getBaseURL = window.location.origin;
    getBaseURL = getBaseURL.toLowerCase().replace(/www./, '').replace(/https:\/\//, '').replace(/http:\/\//, '');
    switch (getBaseURL) {
        case "evomag.ro":
            return evomag();
        case "flanco.ro":
            return flanco();
        case "cel.ro":
            return cel();
        case "fashiondays.ro":
            return fashiondays();
        case "intersport.ro":
            return intersport();
        case "emag.ro":
            return colectare_date_emag();
        case "pcgarage.ro":
            return colectare_date_pcgarage();
        case "asusromania.ro" :
            return colectareDateAsusRomania();
        case "dedeman.ro" :
            return colectareDateDedeman();
        case "pcfun.ro" :
            return colectareDatePcFun();
        case "ideall.ro" :
            return colectareDateIdeall();
        case "forit.ro" :
            return colectareDateForIt();
    }
    return defaultProductInfo;
}



$( document ).ready(function() {
    informatii_produs_local = colectare_date_siteuri();
    if(informatii_produs_local.isValid){
        interogare_API_1();
    }

});
const API_URL = "https://preturi.web-sandbox.dev";
var informatii_produs_server = null;
var istoric_preturi_produs = null;
var informatii_produs_local = null;

function interogare_API_1()
{
    $.post(API_URL + "/products/save?productCode="+informatii_produs_local.productCode, {name:informatii_produs_local.name,url:location.href,price:informatii_produs_local.price}, function (result) {
        if(!result.success)
        {
            alert(result.error);
        }
        else {
            console.log("informatii trimise la server");
            inserare_modal();
        }
    });
       

    
}



function inserare_modal() {
    var modalElement = document.createElement("div");
    modalElement.setAttribute("class", "extensie-modal");
    modalElement.innerHTML = '<div class="extensie-modal-content"><iframe style="width: 100% ; height: 100% ; border: none " referrerpolicy="unsafe-url" src="'+chrome.runtime.getURL("modal.html")+'?'+informatii_produs_local.productCode+'"></div>';

    document.body.appendChild(modalElement);

    insertTrigger();

    setInterval(function () {
        if(!document.getElementById('PriceLogTrigger')) {
            insertTrigger();
        }
    }, 1000);

    //<a style="font-family: Helvetica;color:#005eb8;" href="/"><span style="color: #555;">Price</span>Log</a>


    initializare_modal();
}

function insertTrigger()
{
    $(informatii_produs_local.buttonXpath).append('<a id="PriceLogTrigger"  href="javascript:void(0);" style="font-family: Helvetica; font-weight: 600; color:#005eb8; white-space: pre-wrap; line-height: normal; text-decoration: none; cursor: pointer" onclick="document.getElementsByClassName(\'extensie-modal\')[0].style.display = \'block\';"><span style="color: #555; font-family: inherit; font-weight: inherit; font-size: inherit; display: inherit"> Price</span>Log</a>');
}
























