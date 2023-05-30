const API_URL = "https://preturi.web-sandbox.dev";
var informatii_produs_server;
var istoric_preturi_produs;

$(document).ready(function () {
    interogare_API_2();

});

function interogare_API_2() {
    var productCode = location.search.replace("?", "");
    $.get(API_URL + "/products/info?productCode=" + productCode, function (result) {
        if (!result.success) {
            alert(result.error);
        } else {
            informatii_produs_server = {
                productCode: result.productCode,
                name: result.name,
                currentPrices: result.currentPrices
            };

            inserare_informatii();
            $.get(API_URL + "/products/history?productCode=" + productCode + "&url=" + encodeURI(document.referrer), function (result) {
                if (!result.success) {
                    alert(result.error);
                } else {
                    istoric_preturi_produs = {
                        productCode: result.productCode,
                        name: result.name,
                        site: result.site,
                        history: result.history
                    };
                    inserare_istoric();
                }

            });
        }
    });


}

function inserare_informatii() {
    // ia valorile din informatii_produs_server si le insereaza in pagina
    var containerPreturi = $("#container-preturi");
    containerPreturi.empty();
    for (var i = 0; i < informatii_produs_server.currentPrices.length; i++) {
        var pretCurent = informatii_produs_server.currentPrices[i];
        containerPreturi.append('<tr><td>' + pretCurent.site.name + '</td><td>' + pretCurent.value + ' RON</td><td><a target="_blank" href="' + pretCurent.link + '">Open</a></td><td>' + pretCurent.date + '</td></tr>');

    }

}

function inserare_istoric() {
    // ia istoricul preturilor din istoric_preturi_produs si il insereaza in pagina
    var puncteGrafic = [];
    for (let pret of istoric_preturi_produs.history) {
        puncteGrafic.push({x: new Date(pret.date), y: pret.value});
    }
    console.dir(puncteGrafic);
    // console.log(puncteGrafic);
    var canvasGrafic = $("#graficIstoric").get(0);
    var timeFormat = 'YYYY-MM-DD HH:MM:SS'
    var grafic = new Chart(canvasGrafic, {
        type: "line",
        options: {
            scales: {
                xAxes: [{
                    type: "time",
                    time: {
                        //format: timeFormat,
                        tooltipFormat: 'll'
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'Date'
                    }
                }],
            }
        }
        ,
        data: {
            datasets: [{
                label: "Istoric Prețuri",
                fill: false,
                pointBackgroundColor: "#ffffff",
                pointBorderColor: "#1d84c6",
                data: puncteGrafic,
                borderWidth: 3,
                borderColor: ["#1d84c6"]
            }]

        }
    });
}

