
export type FieldType = (
  "STRING" |
  "COMPOUND" |
  "CATEGORICAL" |
  "DATE" |
  "EMAIL" |
  "HYPERLINK" |
  "BOOL" |
  "INT" |
  "CATEGORICAL_MREF" |
  "DECIMAL" |
  "ENUM" |
  "DATE_TIME" |
  "TEXT"
)

export type CategoricalOption = {
  id: string
  label: string
}

export type Range = {
  min?: number
  max?: number
}

export type Attribute = {
  href: string
  fieldType: FieldType
  name: string
  label: string
  description?: string
  attributes: Attribute[]
  enumOptions?: string[]
  refEntity?: Metadata
  maxLength?: number
  auto: boolean
  nillable: boolean
  readOnly: boolean
  labelAttribute: boolean
  unique: boolean
  visible: boolean
  lookupAttribute: boolean
  isAggregatable: boolean
  range?: Range
  nullableExpression?: string
  validationExpression?: string
  visibleExpression?: string
  categoricalOptions?: CategoricalOption[]
}

export type Metadata = {
  href: string
  hrefCollection: string
  name: string
  label: string
  description?: string
  attributes: Attribute[]
  labelAttribute: string
  idAttribute: string
  lookupAttributes: string[]
  isAbstract: boolean
  writable: boolean
  languageCode: string
  permissions: string[]
}

export type EntityType = {
  href: string
  meta: Metadata
  start: number
  num: number
  total: number
  items: any[]
}