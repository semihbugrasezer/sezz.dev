---
date:
  created: 2026-02-02
  updated: 2026-02-02
categories:
  - React
tags:
  - typescript
  - react
  - tutorial
  - reference
  - typing
authors:
  - semih
---

# TypeScript + React Handbook Notes: A Compact Tutorial

This tutorial condenses the official TypeScript React handbook into a short, practical reference for typing components, props, and hooks. It is written for JavaScript learners transitioning to TypeScript.

<!-- more -->

## 1) Typing Props

Use explicit prop types and let TypeScript infer return types from JSX.

```tsx
type UserCardProps = {
  name: string
  role?: string
}

function UserCard({ name, role = "Dev" }: UserCardProps) {
  return (
    <div>
      <strong>{name}</strong>
      <span>{role}</span>
    </div>
  )
}
```

## 2) Typing State

Prefer inference when possible. Provide types for complex objects.

```tsx
type User = { id: string; name: string }

function UsersList() {
  const [users, setUsers] = React.useState<User[]>([])
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  )
}
```

## 3) Typing Events

Use the React event types for DOM handlers.

```tsx
function SearchBox() {
  const [value, setValue] = React.useState("")
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  return <input value={value} onChange={onChange} />
}
```

## 4) Typing Refs

```tsx
function FocusInput() {
  const ref = React.useRef<HTMLInputElement | null>(null)
  const focus = () => ref.current?.focus()
  return (
    <div>
      <input ref={ref} />
      <button onClick={focus}>Focus</button>
    </div>
  )
}
```

## 5) Typing Children

```tsx
type PanelProps = {
  children: React.ReactNode
}

function Panel({ children }: PanelProps) {
  return <section>{children}</section>
}
```

## 6) Checklist

- Prefer inference for simple state.
- Use React's built-in event types.
- Keep prop types explicit.
- Type your `useRef` when accessing DOM APIs.

## References

- [TypeScript Handbook: React](https://www.typescriptlang.org/docs/handbook/react.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## Further Reading

- [TypeScript JSX primer](typescript-jsx-primer.md)
- [React quick start notes](react-quick-start-notes.md)
- [React tutorial: production-ready patterns](react-production-patterns.md)
