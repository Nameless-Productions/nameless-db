import { data } from "./index.js";

export function getValue(name: string) {
    return data.get(name)?.data ?? ""
}

export function setValue(name: string, content: string) {
    data.set(name, {data: content});
}