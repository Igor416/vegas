export function getBanners() {
  let url = '/news/'

  return fetchAPI(url)
}

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

export function sendForm(data, csrftoken, help=false) {
  for (let key in data) {
    if (data[key] == '') {
      return 'error: empty'
    }
  }

  let options = {
    method: "POST",
    mode: 'cors',
    headers: {
      'X-CSRFToken': csrftoken,
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  }
  
  fetch(`/telegram/order${help ? '_call' : ''}/` + location.search, options).then((response) => response.json())
  .then((data) => {
    alert(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  })
}

async function fetchAPI(url) {
  const response = await fetch(url + location.search);
  const data = await response.json();
  return data;
}