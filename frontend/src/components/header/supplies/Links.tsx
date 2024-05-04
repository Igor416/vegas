export type Category = {
  name: Name
  subCategories: SubCategory[]
}

export type SubCategory = {
  link: string,
  name: Name,
  filters: Filter[]
}

export type Filter = {
  name: Name,
}

export type Name = {
  en: string,
  ru: string,
  ro: string,
  [key: string]: string
}