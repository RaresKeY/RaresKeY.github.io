# Rares P.

**Systems-Oriented Software Engineer**

Email: smallloopworks@proton.me<br>
GitHub: <https://github.com/RaresKeY><br>
LinkedIn: <https://www.linkedin.com/in/rareskey/><br>
Games: <https://smallloopworks.itch.io/>

## Profile

Systems-oriented software engineer and open-source maintainer who turns ambiguous
problems into operable systems. My work spans Python services, Linux hosts,
rootless containers, application security, applied AI, desktop software, and
games. My default rhythm is **spike → iterate → stabilize**: map the system,
find the real constraint, make the smallest useful path work, then leave behind
tests, specifications, automation, and a system another person can continue.

## Experience

### Core Maintainer & Security Manager, Odysseus

**Open source / volunteer · ongoing**

- Work across authorization, owner isolation, fail-closed behavior, token
  scoping, path confinement, model routing, OAuth integration, CI, and
  regression coverage.
- Review high-risk changes by reconstructing the intended invariant, tracing it
  across code, state, tests, persistence, and authorization boundaries,
  reproducing failures, separating PR regressions from existing defects, and
  probing the smallest safe fix.
- Build specifications and review tooling that make security-sensitive work
  evidence-bound, resumable, and safer to execute.

### Independent Software Builder, Small Loop Works & Open Source

**Ongoing**

- Build and release cross-platform desktop, ML, local-agent, native C, and Godot
  projects from rough prototype through tests, specifications, automation, and
  public artifacts.
- Operate the environment around the code: Debian/Linux hosts, rootless Podman
  workboxes, SSH/Tailscale access, systemd recovery, cloud GPU experiments, and
  release flows.

## Selected Projects

### Review Ops: Python, Podman, Git, application security

Private, resumable review harness that pins Git ranges, hashes and validates
artifacts, treats candidate instructions as hostile data, binds findings to
source evidence, uses bounded subprocesses, and confines necessary candidate
execution to secretless, offline probe containers with human-controlled
publication.

### DJ Blue AI: PySide6, audio, applied AI

Cross-platform desktop application for meeting assistance, audio playback,
transcript capture, and Gemini-powered chat. Includes persistent configuration,
component previews, smoke tests, and tag-triggered Linux, macOS, and Windows
releases. <https://github.com/RaresKeY/dj-blue-ai>

### Chess Bot: PyTorch, data pipelines, cloud GPU

Platform for chess dataset generation and validation, PyTorch model training,
top-k and legality evaluation, inference, local play, and RunPod/Vast cloud
lifecycle orchestration. Includes regression tests and committed behavior
specifications. <https://github.com/RaresKeY/chess-bot>

### Code Review Simulator: Godot, game systems, release automation

Playable simulation taken from unusual premise to working core loop,
cross-platform builds, public devlogs, and a browser release.
<https://smallloopworks.itch.io/code-review-simulator>

### Additional Work

- **Local Agent Tools:** LangGraph tool calling, routing, streaming, checkpoints,
  Qdrant-backed RAG, llama.cpp models, safe knowledge-base operations, and
  regression tests. <https://github.com/RaresKeY/langgraph-pipeline-local-tools>
- **Word2Vec Pro Kit:** PyTorch NLP pipeline with binary pre-tokenization, memory
  mapping, vectorized batching, and Safetensors.
  <https://github.com/RaresKeY/word2vec-pro-kit>
- **Clean Mines:** native C/SDL2 desktop and terminal application with CMake,
  self-tests, and cross-platform release automation.
  <https://github.com/RaresKeY/clean-minesweeper-native>
- **Low-level lab:** a working 4-bit CPU and custom assembly-like instruction set
  in Turing Complete, plus IC10 automation. Presented as hands-on exploration,
  not professional processor design.

## Skills

- **Languages:** Python, C/C++, Bash, SQL, assembly-like languages
- **Systems:** Linux, Podman, Docker, systemd, SSH, Tailscale, Git, CI/CD,
  GitHub Actions
- **AI / ML:** PyTorch, LangGraph, RAG, Qdrant, NLP, embeddings, model training
  and evaluation
- **Desktop / native:** PySide6, Qt, CMake, SDL2, Godot, SQLite,
  cross-platform packaging
- **Engineering practice:** application security, deep code review, automated
  testing, specifications, technical documentation, software architecture
