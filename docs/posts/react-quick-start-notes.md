---
date:
  created: 2026-02-02
  updated: 2026-02-02
categories:
  - React
tags:
  - react
  - tutorial
  - quick-start
  - fundamentals
  - jsx
authors:
  - semih
---

# React Quick Start Notes: A Beginner-Friendly Tutorial

This tutorial turns the React "Quick Start" material into a compact reference for JavaScript learners who want a beginner-friendly path.

<!-- more -->

## 1) Components and JSX

A component is a JavaScript function that returns JSX. JSX is a syntax extension that looks like HTML but compiles to JavaScript.

```jsx
function Hello({ name }) {
  return <h1>Hello, {name}</h1>
}
```

## 2) Props

Props are inputs to components. They flow from parent to child.

```jsx
function Avatar({ src, alt }) {
  return <img src={src} alt={alt} />
}
```

## 3) State

State is component-local data that changes over time.

```jsx
function Counter() {
  const [count, setCount] = React.useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

## 4) Lists and Keys

Use `map` to render lists and provide stable keys.

```jsx
function List({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  )
}
```

## 5) Conditional Rendering

Render different UI based on conditions.

```jsx
function Status({ online }) {
  return <span>{online ? "Online" : "Offline"}</span>
}
```

## 6) Quick Checklist

- Components are functions.
- Props flow down.
- State changes over time.
- Keys must be stable and unique.

## References

- [React Learn](https://react.dev/learn)
- [React Docs Home](https://react.dev/)

## Further Reading

- [Thinking in React tutorial](thinking-in-react-tutorial.md)
- [React state and data flow tutorial](react-state-data-flow-tutorial.md)
- [React tutorial: production-ready patterns](react-production-patterns.md)
- [TypeScript React handbook notes](typescript-react-handbook-notes.md)
