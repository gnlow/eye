import { SwiplEye, queryOnce } from "./src/deps.ts"

const data = `
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
    @prefix : <http://example.org/socrates#>.

    :Socrates a :Human.
    :Human rdfs:subClassOf :Mortal.

    {?A rdfs:subClassOf ?B. ?S a ?A} => {?S a ?B}.
`

const query = `
    @prefix : <http://example.org/socrates#>.

    {:Socrates a ?WHAT} => {:Socrates a ?WHAT}.
`
const module = await SwiplEye({
    print: x => console.log(x),
})

module.FS.writeFile("data.n3", data)
module.FS.writeFile("query.n3", query)
queryOnce(module, "main", [
    "--quiet",
    "./data.n3",
    "--query",
    "./query.n3",
])
