# Medium Technical Engineering & Architecture Series 📚

Welcome to the central repository for high-performance software engineering guides, distributed systems deep dives, microservice architectures, and system design articles published on Medium.

Each guide in this repository contains a publication-ready Medium article, custom visual architecture diagrams (`assets/`), and complete production reference code (`code/`).

---

## 🚀 Published Guides & Articles

| Article / Guide | Domain | Highlights & Technologies | Code Examples | Link |
| :--- | :--- | :--- | :--- | :--- |
| **Mastering gRPC in Microservices: From Core Architecture to Production Implementation** | Distributed Systems & Microservices | gRPC, HTTP/2, Protobuf, 4 Streaming Models, Envoy L7 Proxy, Kubernetes Health Probes | Node.js (`@grpc/grpc-js`) & NestJS (`@nestjs/microservices`) | [Read Guide](./grpc-guide/README.md) |

---

## 📁 Repository Structure

The repository is structured folder-wise where each article is self-contained:

```
medium-blog/
├── README.md                   # Repository Directory Index & Overview
├── grpc-guide/                 # Guide: Mastering gRPC in Microservices
│   ├── README.md               # Medium Article (Markdown ready for publication)
│   ├── assets/                 # Generated High-Resolution Architecture Diagrams
│   │   ├── grpc_hero_cover.png # Header Banner Illustration
│   │   ├── grpc_vs_rest.png    # REST vs gRPC Infographic Comparison
│   │   └── grpc_streaming.png  # 4 gRPC Communication Models Diagram
│   └── code/                   # Runnable Reference Implementation
│       ├── proto/              # Protobuf Interface Definition (`hero.proto`)
│       ├── config/             # Envoy L7 Proxy & Kubernetes Manifests
│       ├── nodejs-demo/        # Node.js Implementation with Status Codes & Graceful Shutdown
│       └── nestjs-demo/        # NestJS Implementation with Global Filters & Interceptors
```

---

## 🛠️ How to Run Code Examples

### 1. Running the gRPC Node.js Demo

```bash
cd grpc-guide/code/nodejs-demo
npm install

# Start the Node.js gRPC Server
npm run start:server

# In a separate terminal, execute the Client calls
npm run start:client
```

### 2. Running the gRPC NestJS Microservice

```bash
cd grpc-guide/code/nestjs-demo
npm install

# Launch NestJS gRPC Microservice in watch mode
npm run start:dev
```

### 3. Deploying Envoy L7 Proxy (Docker)

```bash
cd grpc-guide/code/config
docker run -d --name envoy-proxy -p 8080:8080 -p 9901:9901 -v $(pwd)/envoy.yaml:/etc/envoy/envoy.yaml envoyproxy/envoy:v1.28-latest
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
