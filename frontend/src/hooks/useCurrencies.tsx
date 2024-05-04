import { useEffect, useState } from "react"
import { Price } from "../JSONTypes"
import { useCookies } from "react-cookie"

export function useCurrencies(): Array<keyof Price> {
  const [cookies, setCookie, removeCookie] = useCookies(['country'])
  const allCurrencies: {[key: string]: Array<keyof Price>} = {
    'MD': ['MDL', 'EUR'],
    'RO': ['RON', 'EUR'],
    'US': ['USD', 'EUR']
  }
  const [currencies, setCurrencies] = useState<Array<keyof Price>>(allCurrencies['MD'])

  useEffect(() => {
    if (cookies.country && ['RO', 'US'].includes(cookies.country)) {
      setCurrencies(cookies.country)
    } else {
      setCurrencies(allCurrencies.MD)
    }
  }, [cookies.country])

  return currencies
}