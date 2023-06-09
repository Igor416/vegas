import Cookies from 'js-cookie'

export default class Form<T> {
  private apiCallback: (data: T, csrftoken: string) => Promise<T> | string

  constructor(apiCallback: (data: T, csrftoken: string) => Promise<T> | string) {
    this.apiCallback = apiCallback;
  }

  updateForm(data: T, key: keyof T, value: any): T {
    data[key] = value
    return {...data}
  }

  submitForm(data: T): Promise<T> | string {
    return this.apiCallback(data, Cookies.get('csrftoken') as string)
  }
}