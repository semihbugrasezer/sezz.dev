---
date:
  created: 2026-02-02
  updated: 2026-02-02
categories:
  - React
tags:
  - react
  - state
  - data-flow
  - tutorial
  - props
authors:
  - semih
---

# React State and Data Flow Tutorial: A Learner's Reference

This tutorial summarizes the official guidance on state, props, and data flow. It is written for JavaScript learners and designed to be re-read quickly.

<!-- more -->

## 1) Minimal State

**Rule:** Store only what changes and cannot be derived.

- If a value can be computed from props or state, do not store it.
- Keep state as close as possible to where it is used.

## 2) Single Direction Data Flow

**Rule:** Data flows down; actions flow up.

- Pass data through props.
- Pass callbacks upward to update state.

## 3) Lifting State Up

**Rule:** If two components need the same data, lift it to the nearest common ancestor.

## 4) Controlled vs Uncontrolled

**Rule:** Use controlled inputs for predictable forms; use uncontrolled inputs for simple cases.

## 5) Checklist

- State is minimal.
- Props are the primary data flow.
- Child components receive callbacks to update state.

## References

- [Thinking in React](http://react.dev/learn/thinking-in-react)
- [React Learn](https://react.dev/learn)

## Further Reading

- [Thinking in React tutorial](thinking-in-react-tutorial.md)
- [React quick start notes](react-quick-start-notes.md)
- [React tutorial: production-ready patterns](react-production-patterns.md)
