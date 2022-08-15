import React, { Component } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { StyleSheet, css } from 'aphrodite';
import { withTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie'
import { getCategory, getProduct, sendForm } from "./reusables/APICallPoints.js";
import { currencies } from "./reusables/Globals.js";
import LocationListener from "./reusables/LocationListener.js";
import CustomPhoneInput from "./reusables/CustomPhoneInput.js";
import CustomButton from "./reusables/CustomButton.js";

const buttonStyles = StyleSheet.create({
  active: {
    color: 'white',
    backgroundColor: 'var(--deep-sky-blue)'
  },
  unactive: {
    color: 'var(--dark)',
    backgroundColor: 'white'
  }
})

function withParams(Component) {
  return props => <Component {...props} context={useOutletContext()} />;
}

class Cart extends Component {
  constructor(props) {
    super(props);

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
      <div>
        <LocationListener locationChanged={this.updateProducts} />
        <div className="container-fluid mt-5">
          <div className="row px-5 py-4 mt-5 border-top">
            <div className="col-1"></div>
            {this.state.products[0] &&
            <div className="col-10 pt-5">
              <div className="d-flex flex-column">
                <div className="d-flex flex-row justify-content-between">
                  <span className="h5">{t('cart')}</span>
                </div>
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
                {this.state.products.map((pr, index) => {
                return (
                <div key={index} className="row">
                  <div className="col-2 h5 d-flex align-items-center justify-content-center border-bottom border-end m-0">
                    <span>{pr.name} ({pr.category.name_s}) &nbsp;</span>
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
                    <span>{t('size')}{pr.size.width} x {pr.size.length}</span>
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
                  <Link to={"/" + location.search} className="d-flex justify-content-center no-link col-2 pt-3 border-end">
                    <CustomButton text={t('add')} color="limeGreen"/>
                  </Link>
                  <div className="col-9 border-end"></div>
                  <div style={{ color: 'var(--deep-sky-blue)' }} className="col-1 d-flex justify-content-center align-items-center h5 m-0">
                    <span>{this.props.context.cart.total} ({this.props.context.currency})</span>
                  </div>
                </div>
              </div>
              <div style={{border: '1px solid var(--deep-sky-blue)'}} className="d-flex flex-column mt-5 p-5">
                <span className="h6 text-danger">{this.state.error ? t('error') : ''}</span>
                <div className="row">
                  <div className="d-flex col-5 flex-column">
                    <div>
                    {['nickname', 'town', 'address'].map((field, index) => {
                    if (field != 'payment') {
                    return(
                      <div key={index}>
                        <label htmlFor={field}>{t(field)}</label>
                        <input
                          name={field}
                          value={this.state.form[field]}
                          onChange={e => updateData(field, e.target.value)}
                          type="text"
                          style={{border: 'none', borderBottom: '1px solid var(--lime-green)'}}
                          className="outline-0 no-hover w-100 px-0 mb-3 col-12"
                        />
                      </div>
                    )}})}
                    <CustomPhoneInput lang={this.state.lang} color='lime-green' phone={this.state.form.phone} setPhone={phone => updateData('phone', phone)} />
                    </div>
                  </div>
                  <div className="col-1"></div>
                  <div className="d-flex flex-column col-3">
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
                        onClick={() => {updateData('payment', t('payment' + num))}}
                        type="radio"
                      />
                      <label htmlFor='payment'>{t('payment' + num)}</label>
                    </div>
                  )})}
                  </div>
                  <div className="d-flex row-nowrap justify-content-end align-items-start col-3">
                    <div
                      onClick={() => updateData('courier', true)}
                      style={{border: '1px solid var(--deep-sky-blue)', borderLeft: 'none'}}
                      className={css(this.state.form.courier ? buttonStyles.active : buttonStyles.unactive) + " p-3 transition"}
                    >
                      <span>{t('courier')}</span>
                    </div>
                    <div
                      onClick={() => updateData('courier', false)}
                      style={{border: '1px solid var(--deep-sky-blue)', borderLeft: 'none'}}
                      className={css(!this.state.form.courier ? buttonStyles.active : buttonStyles.unactive) + " p-3 transition"}
                    >
                      <span>{t('pickup')}</span>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end" onClick={this.submitForm}>
                  <CustomButton color="deepSkyBlue" text={t('submit')} />
                </div>
              </div>
            </div>
            }
            <div className="col-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation('cart')(withParams(Cart));
