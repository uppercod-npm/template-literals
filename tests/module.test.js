import { test } from "uvu";
import { matchExpect, createExpect } from "./utils";

test("expect 1", () => matchExpect(1));
test("expect 2", () => matchExpect(2));
test("expect 3", () => matchExpect(3));
test("expect 4", () => matchExpect(4));
test("expect 5", () => matchExpect(5));

test.run();
