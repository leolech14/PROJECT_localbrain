#!/usr/bin/env python3
"""
🚀 ULTRATHINK REAL ARCHITECTURE MAPPER
Generates comprehensive Mermaid diagrams based on ACTUAL LocalBrain structure
"""

def generate_localbrain_architecture():
    """Main architecture showing all 9 codebases and their connections"""
    return """flowchart TD
    %% LocalBrain Complete Architecture

    subgraph Frontend["🎨 Frontend Layer"]
        Electron["localbrain-electron<br/>Desktop App"]
        UI["localbrain-ui<br/>Web Interface"]
        Design["design<br/>Storybook + Tokens"]
    end

    subgraph Backend["⚙️ Backend Layer"]
        RAG["backend/rag<br/>Search & Indexing"]
        MetaLayer["meta-layer<br/>Orchestration"]
    end

    subgraph Core["🧠 Core Systems"]
        MainLB["LocalBrain<br/>Core Logic"]
        Shared["shared<br/>Common Utils"]
    end

    subgraph Infrastructure["🔧 Infrastructure"]
        Orchestra["orchestra-widget-system<br/>Widget Framework"]
        Agents["04_AGENT_FRAMEWORK<br/>MCP Task Registry"]
        Specs["02_SPECBASES<br/>Specifications"]
    end

    %% Connections
    Electron -->|uses| Design
    Electron -->|IPC| RAG
    Electron -->|imports| Shared
    UI -->|uses| Design
    UI -->|API| RAG
    RAG -->|queries| MainLB
    MetaLayer -->|orchestrates| RAG
    MetaLayer -->|manages| Agents
    Orchestra -->|widgets| Electron
    Specs -->|defines| MainLB
    Agents -->|coordinates| MetaLayer

    classDef frontend fill:#4338ca,stroke:#312e81,color:#fff
    classDef backend fill:#047857,stroke:#064e3b,color:#fff
    classDef core fill:#b91c1c,stroke:#991b1b,color:#fff
    classDef infra fill:#6d28d9,stroke:#5b21b6,color:#fff

    class Electron,UI,Design frontend
    class RAG,MetaLayer backend
    class MainLB,Shared core
    class Orchestra,Agents,Specs infra
"""

def generate_electron_architecture():
    """Electron app internal architecture"""
    return """flowchart TD
    %% Electron App Architecture

    subgraph Main["Main Process"]
        IPC["IPC Handlers"]
        Window["Window Manager"]
        FileSystem["File System Access"]
    end

    subgraph Renderer["Renderer Process"]
        App["App.tsx<br/>Root Component"]
        Context["AppContext<br/>State Management"]

        subgraph Components["Components"]
            MessageBubble["MessageBubble"]
            TopNav["TopNav"]
            Sidebar["Sidebar"]
        end

        subgraph Services["Services"]
            IPCService["ipc.ts<br/>IPC Communication"]
            AIService["AI Provider Service"]
        end

        subgraph Types["TypeScript Types"]
            SettingsType["Settings.ts"]
            MessageType["Message.ts"]
            ContextType["Context.ts"]
            AIProviderType["AIProvider.ts"]
        end
    end

    %% Connections
    App --> Context
    Context --> Components
    Components --> Services
    IPCService -->|electron.ipcRenderer| IPC
    IPC --> FileSystem
    Services --> Types
    AIService --> IPCService

    classDef process fill:#1e40af,stroke:#1e3a8a,color:#fff
    classDef ui fill:#6d28d9,stroke:#5b21b6,color:#fff
    classDef service fill:#047857,stroke:#064e3b,color:#fff
    classDef type fill:#92400e,stroke:#78350f,color:#fff

    class IPC,Window,FileSystem process
    class App,Context,Components ui
    class Services service
    class Types type
"""

def generate_backend_architecture():
    """Backend RAG system architecture"""
    return """flowchart TD
    %% Backend RAG Architecture

    subgraph API["API Layer"]
        Server["server/index.ts<br/>Express Server"]
        Routes["API Routes"]
    end

    subgraph Core["Core Services"]
        Search["search/index.ts<br/>Search Service"]
        Indexer["indexer/index.ts<br/>Document Indexer"]
        Scheduler["scheduler/index.ts<br/>Cron Jobs"]
    end

    subgraph Data["Data Layer"]
        DB["database/index.ts<br/>Vector DB"]
        Config["config/index.ts<br/>Configuration"]
    end

    subgraph CLI["CLI Tools"]
        CLITool["cli.ts<br/>Admin Commands"]
    end

    %% Connections
    Server --> Routes
    Routes --> Search
    Routes --> Indexer
    Search --> DB
    Indexer --> DB
    Scheduler --> Indexer
    Server --> Config
    DB --> Config
    CLITool --> Search
    CLITool --> Indexer

    classDef api fill:#3b82f6,stroke:#1e40af,color:#fff
    classDef service fill:#059669,stroke:#047857,color:#fff
    classDef data fill:#b45309,stroke:#78350f,color:#fff
    classDef cli fill:#7c3aed,stroke:#6d28d9,color:#fff

    class Server,Routes api
    class Search,Indexer,Scheduler service
    class DB,Config data
    class CLITool cli
"""

def generate_agent_framework():
    """04_AGENT_FRAMEWORK MCP architecture"""
    return """flowchart TD
    %% Agent Framework & MCP Architecture

    subgraph MCP["MCP Server"]
        TaskRegistry["Task Registry<br/>SQLite Database"]
        Tools["MCP Tools<br/>get/claim/update/complete"]
    end

    subgraph Agents["Multi-Agent System"]
        AgentA["Agent A<br/>UI Specialist"]
        AgentB["Agent B<br/>Architecture"]
        AgentC["Agent C<br/>Backend"]
        AgentD["Agent D<br/>Integration"]
    end

    subgraph Tasks["Task Management"]
        CentralRegistry["CENTRAL_TASK_REGISTRY.md<br/>19 Tasks Defined"]
        Dependencies["Dependency Graph"]
        Progress["Progress Tracking"]
    end

    subgraph Integration["MCP Integration"]
        Client["TaskRegistryClient"]
        Protocol["Connection Protocol"]
    end

    %% Connections
    CentralRegistry --> TaskRegistry
    TaskRegistry --> Tools
    Tools --> Agents
    AgentA -->|claim/update| Tools
    AgentB -->|claim/update| Tools
    AgentC -->|claim/update| Tools
    AgentD -->|claim/update| Tools
    Tools --> Dependencies
    Dependencies --> Progress
    Client --> Protocol
    Protocol --> Tools

    classDef mcp fill:#b91c1c,stroke:#991b1b,color:#fff
    classDef agent fill:#6d28d9,stroke:#5b21b6,color:#fff
    classDef task fill:#047857,stroke:#064e3b,color:#fff
    classDef integration fill:#b45309,stroke:#78350f,color:#fff

    class TaskRegistry,Tools mcp
    class AgentA,AgentB,AgentC,AgentD agent
    class CentralRegistry,Dependencies,Progress task
    class Client,Protocol integration
"""

def generate_design_system():
    """Design system architecture"""
    return """flowchart TD
    %% Design System Architecture

    subgraph Storybook["Storybook"]
        Stories["Component Stories"]
        Tokens["Design Tokens"]
    end

    subgraph Components["UI Components"]
        TopNav["TopNav Component"]
        Sidebar["Sidebar Component"]
        Generic["Generic Templates"]
    end

    subgraph DesignTokens["Design Tokens"]
        Colors["colors.stories.tsx"]
        Typography["typography.stories.tsx"]
        Motion["motion.stories.tsx"]
        Spacing["spacing.stories.tsx"]
    end

    subgraph Motion["Motion System"]
        ReducedMotion["reduced-motion.ts<br/>Accessibility"]
        Animations["Animation Presets"]
    end

    %% Connections
    Stories --> Components
    Tokens --> DesignTokens
    DesignTokens --> Colors
    DesignTokens --> Typography
    DesignTokens --> Motion
    DesignTokens --> Spacing
    Motion --> ReducedMotion
    Components --> DesignTokens

    classDef storybook fill:#db2777,stroke:#9f1239,color:#fff
    classDef component fill:#6d28d9,stroke:#5b21b6,color:#fff
    classDef token fill:#b45309,stroke:#78350f,color:#fff
    classDef motion fill:#059669,stroke:#047857,color:#fff

    class Stories,Tokens storybook
    class Components component
    class DesignTokens token
    class Motion motion
"""

if __name__ == "__main__":
    diagrams = {
        "1_architecture": generate_localbrain_architecture(),
        "2_electron": generate_electron_architecture(),
        "3_backend": generate_backend_architecture(),
        "4_agents": generate_agent_framework(),
        "5_design": generate_design_system()
    }

    for name, diagram in diagrams.items():
        print(f"\n{'='*80}")
        print(f"DIAGRAM: {name}")
        print('='*80)
        print(diagram)
