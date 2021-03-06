export interface Literal {
    type: string;
    start: number;
    end: number;
    params: { start: number; end?: number }[];
}

interface MetaLiterals extends Literal {
    param: number;
}

interface MetaQuote {
    quote: string;
    start: number;
    end: number;
}

interface MetaComment {
    comment: boolean;
    block: boolean;
}

export default function analize(code: string) {
    const { length } = code;

    let meta: Partial<MetaLiterals & MetaComment & MetaQuote>;

    const literals: Literal[] = [];

    for (let i = 0; i < length; i++) {
        if (code[i - 1] == "\\") {
            continue;
        }

        if (!meta && code[i] === "/") {
            if (code[i + 1] === "/") {
                meta = { comment: true };
            }
            if (code[i + 1] == "*") {
                meta = { comment: true, block: true };
            }
        }

        if (!meta && (code[i] === "'" || code[i] === '"')) {
            meta = { quote: code[i], start: i };
        }

        if (!meta && code[i] === "`") {
            let ii = i;
            let type = "";

            while (ii--) {
                if (/[^\w$]/.test(code[ii])) {
                    break;
                } else {
                    type = code[ii] + type;
                }
            }

            if (type) {
                meta = {
                    type,
                    start: i + 1,
                    params: [],
                };
                if (code[i + 1] === "`") {
                    meta.end = i + 1;
                    literals.push(meta as Literal);
                    meta = null;
                    continue;
                }
            } else {
                meta = { quote: "`", start: i };
            }
        }

        if (meta?.type && meta.start != i) {
            if (code[i - 1] === "$" && code[i] === "{") {
                meta.param = 1;
                meta.params.push({ start: i - 1 });
            } else if (meta.param && code[i] === "{") {
                meta.param++;
            } else if (meta.param && code[i] === "}") {
                meta.param--;
                if (!meta.param) {
                    meta.params[meta.params.length - 1].end = i + 1;
                }
            } else if (!meta.param && code[i] === "`" && meta.start < i) {
                meta.end = i;
                literals.push(meta as Literal);
                meta = null;
                continue;
            }
        }

        if (meta?.quote === code[i] && meta.start != i) {
            meta = null;
        }

        if (meta?.comment) {
            if (meta.block && code[i - 1] === "*" && code[i] === "/") {
                meta = null;
            } else if ((!meta.block && code[i] === "\n") || i === length) {
                meta = null;
            }
        }
    }
    return literals;
}
