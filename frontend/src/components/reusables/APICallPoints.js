export function getCategory(name) {
  let url = `/api/category/${name}/`

  return fetchAPI(url);
}

export function getProducts(name, sub_category, filter=null) {
  let url = `/api/products/${name}/${sub_category}/`
  
  if (filter) {
    url += filter + '/'
  }

  return fetchAPI(url);
}

export function getProduct(name, id) {
  let url = `/api/product/${name}/${id}/`

  return fetchAPI(url);
}

function fetchAPI(url) {
  return fetch(url + location.search).then((response) => response.json()).then((data) => {return data});
}