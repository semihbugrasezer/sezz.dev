---
date:
  created: 2026-02-02
  updated: 2026-02-02
categories:
  - React
tags:
  - typescript
  - jsx
  - react
  - tutorial
  - reference
authors:
  - semih
---

# TypeScript JSX Primer: A Short Tutorial for React Learners

This tutorial distills the TypeScript React and JSX guidance into a quick reference for JavaScript learners moving into TypeScript.

<!-- more -->

## 1) JSX Element Types

Use `JSX.Element` or `React.ReactNode` where appropriate.

```tsx
function Banner(): JSX.Element {
  return <h1>Welcome</h1>
}
```

## 2) Typing Props

```tsx
type ButtonProps = {
  label: string
  onClick: () => void
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

## 3) Typing Children

```tsx
type PanelProps = {
  children: React.ReactNode
}

function Panel({ children }: PanelProps) {
  return <section>{children}</section>
}
```

## 4) Typing Events

```tsx
function SearchBox() {
  const [value, setValue] = React.useState("")
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  return <input value={value} onChange={onChange} />
}
```

## 5) Reference Checklist

- Prefer inference where possible.
- Use React event types for DOM handlers.
- Keep prop types explicit for public components.

## References

- [TypeScript Handbook: React](https://www.typescriptlang.org/docs/handbook/react.html)
- [TypeScript Handbook: JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)

## Further Reading

- [TypeScript React handbook notes](typescript-react-handbook-notes.md)
- [React quick start notes](react-quick-start-notes.md)
- [Thinking in React tutorial](thinking-in-react-tutorial.md)
