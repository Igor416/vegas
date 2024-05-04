import { Dispatch, ProviderProps, createContext, useReducer } from "react";
import { Price } from "../JSONTypes";

type currencyAction = {
  type: 'updated',
  currency: keyof Price
}

export const CurrencyContext = createContext<keyof Price>('EUR');
export const CurrencyDispatchContext = createContext<Dispatch<currencyAction>>({} as Dispatch<currencyAction>);

function CurrencyReducer(currency: keyof Price, action: currencyAction) {
  switch (action.type) {
    case 'updated': {
      return action.currency
    }
  }
}

export function CurrencyProvider({children, value}: ProviderProps<keyof Price>) {
  const [currency, dispatch] = useReducer(CurrencyReducer, value)
  
  return <CurrencyContext.Provider value={currency}>
    <CurrencyDispatchContext.Provider value={dispatch}>
      {children}
    </CurrencyDispatchContext.Provider>
  </CurrencyContext.Provider>
}