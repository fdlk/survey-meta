import c6 from "../src/c6"
import emx2survey from "../src/emx2survey"

describe("demo", () => {
  it("should have 16 elements", () => {
    const survey = emx2survey(c6)
    console.log(JSON.stringify(survey))
    expect(survey.length).toBe(16)
  })
})
