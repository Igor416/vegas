import React, { Component } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie'
import { getCategory, getProduct, sendForm } from "./reusables/APICallPoints.js";
import { currencies } from "./reusables/Globals.js";
import LocationListener from "./reusables/LocationListener.js";
import CustomPhoneInput from "./reusables/CustomPhoneInput.js";
import CustomButton from "./reusables/CustomButton.js";

function withParams(Component) {
  return props => <Component {...props} context={useOutletContext()} />;
}

class Cart extends Component {
  constructor(props) {
    super(props);

    this.isMobile = this.props.context.isMobile
    this.state = {
      lang: this.props.context.lang,
      raw_products: this.props.context.cart.products,
      products: [],
      form: {
        name: '',
        town: '',
        address: '',
        phone: '',
        payment: '',
        courier: true
      },
      error: false
    }
    
    this.fields = ['name', 'town', 'address']

    this.updateProducts = this.updateProducts.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  updateProducts(path) {
    let lang = path.search.replace('?lang=', '');

    this.setState({
      lang: lang,
      products: []
    }, () => {
      let products = this.state.products;
      for (let raw_product of this.state.raw_products) {
        let product, category;
        getCategory(raw_product.category).then((data) => {
          category = data;
          getProduct(raw_product.category, raw_product.id).then((data) => {
            product = Object.assign({
              category: category,
              quantity: raw_product.quantity,
              size: this.extractSize(data.sizes, raw_product.size)
            }, data);
            for (let currency of currencies) {
              product['sum' + currency] = raw_product['sum' + currency]
            }
            products.push(product)
            
            this.setState({
              products: products
            })
          })
        })
      }
    })
  }

  extractSize(sizes, dimensions) {
    let [width, length] = dimensions.split(' x ')

    for (let size of sizes) {
      if (size.width == width && size.length == length) {
        return size
      }
    }
  }

  updateQuantity(category, id, quantity) {
    this.props.context.updateQuantity(category.name, id, quantity)

    let products = this.state.products
    let product = products.filter(pr => pr.category.name == category.name && pr.id == id)[0]
    for (let currency of currencies) {
      product['sum' + currency] = product['sum' + currency] * quantity / product.quantity
    }
    product.quantity = quantity
    products[products.indexOf(product)] == product

    this.setState({
      products: products
    })
  }

  updateForm(key, value) {
    let changedForm = {...this.state.form}
    changedForm[key] = value
    this.setState({
      form: changedForm
    })
  }

  submitForm() {
    let r = sendForm(Object.assign({
      products: this.state.raw_products,
      total: this.props.context.cart.total + ` (${this.props.context.currency})`
    }, this.state.form), Cookies.get('csrftoken'))

    if (r == 'error: empty') {
      this.setState({
        error: true
      })
    }
  }

  deleteProduct(category, product, size) {
    size = size.width + ' x ' + size.length
    let products = this.state.raw_products

    this.setState({
      raw_products: products.filter(pr => !(pr.id == product.id && pr.category == category && pr.size == size))
    }, () => this.updateProducts(location))

    this.props.context.deleteProduct(category, product.id, size)
  }

  render() {
    const t = this.props.t
    return (
      <div className="mt-5">
        <LocationListener locationChanged={this.updateProducts} />
        <div className="container-fluid d-flex mt-5 mb-5 px-2 py-1 mb-sm-0 px-sm-5 py-sm-4">
          <div className="col-sm-1"></div>
          {this.state.products[0] &&
          <div className="col-12 col-sm-10 pt-0 pt-sm-5">
            <div className="d-flex flex-column">
              <div className="d-flex flex-row justify-content-between">
                <span className={"h5" + (this.isMobile ? " border-bottom" : "")}>{t('cart')}</span>
              </div>
              {!this.isMobile &&
              <div
                style={{backgroundColor: 'var(--dark-cyan)'}}
                className="text-white row align-items-center text-center mt-3 rounded-pill"
              >
                <div className="col-2 h6 py-3 border-end border-white m-0">
                  <span>{t('name')}: </span>
                </div>
                <div className="col-3 h6 py-3 border-end border-white m-0">
                  <span>{t('shortcut')}: </span>
                </div>
                <div className="col-2 h6 py-3 border-end border-white m-0">
                  <span>{t('size')}: </span>
                </div>
                <div className="col-1 h6 py-3 border-end border-white m-0">
                  <span>{t('price')}: ({this.props.context.currency})</span>
                </div>
                <div className="col-1 h6 py-3 border-end border-white m-0">
                  <span>{t('discount')}: </span>
                </div>
                <div className="col-2 h6 py-3 border-end border-white m-0">
                  <span>{t('quantity')}: </span>
                </div>
                <div className="col-1 h6 py-3 m-0">
                  <span>{t('total')}: </span>
                </div>
              </div>
              }
              {this.state.products.map((pr, index) => {
              if (this.isMobile) {
              return (
              <div key={index} className="d-flex flex-column border-bottom">
                <div className="d-flex row-nowrap p-2">
                  <img className="col-6" src={pr.shortcut} />
                  <div className="d-flex flex-column col-6 align-items-centers pt-3">
                    <div className="d-flex row-nowrap">
                      <span>{pr.category.name_s} {pr.name}</span>
                      <span
                        style={{color: 'var(--lime-green)'}}
                        className="link h5"
                        onClick={() => this.deleteProduct(pr.category.name, pr, pr.size)}
                      >
                        &nbsp; <FontAwesomeIcon icon='trash' />
                      </span>
                    </div>
                    <span>{t('size')} {pr.size.width} x {pr.size.length}</span>
                    {pr.discount != 0 &&
                    <span style={{ color: 'var(--deep-sky-blue)' }}>{pr.discount} %</span>
                    }
                  </div>
                </div>
                <div className="d-flex row-nowrap justify-content-around align-items-center p-2">
                  <div style={{border: '1px solid var(--lime-green)'}} className="d-flex flex-row justify-content-between align-items-center p-3 h5">
                    <div onClick={() => this.updateQuantity(pr.category, pr.id, pr.quantity == 1 ? pr.quantity : pr.quantity - 1)}>
                      <span>-</span>
                    </div>
                    <div style={{width: '2rem'}} className="d-flex justify-content-center">
                      <span>{pr.quantity}</span>
                    </div>
                    <div onClick={() => this.updateQuantity(pr.category, pr.id, pr.quantity == 99 ? pr.quantity : Number(pr.quantity) + 1)}>
                      <span>+</span>
                    </div>
                  </div>
                  <span style={{ color: 'var(--deep-sky-blue)' }} className="h6">
                    {t('price')}: {pr['sum' + this.props.context.currency]} ({this.props.context.currency})
                  </span>
                </div>
              </div>
              )}
              return (
              <div key={index} className="row">
                <div className="col-2 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0">
                  <span>{pr.category.name_s} {pr.name}</span>
                  <span
                    style={{color: 'var(--lime-green)'}}
                    className="link"
                    onClick={() => this.deleteProduct(pr.category.name, pr, pr.size)}
                  >
                    &nbsp; <FontAwesomeIcon icon='trash' />
                  </span>
                </div>
                <div className="col-3 border-bottom border-end">
                  <img src={pr.shortcut} />
                </div>
                <div className="col-2 h6 d-flex align-items-center justify-content-center border-bottom border-end m-0">
                  <span>{t('size')} {pr.size.width} x {pr.size.length}</span>
                </div>
                <div className="col-1 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0">
                  <span>{pr.size['price' + this.props.context.currency]}</span>
                </div>
                <div className="col-1 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0">
                  <span style={{ color: 'var(--deep-sky-blue)' }}>{pr.discount} %</span>
                </div>
                <div className="col-2 h6 d-flex align-items-center justify-content-center border-bottom border-end m-0">
                  <div style={{border: '1px solid var(--lime-green)'}} className="d-flex flex-row justify-content-between align-items-center p-3 h5">
                    <div onClick={() => this.updateQuantity(pr.category, pr.id, pr.quantity == 1 ? pr.quantity : pr.quantity - 1)}>
                      <span>-</span>
                    </div>
                    <div style={{width: '2rem'}} className="d-flex justify-content-center">
                      <span>{pr.quantity}</span>
                    </div>
                    <div onClick={() => this.updateQuantity(pr.category, pr.id, pr.quantity == 99 ? pr.quantity : Number(pr.quantity) + 1)}>
                      <span>+</span>
                    </div>
                  </div>
                </div>
                <div className="col-1 h5 d-flex align-items-center justify-content-center border-bottom m-0">
                  <span style={{ color: 'var(--deep-sky-blue)' }}>{pr['sum' + this.props.context.currency]}</span>
                </div>
              </div>
              )})}
              <div className="row text-center">
                <Link to={"/" + location.search} className={"d-flex justify-content-center no-link col-6 col-sm-2 pt-3" + (this.isMobile ? "" : "border-end")}>
                  <CustomButton text={t('add')} color="lime-green"/>
                </Link>
                {!this.isMobile && <div className="col-9 border-end"></div>}
                <div style={{ color: 'var(--deep-sky-blue)' }} className="col-6 col-sm-1 d-flex justify-content-center align-items-center h5 m-0">
                  <span>{this.props.context.cart.total} ({this.props.context.currency})</span>
                </div>
              </div>
            </div>
            <div style={{border: this.isMobile ? '' : '1px solid var(--deep-sky-blue)'}} className="d-flex flex-column mt-5 p-0 p-sm-5">
              <span className="h6 text-danger">{this.state.error ? t('error') : ''}</span>
              <div className={(this.isMobile ? "flex-column" : "row-nowrap") + " d-flex"}>
                <div className="d-flex col-sm-5 flex-column">
                  <div>
                  {['nickname', 'town', 'address'].map((field, index) => {
                  if (field != 'payment') {
                  return(
                    <div key={index}>
                      <label htmlFor={field}>{t(field)}</label>
                      <input
                        name={field}
                        value={this.state.form[field]}
                        onChange={e => this.updateForm(field, e.target.value)}
                        type="text"
                        style={{border: 'none', borderBottom: '1px solid var(--lime-green)'}}
                        className="outline-0 no-hover w-100 px-0 mb-3 col-12"
                      />
                    </div>
                  )}})}
                  <CustomPhoneInput lang={this.state.lang} color='lime-green' phone={this.state.form.phone} setPhone={phone => this.updateForm('phone', phone)} />
                  </div>
                </div>
                {!this.isMobile && <div className="col-1"></div>}
                <div className="d-flex flex-column col-sm-3 mt-3 mt-sm-0">
                {[1, 2, 3].map((num, index) => {
                return (
                  <div
                    key={index}
                    className="d-flex justify-content-start row-nowrap pb-3 mb-4"
                    style={{border: 'none', borderBottom: '1px solid var(--lime-green)'}}
                  >
                    <input
                      name='payment'
                      value={t('payment' + num)}
                      className="me-3"
                      onClick={() => {this.updateForm('payment', t('payment' + num))}}
                      type="radio"
                    />
                    <label htmlFor='payment'>{t('payment' + num)}</label>
                  </div>
                )})}
                </div>
                <div className="d-flex row-nowrap justify-content-end align-items-start col-sm-3 mt-3 mt-sm-0">
                  <div
                    onClick={() => this.updateForm('courier', true)}
                    style={{border: '1px solid var(--deep-sky-blue)', borderRight: 'none'}}
                    className={(this.state.form.courier ? "form-button-active" : "form-button-unactive") + " p-3 transition"}
                  >
                    <span>{t('courier')}</span>
                  </div>
                  <div
                    onClick={() => this.updateForm('courier', false)}
                    style={{border: '1px solid var(--deep-sky-blue)', borderLeft: 'none'}}
                    className={(!this.state.form.courier ? "form-button-active" : "form-button-unactive") + " p-3 transition"}
                  >
                    <span>{t('pickup')}</span>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3 mt-sm-0" onClick={this.submitForm}>
                <CustomButton color="deep-sky-blue" text={t('submit')} />
              </div>
            </div>
          </div>
          }
          <div className="col-sm-1"></div>
        </div>
      </div>
    );
  }
}

export default withTranslation('cart')(withParams(Cart));
