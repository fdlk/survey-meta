// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"

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

export function attribute2element(attribute: Attribute): AnyElement {
  const result: any = {
    name: attribute.name,
    title: attribute.label,
    isRequired: !attribute.nillable,
    visible: attribute.visible
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
        inputType:'email'
      }
    case "HYPERLINK":
      return {
        ...result,
        type: "text",
        inputType:'url'
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
