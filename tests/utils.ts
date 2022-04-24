import * as assert from "uvu/assert";
import templateLiterals, { Literal } from "../src/module";
import { readFile, writeFile } from "fs/promises";

export const toJson = (code: string, pars: Literal[]) =>
    pars.map((part) => ({
        ...part,
        code: `${part.type}\`${code.slice(part.start, part.end)}\``,
        params: part.params.map((part) => code.slice(part.start, part.end)),
    }));

export async function createExpect(file) {
    const code = await readFile(`./tests/examples/${file}.txt`, "utf8");

    const expect = toJson(code, templateLiterals(code));

    writeFile(`./tests/examples/${file}.json`, JSON.stringify(expect));
}

export async function matchExpect(file) {
    const code = await readFile(`./tests/examples/${file}.txt`, "utf8");
    const json = await readFile(`./tests/examples/${file}.json`, "utf8");

    assert.is(
        JSON.stringify(toJson(code, templateLiterals(code))),
        JSON.stringify(JSON.parse(json))
    );
}
