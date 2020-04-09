// import camelCase from "camelcase"
import inflection from "inflection"

const MODEL_REGEXP = /^model (\S+) {$/

function singular(s: string) {
  return inflection.camelize(inflection.singularize(s), true)
}

function Singular(s: string) {
  return inflection.camelize(inflection.singularize(s))
}

const transformers = [
  {
    name: "model",
    pattern: /^model (\S+) {$/,
    transform(matches: string[]) {
      return `model ${inflection.camelize(
        inflection.singularize(matches[1])
      )} {`
    },

  },
  {
    name: "one to one",
    pattern: /^(\s+)(\w+)(\s+)([a-z_]+)([?]?)(\s+.*)$/,
    transform(matches: string[]) {
      // console.log("match", matches)
      return `${matches[1]}${singular(matches[2])}${matches[3]}${Singular(
        matches[4]
      )}${matches[5]}${matches[6]}`
    },
  },
  {
    name: "one to many",
    pattern: /^(\s+)(\w+)(\s+)([a-z_]+)(\[\])/, //(\[\])(\s+.*)$/,
    transform(matches: string[]) {
      console.log("match", matches)
      return `${matches[1]}${matches[2]}${matches[3]}${Singular(matches[4])}${
        matches[5]
      }`
    },
  },
]

export function fixSchema(s: string) {
  const lines = s.split("\n")
  const nextLines = lines.map((line) => {
    for (const transformer of transformers) {
      const matches = line.match(transformer.pattern)
      if (matches == null) continue
      return transformer.transform(matches)
    }
    return line
  })
  return nextLines.join("\n")
}
