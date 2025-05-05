import re
import inflection

LANGS = ['en', 'ro', 'ru']

def camelize(data):
  is_translatable = lambda key: any(key.endswith('_' + lang) for lang in LANGS)
  
  if isinstance(data, list):
    return [camelize(item) for item in data]
  elif isinstance(data, dict):
    camelized_data = {}
    camelised = set()
    for k, v in data.items():
      if is_translatable(k):
        lang = k.split('_')[-1]
        camelised_k = inflection.camelize(k.replace('_' + lang, ''), False)
        if camelised_k not in camelised:
          camelized_data[camelised_k] = {lang: '' for lang in LANGS}
          camelised.add(camelised_k)
        camelized_data[camelised_k][lang] = v
      else:
        camelized_data[inflection.camelize(k, False)] = v if k == 'price' else camelize(v)
    return camelized_data
  return data

def pythonize(data):
  if isinstance(data, list):
    return [pythonize(item) for item in data]
  elif isinstance(data, dict):
    return {inflection.underscore(k): pythonize(v) for k, v in data.items()}
  return data