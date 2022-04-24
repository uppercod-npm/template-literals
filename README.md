# @uppercod/template-literals

Capture the position of the template literals of a js, ts, tsx and jsx code, para posteriormente ser analizados.

## Example

**input**

```js
/**
 * a`ignored`
 */
const x = b`found`;
// c`ignored`
const z = [z1`found`, z2`found`, z3`found`];

const x1 = () => html`<found>${"param"}</found>`;
```

```js
import templateLiterals from "@uppercod/template-literals";
import { readFile } from "fs/promises";

const code = await readFile("./input.js", "utf8");

console.log(templateLiterals(code));
```

**output**

```json
[
    {
        "type": "example",
        "start": 375,
        "params": [{ "start": 387, "end": 400 }],
        "param": 0,
        "end": 412
    }
]
```

## NPM

```
npm i @uppercod/template-literals
```

## Limitations:

1.  The parser ignores comments and quotas, to focus only on knowing the start, end and parameters of a literal template.
2.  @uppercod/template-literals has the limitation that it does not tolerate errors within the code to be analyzed, if the code is not properly formatted, template literals will not achieve an objective capture.
3.  It does not capture template literals nested within other template literals , but it does return the positions of the parameters of the detected template found
