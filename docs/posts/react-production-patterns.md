---
date:
  created: 2026-02-02
  updated: 2026-02-02
categories:
  - React
tags:
  - react
  - hooks
  - performance
  - testing
  - accessibility
  - tutorial
authors:
  - semih
---

# React Tutorial: Production-Ready Patterns for Learners

This tutorial turns key React practices into a short, revisit-friendly reference for JavaScript learners. Each section includes a rule, a tiny example, and a checklist.

<!-- more -->

## 1) Component Design

**Rule:** Keep UI and logic separate.

```jsx
function UserCard({ user, onSelect }) {
  return (
    <button onClick={() => onSelect(user.id)}>
      <span>{user.name}</span>
      <small>{user.role}</small>
    </button>
  )
}
```

**Checklist**
- UI components should be driven by props.
- Logic should live in hooks or container components.
- Compose small parts into page-level components.

## 2) State and Effects

**Rule:** Effects synchronize external systems, not derived state.

```jsx
function useUsers(api) {
  const [state, setState] = React.useState({ data: [], loading: true })

  React.useEffect(() => {
    let alive = true
    api.listUsers().then((data) => {
      if (alive) setState({ data, loading: false })
    })
    return () => {
      alive = false
    }
  }, [api])

  return state
}
```

**Checklist**
- Keep derived values out of state.
- Cancel or guard in-flight async work.
- Prefer stable dependencies.

## 3) Performance

**Rule:** Measure before optimizing, then reduce unnecessary renders.

```jsx
const ProductRow = React.memo(function ProductRow({ item }) {
  return <div>{item.title}</div>
})
```

**Checklist**
- Use `React.memo` for expensive leaf components.
- Stabilize props with `useMemo` and `useCallback`.
- Virtualize large lists.

## 4) Accessibility

**Rule:** If it looks like a button, it must be a real `<button>`.

**Checklist**
- Correct `label` for form fields.
- Visible focus states.
- Keyboard navigation works end-to-end.

## 5) Testing Strategy

**Rule:** Test behavior, not implementation details.

```jsx
import { render, screen } from "@testing-library/react"

render(<UserCard user={{ name: "Semih", role: "Dev" }} onSelect={() => {}} />)
expect(screen.getByText("Semih")).toBeInTheDocument()
```

**Checklist**
- Unit test hooks and utilities.
- Integration test critical forms.
- E2E test the top user flows.

## 6) Data Fetching and Cache

**Rule:** Cache policy is a product decision, not a library default.

**Checklist**
- Decide stale time and retry policy.
- Use pagination or infinite scroll for large collections.
- Add prefetching for navigation-heavy screens.

## References

- [React Learn](https://react.dev/learn)
- [Thinking in React](http://react.dev/learn/thinking-in-react)

## Further Reading

- [React quick start notes](react-quick-start-notes.md)
- [React state and data flow tutorial](react-state-data-flow-tutorial.md)
- [Thinking in React tutorial](thinking-in-react-tutorial.md)
- [TypeScript React handbook notes](typescript-react-handbook-notes.md)
- [Redux Toolkit tutorial reference](redux-toolkit-tutorial-reference.md)
