# coding: utf-8
from flask_sqlalchemy import SQLAlchemy

class UnlockedAlchemy(SQLAlchemy):
    def apply_driver_hacks(self, app, info, options):
        options["isolation_level"] = "READ COMMITTED"
        return super(UnlockedAlchemy, self).apply_driver_hacks(app, info, options)

db = UnlockedAlchemy()

class Log(db.Model):
    __tablename__ = 'logs'

    id = db.Column(db.Integer, primary_key=True)
    tip = db.Column(db.String(15, 'utf8mb4_bin'), nullable=False)
    mesaj = db.Column(db.Text(collation='utf8mb4_bin'), nullable=False)
    date_suplimentare = db.Column(db.Text(collation='utf8mb4_bin'), nullable=False)
    moment = db.Column(db.DateTime, nullable=False)
    user_code = db.Column(db.String(100, 'utf8mb4_bin'))


class Price(db.Model):
    __tablename__ = 'prices'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.ForeignKey('products.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True)
    site_id = db.Column(db.ForeignKey('sites.id', onupdate='CASCADE'), nullable=False, index=True)
    value = db.Column(db.Numeric(8, 2), nullable=False)
    link = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    user_code = db.Column(db.String(100))

    product = db.relationship('Product', primaryjoin='Price.product_id == Product.id', backref='prices')
    site = db.relationship('Site', primaryjoin='Price.site_id == Site.id', backref='prices')



class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    barcode = db.Column(db.String(50), nullable=False)


class Site(db.Model):
    __tablename__ = 'sites'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    url = db.Column(db.String(100), nullable=False)
