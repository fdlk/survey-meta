import { Attribute } from "../src/EMX"
import { TextElement } from "../src/survey"
import { attribute2element } from "../src/emx2survey"

describe("survey-meta", () => {
  describe("attribute2element", () => {
    describe("BOOL", () => {
      const consent: Attribute = {
        "href":"/api/v2/c6_questionnaire/meta/consent",
        "fieldType":"BOOL",
        "name":"consent",
        "label":"I have read and understood the privacy statement and\nagree with its content",
        "attributes":[
          
        ],
        "auto":false,
        "nillable":true,
        "readOnly":false,
        "labelAttribute":false,
        "unique":false,
        "visible":true,
        "lookupAttribute":false,
        "isAggregatable":false
      }
      it("Converts to type boolean", () => {
        const element = attribute2element(consent)
        expect(element?.type).toEqual("boolean")
      })
    })
    describe("TEXT", () => {
      const comments: Attribute = {
        "href":"/api/v2/c6_questionnaire/meta/comments",
        "fieldType":"TEXT",
        "name":"comments",
        "label":"If you have comments on this questionnaire, for example if you think there is a question missing or if you want to add something to your answers, please write it down here.",
        "attributes":[
          
        ],
        "maxLength":65535,
        "auto":false,
        "nillable":true,
        "readOnly":false,
        "labelAttribute":false,
        "unique":false,
        "visible":true,
        "lookupAttribute":false,
        "isAggregatable":false
      }
      it("Converts to type comment", () => {
        const element = attribute2element(comments)
        expect(element?.type).toEqual("comment")
      })
    })

    describe("STRING", () => {
      const notRelated: Attribute = {
        "href":"/api/v2/c6_questionnaire/meta/family_not_related1",
        "fieldType":"STRING",
        "name":"family_not_related1",
        "label":"If yes, please describe below",
        "attributes":[
          
        ],
        "maxLength":255,
        "auto":false,
        "nillable":true,
        "readOnly":false,
        "labelAttribute":false,
        "unique":false,
        "visible":true,
        "lookupAttribute":false,
        "isAggregatable":false,
        "nullableExpression":"$('status').eq('SUBMITTED').not().value()||$('family_not_related').eq(true).not().value()||$('family_not_related').eq(true).not().value()",
        "visibleExpression":"$('family_not_related').eq(true).value()"
      }
      it("Converts to type text with inputType undefined", () => {
        const element = attribute2element(notRelated)
        expect(element?.type).toEqual("text")
        expect((element as TextElement).inputType).toBeUndefined()
      })
    })

    describe("DATE", () => {
      const birthDate: Attribute = {
        "href":"/api/v2/c6_questionnaire/meta/birthdate",
        "fieldType":"DATE",
        "name":"birthdate",
        "label":"What is your child's date of birth (YYYY-MM-DD)",
        "attributes":[
          
        ],
        "auto":false,
        "nillable":true,
        "readOnly":false,
        "labelAttribute":false,
        "unique":false,
        "visible":true,
        "lookupAttribute":false,
        "isAggregatable":false,
        "nullableExpression":"$('status').eq('SUBMITTED').not().value()",
        "validationExpression":"$('birthdate').age().value() == null || ($('birthdate').age().value() >= 0 && $('birthdate').age().value() < 150)"
      }
      it("Converts to type text with inputType date", () => {
        const element = attribute2element(birthDate)
        expect(element?.type).toBe("text")
        expect((element as TextElement).inputType).toBe("date")
      })
    })

    describe("DATE_TIME", () => {
      const birthDate: Attribute = {
        "href":"/api/v2/c6_questionnaire/meta/birthdate",
        "fieldType":"DATE",
        "name":"birthdate",
        "label":"What is your child's date of birth (YYYY-MM-DD)",
        "attributes":[
          
        ],
        "auto":false,
        "nillable":true,
        "readOnly":false,
        "labelAttribute":false,
        "unique":false,
        "visible":true,
        "lookupAttribute":false,
        "isAggregatable":false,
        "nullableExpression":"$('status').eq('SUBMITTED').not().value()",
        "validationExpression":"$('birthdate').age().value() == null || ($('birthdate').age().value() >= 0 && $('birthdate').age().value() < 150)"
      }
      it("Converts to type text with inputType date", () => {
        const element = attribute2element(birthDate)
        expect(element?.type).toBe("text")
        expect((element as TextElement).inputType).toBe("date")
      })
    })
  })
})
