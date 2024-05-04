export function getLink(subCategory: string, filter = '')  {
  let url = `/catalog/${subCategory}`
  if (filter != '') {
    url += '/' + filter
  }
  return url
}