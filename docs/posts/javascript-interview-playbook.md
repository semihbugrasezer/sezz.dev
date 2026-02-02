---
date:
  created: 2026-02-02
  updated: 2026-02-02
categories:
  - JavaScript
tags:
  - javascript
  - fundamentals
  - async
  - debugging
  - tutorial
authors:
  - semih
---

# JavaScript Fundamentals Tutorial: A Reference for Learners

This tutorial is a compact reference for JavaScript learners. It focuses on definitions, tiny examples, and recall prompts that map well to the MDN Guide and Reference.

<!-- more -->

## 1) Scope and Closures

**Definition:** A closure is a function that retains access to its lexical environment even after the outer function has returned.

```js
function makeCounter() {
  let n = 0
  return function next() {
    n += 1
    return n
  }
}

const next = makeCounter()
next()
next()
```

**Remember**
- Closures model state.
- The captured variables persist across calls.

## 2) `this` and Call Site

**Definition:** `this` is determined by how a function is called, not where it is defined.

```js
const user = {
  name: "Semih",
  greet() {
    return `Hi ${this.name}`
  },
}

const greet = user.greet
user.greet()
```

**Remember**
- `obj.method()` binds `this` to `obj`.
- Arrow functions do not create their own `this`.

## 3) Prototypes and Inheritance

**Definition:** Objects delegate property lookup to their prototype chain.

```js
const base = { kind: "base" }
const obj = Object.create(base)
obj.name = "sample"
```

**Remember**
- Property lookup walks up the chain.
- `Object.create` makes the chain explicit.

## 4) Equality

**Definition:** `===` checks value and type, `==` performs type coercion.

```js
0 == false
0 === false
```

**Remember**
- Prefer `===` for predictability.
- Know coercion rules for legacy code.

## 5) The Event Loop

**Definition:** Microtasks (Promises) run before macrotasks (timers).

```js
console.log("A")
setTimeout(() => console.log("B"), 0)
Promise.resolve().then(() => console.log("C"))
console.log("D")
```

Expected order: A, D, C, B.

## 6) Error Handling Pattern

**Definition:** Add context where you can recover; fail fast otherwise.

```js
async function fetchJson(url, options = {}) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`HTTP ${res.status}: ${body}`)
  }
  return res.json()
}
```

## 7) Debugging Checklist

- Verify the call site when `this` looks wrong.
- Log types, not just values.
- Reproduce with the smallest example.
- Check async ordering with a timeline.

## 8) Recall Prompts

- Explain closure with a stateful function.
- Describe the event loop with microtask vs macrotask.
- Show when prototype lookup happens.
- Compare `==` and `===` with a single example.

## References

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)

## Further Reading

- [MDN JavaScript reference notes](javascript-mdn-reference-notes.md)
- [React quick start notes](react-quick-start-notes.md)
- [Thinking in React tutorial](thinking-in-react-tutorial.md)
