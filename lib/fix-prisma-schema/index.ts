// import camelCase from "camelcase"
import inflection from "inflection"
import Parser from "fastparse"

function singular(s: string) {
  return inflection.camelize(inflection.singularize(s), true)
}

function Singular(s: string) {
  return inflection.camelize(inflection.singularize(s))
}

function optional(s: string | null | undefined) {
  return typeof s === "string" ? s : ""
}

const parser = new Parser<{ lines: string[]; ignoreModels: string[] }>({
  source: {
    "(\\s*model\\s+)(\\w+)(\\s+{\\s*\n)"(match, before, model, after) {
      if (this.ignoreModels.includes(model)) {
        this.lines.push(`// skipped model ${model}\n\n`)
        return "skipModelBody"
      }
      // this.lines.push(`${before}${Singular(model)}${after}`)
      this.lines.push(match)
      return "modelBody"
    },
    ".*\n"(match) {
      this.lines.push(match)
      return "source"
    },
  },
  // modelName: {
  //   "(\\w+)"(name) {
  //     this.lines.push(`model ${Singular(name)} {`)
  //   },
  //   "\\s+{": "modelBody",
  // },
  modelBody: {
    // relation has type that is in lowercase
    "(\\s+)(\\w+)(\\s+)([a-z]\\w+)([?]|\\[\\])?([^\n]*\n)"(
      text,
      before,
      field,
      s0,
      model,
      modifier,
      after
    ) {
      const inflectedField = modifier === `[]` ? field : singular(field)
      this.lines.push(`${before}// normalized\n`)
      this.lines.push(
        `${before}${inflectedField}${s0}${model}${optional(modifier)}${after}`
      )
    },
    "(\\s*}\\s*\n)"(text) {
      this.lines.push(text)
      return "source"
    },
    "(.*\n)"(text, before, field, after) {
      this.lines.push(text)
    },
  },
  skipModelBody: {
    "(\\s+}\\s*\n)"(text) {
      return "source"
    },
  },
})

export function fixSchema(
  s: string,
  { ignoreModels }: { ignoreModels: string[] } = { ignoreModels: [] }
) {
  // when parsing, we add a "\n" at the end to make it easier to match the
  // last line.
  const lines = parser.parse("source", s + "\n", { ignoreModels, lines: [] })
    .lines
  // after parsing, we remove the last "\n" to keep the format the same
  return lines.join("").slice(0, -1)
}
