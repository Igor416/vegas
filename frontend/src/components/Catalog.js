import React, { Component } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import LocationListener from "./reusables/LocationListener.js";
import { getCategory, getProducts } from "./reusables/APICallPoints.js";
import SectionImage from "./reusables/SectionImage.js";
import Sorting from "./catalog/Sorting.js";
import Layout from "./catalog/Layout.js";

function withParams(Component) {
  return props => <Component {...props} params={useParams()} context={useOutletContext()} />;
}

class Catalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isGrid: true,
      lang: this.props.context.lang,
      currency: this.props.context.currency,
      category: {
        name: this.props.params.category
      },
      sub_category: this.props.params.sub_category,
      filter: this.props.params.filter
    }

    this.updateProducts = this.updateProducts.bind(this);
    this.updateCurrency = this.updateCurrency.bind(this);
    this.changeLayout = this.changeLayout.bind(this);
  }

  updateProducts(path) {
    let lang = path.search.replace('?lang=', '');
    let params = path.pathname.slice(1).split('/') //['catalog', '<category>', '<sub_category>', '<?filter>']

    this.setState({
      lang: lang,
      category: {
        name: params[1]
      },
      sub_category: params[2],
      filter: params.length == 4 ? params[3] : null
    }, () => {
      getCategory(this.state.category.name).then((data) => {
        this.setState({
          category: data
        })
      })
      getProducts(this.state.category.name, this.state.sub_category, this.state.filter).then((data) => {
        this.setState({
          products: data
        })
      })
    })
  }

  updateCurrency(currency) {
    this.setState({
      currency: currency
    })
    this.props.context.updateCurrency(currency)
  }

  changeLayout() {
    this.setState({
      isGrid: !this.state.isGrid
    })
  }

  render() {
    let props = {
      currency: this.state.currency,
      isGrid: this.state.isGrid,
      lang: this.state.lang
    }
    let extended_props = Object.assign({
      category: this.state.category,
      products: this.state.products
    }, props)

    return (
      <div>
        <LocationListener locationChanged={this.updateProducts} />
        <SectionImage category={this.state.category} />
        <div className="container-fluid">
          <div className="row px-5 py-4">
            <div className="col-1"></div>
            <div className="col-10">
              <Sorting updateCurrency={this.updateCurrency} changeLayout={this.changeLayout} {...props} />
              {this.state.products && 
              <Layout {...extended_props} />
              }
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(Catalog);
