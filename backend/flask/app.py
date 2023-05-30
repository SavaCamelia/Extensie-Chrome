from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import SQLAlchemy as ORM
from sqlalchemy.orm import joinedload
import sqlalchemy
import datetime
import  urllib.parse
from decimal import Decimal

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://extensie_chrome:extensie_chrome@localhost:3306/extensie_chrome'
db = ORM.UnlockedAlchemy(app)


@app.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    return response


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/periuta')
def test_periuta():
    query = ORM.Product.query.options(joinedload('prices'))
    r = ''
    for product in query:
        r = r + product.name
        for price in product.prices:
            r = r + str(price.value)
    return r


@app.route('/products/info')
def get_product_info():
    cod_utilizator = request.args.get("userCode")
    cod_produs = request.args.get("productCode")
    produs = ORM.Product.query.filter_by(barcode=cod_produs).first()
    if produs is None:
        return {'success': False, 'error': "Produsul nu exista in baza de date"}
    log = ORM.Log(tip='info', mesaj='a fost vizualizat produsul '+str(produs.id)+' prin codul '+cod_produs, date_suplimentare=cod_produs, moment=datetime.datetime.now(), user_code=cod_utilizator)
    db.session.add(log)
    db.session.commit()

    preturi_curente = []

    query_preturi_curente = db.engine.execute("SELECT p1.*, s.name AS site_name, s.url AS site_url FROM (prices p1 LEFT JOIN sites s ON s.id = p1.site_id) RIGHT JOIN (SELECT site_id, MAX(DATE) AS last_date FROM prices WHERE product_id = '"+str(produs.id)+"' GROUP BY site_id) p2 ON p1.product_id='"+str(produs.id)+"' AND p1.site_id=p2.site_id AND p1.date = p2.last_date")

    for pret in query_preturi_curente:
        dict_pret = {}
        dict_pret['site'] = {'name': pret.site_name, 'address': pret.site_url}
        dict_pret['value'] = str(pret.value)
        dict_pret['link'] = pret.link
        dict_pret['date'] = str(pret.date)
        preturi_curente.append(dict_pret)

    r = {}
    r['success'] = True
    r['productCode'] = produs.barcode
    r['name'] = produs.name
    r['currentPrices'] = preturi_curente
    if cod_utilizator is None:
        r['notice'] = 'utilizarea functiilor API fara un cod de utilizator va fi in curand restrictionata'
    return r


@app.route('/products/history')
def get_product_history():
    url = request.args.get("url")
    cod_utilizator = request.args.get("userCode")
    cod_produs = request.args.get("productCode")
    produs = ORM.Product.query.filter_by(barcode=cod_produs).first()
    if produs is None:
        return {'success': False, 'error': "Produsul nu exista in baza de date"}
    log = ORM.Log(tip='info', mesaj='a fost vizualizat istoricul produsului ' + str(produs.id) + ' prin codul ' + cod_produs,
                     date_suplimentare=cod_produs, moment=datetime.datetime.now(), user_code=cod_utilizator)
    db.session.add(log)
    db.session.commit()

    url_site = urllib.parse.urlparse(url).hostname.replace('www.', '')
    site = ORM.Site.query.filter(ORM.Site.url.like('%'+url_site+'%')).first()

    query_istoric = ORM.Price.query.filter_by(product_id=produs.id, site_id=site.id).order_by(
        sqlalchemy.desc(ORM.Price.date)).filter(
        ORM.Price.date > (datetime.datetime.now() - datetime.timedelta(days=365)))

    istoric_preturi = []
    for pret in query_istoric:
        istoric_preturi.append({'value': str(pret.value), 'date': str(pret.date)})

    r = {}
    r['success'] = True
    r['productCode'] = produs.barcode
    r['name'] = produs.name
    r['site'] = {'name': site.name, 'address': site.url}
    r['history'] = istoric_preturi
    if cod_utilizator is None:
        r['notice'] = 'utilizarea functiilor API fara un cod de utilizator va fi in curand restrictionata'
    return r


@app.route('/products/save', methods=['POST'])
def save_product_info():
    nume = request.form['name']
    adresa = request.form['url']
    valoare = Decimal(request.form['price'])
    cod_utilizator = request.args.get("userCode")
    cod_produs = request.args.get("productCode")

    db.session.add(ORM.Log(tip='info',
                     mesaj='a fost primit un pret nou prin codul ' + cod_produs, date_suplimentare=cod_produs, moment=datetime.datetime.now(), user_code=cod_utilizator))
    db.session.commit()

    url_site = urllib.parse.urlparse(adresa).hostname.replace('www.', '')
    site = ORM.Site.query.filter(ORM.Site.url.like('%' + url_site + '%')).first()

    if site is None:
        db.session.add(ORM.Log(tip='warning',
                                  mesaj='s-a incercat salvarea unui produs cu codul ' + cod_produs + ' de pe un site neacceptat.',
                                  date_suplimentare=adresa, moment=datetime.datetime.now(),
                                  user_code=cod_utilizator))
        db.session.commit()
        return {'success': False, 'error': 'Acest site nu este acceptat'}

    produs = ORM.Product.query.filter_by(barcode=cod_produs).first()
    if produs is None:
        produs = ORM.Product(name=nume, barcode=cod_produs)
        db.session.add(produs)
        db.session.commit()
        db.session.add(ORM.Log(tip='info',
                                  mesaj='a fost adaugat un produs nou cu codul ' + cod_produs,
                                  date_suplimentare=str(produs.id), moment=datetime.datetime.now(),
                                  user_code=cod_utilizator))
        db.session.commit()

    if produs.name != nume:
        db.session.add(ORM.Log(tip='notice',
                                  mesaj='numele produsului cu codul ' + cod_produs + ' pare sa se fi schimbat',
                                  date_suplimentare=nume, moment=datetime.datetime.now(),
                                  user_code=cod_utilizator))
        db.session.commit()

    ultimul_pret = ORM.Price.query.filter_by(product_id=produs.id, site_id=site.id).order_by(sqlalchemy.desc(ORM.Price.date)).first()

    if ultimul_pret is not None and abs(ultimul_pret.value - valoare) < 10 and (datetime.datetime.now() - ultimul_pret.date).days < 1:
        return {'success': True}

    pret = ORM.Price(product_id=produs.id, site_id=site.id, value=valoare, link=adresa, date=datetime.datetime.now(), user_code=cod_utilizator)
    db.session.add(pret)
    db.session.commit()
    db.session.add(ORM.Log(tip='info',
                              mesaj='a fost adaugat un pret pentru produsul cu codul ' + cod_produs,
                              date_suplimentare=str(pret.id), moment=datetime.datetime.now(),
                              user_code=cod_utilizator))

    db.session.commit()

    return {'success': True}




if __name__ == '__main__':
    ORM.db = db
    app.run()
