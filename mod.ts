import { n3reasoner } from "./src/deps.ts"

const res = await n3reasoner(
    `
        @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
        @prefix : <http://example.org/socrates#>.

        :Socrates a :Human.
        :Human rdfs:subClassOf :Mortal.

        {?A rdfs:subClassOf ?B. ?S a ?A} => {?S a ?B}.
    `,
    `
        @prefix : <http://example.org/socrates#>.

        {:Socrates a ?WHAT} => {:Socrates a ?WHAT}.
    `,
)
console.log(res)
/*
    @prefix : <http://example.org/socrates#>.
    
    :Socrates a :Human.
    :Socrates a :Mortal.
*/
