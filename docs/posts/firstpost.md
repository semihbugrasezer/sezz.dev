---
date:
  created: 2024-12-26
  updated: 2024-12-27
categories:
  - Golang
tags:
  - restful-api
  - golang
authors:
  - semih
---

# Building a RESTful API with Go

In this post, I will walk you through the basics of creating a RESTful API using **Go (Golang)**, a statically typed, compiled language that is simple, efficient, and well-suited for high-performance systems like web servers and APIs.

<!-- more -->

## :construction_worker_tone1: My Current Project: Building RESTful API with Go :construction_worker_tone1:

I am currently working on building a RESTful API that will allow users to perform operations like creating, reading, updating, and deleting resources. This API will be built using **Go** and will follow best practices for REST architecture.

Here's a quick overview of what I'm doing:

- Developing a scalable, high-performance REST API using **Go** and the **net/http** package.
- Designing a clean, easy-to-understand structure with clear separation of concerns for better maintainability.
- Integrating the API with a database (such as **MongoDB** or **PostgreSQL**) for persistent storage.
- Building endpoints for handling CRUD operations.

---

## :white_check_mark: Key Concepts in RESTful APIs :white_check_mark:

When developing RESTful APIs, it's crucial to understand some key concepts. These concepts will guide the way you structure your API and handle requests:

### 1. **Resources and Endpoints**

- Resources are the data or objects that the API will interact with (e.g., users, products, messages).
- Endpoints are the specific paths through which the resources can be accessed (e.g., `/users`, `/products/{id}`).

### 2. **HTTP Methods**

- **GET**: Retrieve a resource or list of resources.
- **POST**: Create a new resource.
- **PUT**: Update an existing resource.
- **DELETE**: Remove a resource.

### 3. **Stateless Communication**

- Every request to the API should be independent, and the server should not store any state about the client.

---

## :construction_worker_tone1: Code Example: Building the API in Go :construction_worker_tone1:

Let's dive into some code. Below is a simple example of how to create a basic RESTful API using **Go**.

### Setting up the Project

1. **Initialize a Go Project**:

```bash
go mod init
```

### 2. **Create the main.go file**:

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
)

var messages []string

func main() {
    http.HandleFunc("/messages", getMessages)
    http.HandleFunc("/messages/create", createMessage)

    fmt.Println("Server is running on port 8080...")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func getMessages(w http.ResponseWriter, r *http.Request) {
    if r.Method == "GET" {
        json.NewEncoder(w).Encode(messages)
    } else {
        w.WriteHeader(http.StatusMethodNotAllowed)
    }
}

func createMessage(w http.ResponseWriter, r *http.Request) {
    if r.Method == "POST" {
        var message string
        err := json.NewDecoder(r.Body).Decode(&message)
        if err != nil {
            http.Error(w, "Invalid input", http.StatusBadRequest)
            return
        }
        messages = append(messages, message)
        w.WriteHeader(http.StatusCreated)
    } else {
        w.WriteHeader(http.StatusMethodNotAllowed)
    }
}

```

### Explanation:

- **We define two endpoints:**
  - **GET /messages**: Retrieves all messages.
  - **POST /messages/create**: Adds a new message.
- **`json.NewEncoder(w).Encode(messages)`** is used to send the list of messages as a JSON response.

- **`json.NewDecoder(r.Body).Decode(&message)`** is used to decode the incoming message in JSON format.

### 3. **Run the application**

To run the application, open your terminal and run the following command:

```
go run main.go

```
