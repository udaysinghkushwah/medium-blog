# Medium Technical Engineering & Architecture Series 📚

Welcome to the central repository for high-performance software engineering guides, distributed systems deep dives, microservice architectures, agentic AI frameworks, and system design articles published on Medium.

Each guide in this repository contains a publication-ready Medium article, custom visual architecture diagrams (`assets/`), and complete production reference code (`code/`).

---

## 🚀 Published Guides & Articles

| Article / Guide | Domain | Highlights & Technologies | Code Examples | Link |
| :--- | :--- | :--- | :--- | :--- |
| **Mastering gRPC in Microservices: From Core Architecture to Production Implementation** | Distributed Systems & Microservices | gRPC, HTTP/2, Protobuf, 4 Streaming Models, Envoy L7 Proxy, Kubernetes Health Probes | Node.js (`@grpc/grpc-js`) & NestJS (`@nestjs/microservices`) | [Read Guide](./grpc-guide/README.md) |
| **Architecting Multi-Agent Systems with LangGraph & NestJS: State Machines in Action** | Agentic AI & State Machines | LangGraph.js, StateGraph, Cyclic Loops, Conditional Edge Routing, NestJS SSE Streaming | NestJS + `@langchain/langgraph` | [Read Guide](./langgraph-multi-agent/README.md) |

---

## 📁 Repository Structure

The repository is structured folder-wise where each article is self-contained:

```
medium-blog/
├── README.md                   # Repository Directory Index & Overview
├── grpc-guide/                 # Guide: Mastering gRPC in Microservices
│   ├── README.md               # Medium Article
│   ├── LINKEDIN_POST.md        # Social Share Template
│   ├── assets/                 # High-Resolution Architecture Diagrams
│   └── code/                   # Node.js & NestJS Production gRPC Implementations
└── langgraph-multi-agent/      # Guide: Multi-Agent Systems with LangGraph & NestJS
    ├── README.md               # Medium Article
    ├── LINKEDIN_POST.md        # Social Share Template
    ├── assets/                 # State Graph & Multi-Agent Flowcharts
    └── code/                   # Runnable NestJS + LangGraph State Graph Implementation
```

---

## 🛠️ How to Run Code Examples

### 1. Running the LangGraph Multi-Agent NestJS Demo

```bash
cd langgraph-multi-agent/code
npm install

# Start NestJS Multi-Agent Server
npm run start:dev

# Test REST Execution Endpoint:
curl -X POST http://localhost:3000/agents/run -H "Content-Type: application/json" -d '{"task": "Architect a distributed rate limiter"}'
```

### 2. Running the gRPC Microservices Demo

```bash
cd grpc-guide/code/nodejs-demo
npm install
npm run start:server
```

---

## 👨‍💻 About the Author

**Uday Singh**  
*Technical Architect specializing in Distributed Systems, Serverless Cloud Architectures & Agentic AI*  
- 💼 **LinkedIn:** [Uday Singh](https://github.com/udaysinghkushwah)
- 🐙 **GitHub:** [@udaysinghkushwah](https://github.com/udaysinghkushwah)

---

## 📜 License

This repository is licensed under the [MIT License](LICENSE). Feel free to use code examples and architecture patterns in your own projects!
