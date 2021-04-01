export interface Validator {
  type: 'number' | 'text'
  minValue?: number
  maxValue?: number
  maxLength?: number
}

export interface Element {
  type?: string
  name: string
  title: string
  description?: string
  isRequired?: boolean
  visible?: boolean
  validators?: Validator[]
}

export interface BooleanElement extends Element {
  type: "boolean"
}

export interface CommentElement extends Element {
  type: "comment"
}

export interface TextElement extends Element {
  type: "text"
  placeHolder?: string
  inputType?: "color" | "date" | "datetime" | "datetime-local" |
  "email" | "month" | "number" | "password" | "range" | "tel" |
  "text" | "time" | "url" | "week"
}

export type Choice = {
  value: string
  text: string
}

export interface RadioElement extends Element {
  type: "radiogroup"
  choices: Choice[]
}

export interface CheckboxElement extends Element {
  type: "checkbox"
  choices: Choice[]
}

export interface PanelElement extends Element {
  type: "panel"
  elements: AnyElement[]
}

export interface PageElement extends Element {
  elements: AnyElement[]
}

export type AnyElement = BooleanElement | CommentElement | TextElement |
  RadioElement | CheckboxElement | PanelElement | PageElement