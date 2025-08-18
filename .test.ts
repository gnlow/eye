import { assertEquals, assertIsError } from "https://esm.sh/jsr/@std/assert@1.0.14"

// @ts-types="https://esm.sh/eyereasoner@18.19.10/dist/index.d.ts"
import { n3reasoner } from "https://esm.sh/eyereasoner@18.19.10"

const trim =
(str: string) => str
    .trim()
    .split("\n")
    .map(line => line.trim())
    .join("\n")

const helper =
async (input: string, f = assertEquals) => {
    const [data, ...queries] = input.split("##")
    const res = await n3reasoner(data, ...queries.slice(0, -1))
    f(
        trim(res),
        trim(queries.slice(-1)[0]),
    )
}

Deno.test("socrates", () => helper(`
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
    @prefix : <http://example.org/socrates#>.

    :Socrates a :Human.
    :Human rdfs:subClassOf :Mortal.

    {?A rdfs:subClassOf ?B. ?S a ?A} => {?S a ?B}.

    ##

    @prefix : <http://example.org/socrates#>.

    {:Socrates a ?WHAT} => {:Socrates a ?WHAT}.

    ##

    @prefix : <http://example.org/socrates#>.

    :Socrates a :Human.
    :Socrates a :Mortal.
`))

Deno.test("owl - fuse", async () => helper(`
    ${await Deno.readTextFile("lib-owl-rl.n3")}

    ##

    @prefix : <http://example.org/>.
    @prefix owl: <http://www.w3.org/2002/07/owl#>.

    :Mary a :Woman.
    :John a :Man.

    :Man owl:disjointWith :Woman.

    :John a :Man, :Woman.

    ##
    
`, () => {})
    .then(() => { throw new Error("not fused") })
    .catch(x => assertIsError(x))
)

Deno.test("owl - SymmetricProperty", async () => helper(`
    ${await Deno.readTextFile("lib-owl-rl.n3")}

    ##

    @prefix : <http://example.org/>.
    @prefix owl: <http://www.w3.org/2002/07/owl#>.

    :isFriendOf a owl:SymmetricProperty.

    :alice :isFriendOf :bob.

    { ?a :isFriendOf ?b } => { ?a :isFriendOf ?b }.

    ##

    @prefix : <http://example.org/>.

    :alice :isFriendOf :bob.
    :bob :isFriendOf :alice.

`))

Deno.test("owl - disjoint", async () => helper(`
    ${await Deno.readTextFile("lib-owl-e.n3")}

    @prefix : <http://example.org/>.

    {
        ?A owl:disjointWith ?B.
        ?A owl:disjointWith ?C.
    } => {
        ?B owl:equivalentClass ?C.
    }.

    :Person owl:disjointUnionOf ( :Man :Woman ).

    :NotMan owl:complementOf :Man.

    :alice a :Person, :NotMan.

    ## @prefix : <http://example.org/>.

    { ?a a :Woman } => { ?a a :Woman }.

    ##

    @prefix : <http://example.org/>.

    :alice a :Woman.
`))
