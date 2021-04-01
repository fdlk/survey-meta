// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"

import "core-js/proposals/string-replace-all"
import type { Attribute, EntityType } from "./EMX";
import { AnyElement, PageElement, Validator } from "./survey";

export default function emx2survey(emx: EntityType): any {
  const pages: PageElement[] = []
  const elements: AnyElement[] = emx.meta.attributes.map(attribute2element)
  let page: PageElement | null = null
  for (const element of elements) {
    if (element.type === 'panel') {
      page = {
        name: element.name,
        title: element.title,
        elements: element.elements
      }
      if (element.description) {
        page.description = element.description
      }
      pages.push(page)
    } else {
      if (page === null) {
        page = {
          name: "page-" + pages.length + 1,
          title: "Page " + pages.length + 1,
          elements: []
        }
      }
      page.elements.push(element)
    }
  }
  return {
    pages,
    "showProgressBar": "top",
    "checkErrorsMode": "onValueChanged"
  }
}

export function convertOp(op: string, not: boolean): string {
  switch (op) {
    case 'eq': return not ? "!=" : "="
    case 'ge': return not ? "<" : ">="
    default: throw new Error("Unknown operator: " + op)
  }
}

export function convertDollar(attr: string, age:string | undefined): string {
  if (age) {
    return `age(${convertDollar(attr, undefined)})`
  } else {
    return `{${attr}}`
  }
}

export function convertExpression(expression: string): string {
  const regexOp = /\$\('(\w+)'\)(\.age\(\))?\.(eq|ge)\(('?\w+'?)\)(\.not\(\))?\.value\(\)/gm
  let result = expression.replace(regexOp, (_, attr, age, op, value, not) =>
    `${convertDollar(attr, age)}${convertOp(op, !!not)}${value}`)

  const regexisisis = /\$\('(\w+)'\)(\.age\(\))?\.value\(\)\s*===\s*('?\w+'?)/gm
  result = result.replace(regexisisis, (_, attr, age, value) =>
    `${convertDollar(attr, age)}=${value}`)

  const regexindexof = /\$\('(\w+)'\)\.value\(\)\.indexOf\(('?\w+'?)\)\s*>\s*-1/gm
    result = result.replace(regexindexof, (_, attr, value) =>
      `{${attr}} contains ${value}`)

  return result.replaceAll('===', '=').replaceAll('==', '=')
}

export function attribute2element(attribute: Attribute): AnyElement {
  const result: any = {
    name: attribute.name,
    title: attribute.label,
    isRequired: !attribute.nillable
  }
  if (attribute.description) {
    result.description = attribute.description.replace(/(\r\n|\n|\r)/gm, "")
  }
  result.validators = []
  if (attribute.range) {
    const rangeValidator: any = {
      type: "numeric"
    }
    if ('min' in attribute.range) {
      rangeValidator.minValue = attribute.range.min
    }
    if ('max' in attribute.range) {
      rangeValidator.maxValue = attribute.range.max
    }
    result.validators = [...result.validators, rangeValidator]
  }
  if (attribute.hasOwnProperty('maxLength')) {
    const maxLengthValidator: Validator = {
      type: "text",
      maxLength: attribute.maxLength
    }
    result.validators = [...result.validators, maxLengthValidator]
  }
  if (attribute.visibleExpression) {
    result.visibleIf = convertExpression(attribute.visibleExpression)
  } else {
    result.visible = attribute.visible
  }
  switch (attribute.fieldType) {
    case "BOOL":
      return {
        ...result,
        type: "boolean"
      }
    case "TEXT":
      return {
        ...result,
        type: "comment"
      }
    case "STRING":
      return {
        ...result,
        type: "text"
      }
    case "EMAIL":
      return {
        ...result,
        type: "text",
        inputType: 'email'
      }
    case "HYPERLINK":
      return {
        ...result,
        type: "text",
        inputType: 'url'
      }
    case "DECIMAL":
    case "INT":
      return {
        ...result,
        type: "text",
        inputType: "number"
      }
    case "DATE":
      return {
        ...result,
        type: "text",
        inputType: "date"
      }
    case "DATE_TIME":
      return {
        ...result,
        type: "text",
        inputType: "datetime"
      }
    case "CATEGORICAL": {
      return {
        ...result,
        type: "radiogroup",
        choices: (attribute.categoricalOptions || []).map((option) => ({
          text: option.label,
          value: option.id
        }))
      }
    }
    case "ENUM": {
      return {
        ...result,
        type: "radiogroup",
        choices: (attribute.enumOptions || []).map((option) => ({
          text: option,
          value: option
        }))
      }
    }
    case "CATEGORICAL_MREF": {
      return {
        ...result,
        type: "checkbox",
        choices: (attribute.categoricalOptions || []).map((option) => ({
          text: option.label,
          value: option.id
        }))
      }
    }
    case "COMPOUND": {
      return {
        ...result,
        type: "panel",
        elements: attribute.attributes.map(attribute2element)
      }
    }
  }
}
