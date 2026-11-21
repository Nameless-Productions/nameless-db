import { data } from "./index.js";

export function getValue(name: string) {
    return data.get(name)?.data ?? ""
}