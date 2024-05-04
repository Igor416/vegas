import { useState } from "react";

export function useForm<T>(apiCallback: (data: T) => Promise<T> | string) {
  const [data, setData] = useState<T>({} as T)
  const [error, setError] = useState(false)
  const [response, setResponse] = useState<T>()

  const toDefault = () => {
    setError(false)
    setResponse(undefined)
  }

  const updateFields = (keys: Array<keyof T>, values: Array<any>) => {
    const copy = {...data}
    for (let i = 0; i < keys.length; i++) {
      data[keys[i]] = values[i]
    }
    setData(copy)
    toDefault()
  }

  const updateField = (key: keyof T, value: any) => {
    const copy = {...data}
    data[key] = value
    setData(copy)
    toDefault()
  }

  const submitForm = () => {
    const r = apiCallback(data)

    if (typeof r === 'string') {
      setError(true)
    } else {
      r.then(setResponse)
    }
  }

  return {
    data: data,
    error: error,
    response: response,
    updateField: updateField,
    updateFields: updateFields,
    submitForm: submitForm
  }
}