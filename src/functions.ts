// User message notifications
export const sendUserMessageRecordNotification = (content: any, sessionId: string, parentToolUseId: string | null) => {
    console.log("👤 User Message:", {
        content,
        sessionId,
        parentToolUseId
    });
};

// Agent text response notifications
export const agentTextResponseNotification = (text: string) => {
    console.log("📝 Agent Text Response:", {text});
};

// File operation notifications
export const agentFileReadNotification = (toolId: string, input: any) => {
    console.log("📖 Agent File Read:", {
        toolId,
        filePath: input.path || input.file_path || input.filename,
        startLine: input.start_line,
        endLine: input.end_line,
        explanation: input.explanation
    });
};

export const agentFileWriteNotification = (toolId: string, input: any) => {
    console.log("✏️ Agent File Write:", {
        toolId,
        filePath: input.path || input.file_path || input.filename,
        content: input.text ? `${input.text.substring(0, 100)}...` : undefined
    });
};

export const agentFileEditNotification = (toolId: string, input: any) => {
    console.log("✏️ Agent File Edit:", {
        toolId,
        filePath: input.path,
        oldStr: input.oldStr ? `${input.oldStr.substring(0, 50)}...` : undefined,
        newStr: input.newStr ? `${input.newStr.substring(0, 50)}...` : undefined
    });
};

export const agentMultiEditNotification = (toolId: string, input: any) => {
    console.log("✏️ Agent Multi Edit:", {
        toolId,
        edits: input.edits ? input.edits.length : 0,
        files: input.files || input.paths
    });
};

// Directory and file listing notifications
export const agentListFilesNotification = (toolId: string, input: any) => {
    console.log("📁 Agent List Files:", {
        toolId,
        path: input.path
        // depth: input.depth,
        // explanation: input.explanation
    });
};

// Search notifications
export const agentGrepNotification = (toolId: string, input: any) => {
    console.log("🔍 Agent Grep Search:", {
        toolId,
        query: input.query,
        includePattern: input.includePattern,
        excludePattern: input.excludePattern,
        explanation: input.explanation
    });
};

export const agentGlobNotification = (toolId: string, input: any) => {
    console.log("🌐 Agent Glob Search:", {
        toolId,
        pattern: input.pattern,
        path: input.path,
        explanation: input.explanation
    });
};

// Task and execution notifications
export const agentTaskNotification = (toolId: string, input: any) => {
    console.log("📋 Agent Task:", {
        toolId,
        task: input.task || input.description,
        priority: input.priority,
        status: input.status
    });
};

export const agentBashNotification = (toolId: string, input: any) => {
    console.log("⚡ Agent Bash Command:", {
        toolId,
        command: input.command,
        path: input.path,
        args: input.args
    });
};

export const agentTodoWriteNotification = (toolId: string, input: any) => {
    console.log("📝 Agent Todo Write:", {
        toolId,
        todosCount: input.todos ? input.todos.length : 0,
        todos: input.todos ? input.todos.map((todo: any) => ({
            id: todo.id,
            content: todo.content,
            status: todo.status,
            priority: todo.priority
        })) : []
        // filePath: input.path || input.file_path
    });
};

// Web operations notifications
export const agentWebFetchNotification = (toolId: string, input: any) => {
    console.log("🌐 Agent Web Fetch:", {
        toolId,
        url: input.url,
        method: input.method || 'GET',
        headers: input.headers
    });
};

export const agentWebSearchNotification = (toolId: string, input: any) => {
    console.log("🔍 Agent Web Search:", {
        toolId,
        query: input.query,
        maxResults: input.maxResults || input.max_results,
        searchEngine: input.searchEngine || input.search_engine
    });
};

// Notebook operations notifications
export const agentNotebookReadNotification = (toolId: string, input: any) => {
    console.log("📓 Agent Notebook Read:", {
        toolId,
        notebookPath: input.path || input.notebook_path,
        cellIndex: input.cell_index,
        explanation: input.explanation
    });
};

export const agentNotebookEditNotification = (toolId: string, input: any) => {
    console.log("📓 Agent Notebook Edit:", {
        toolId,
        notebookPath: input.path || input.notebook_path,
        cellIndex: input.cell_index,
        content: input.content ? `${input.content.substring(0, 100)}...` : undefined,
        cellType: input.cell_type
    });
};

// Task completion notification
export const sendTaskCompletion = (result: string, duration: number, apiDuration: number, turns: number, cost: number, usage: any) => {
    console.log("✅ Task Completion:", {
        result,
        duration: `${duration}ms`,
        apiDuration: `${apiDuration}ms`,
        turns,
        cost: `$${cost.toFixed(4)}`,
        usage
    });
};

// System initialization notification
export const sendSystemInitNotification = (apiKeySource: string, cwd: string, tools: string[], mcpServers: any[], model: string, permissionMode: string) => {
    console.log("⚙️ System Initialization:", {
        apiKeySource,
        cwd,
        tools,
        mcpServers,
        model,
        permissionMode
    });
};

// Error notifications
export const sendMaxTurnsErrorNotification = (turns: number, duration: number, cost: number) => {
    console.log("⚠️ Max Turns Error:", {
        turns,
        duration: `${duration}ms`,
        cost: `$${cost.toFixed(4)}`
    });
};

export const sendExecutionErrorNotification = (turns: number, duration: number, cost: number) => {
    console.log("❌ Execution Error:", {
        turns,
        duration: `${duration}ms`,
        cost: `$${cost.toFixed(4)}`
    });
};

// Custom tool notification
export const agentCustomToolNotification = (toolName: string, toolId: string, input: any) => {
    console.log("🔧 Agent Custom Tool:", {
        toolName,
        toolId,
        input
    });
};
// Tool Result Notifications
export const todoModificationResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("✅ Todo Modification Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    });
};

export const fileListResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("📁 File List Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    });
};

export const fileReadResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("📖 File Read Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? 
            (content.length > 200 ? `${content.substring(0, 200)}...` : content) : 
            JSON.stringify(content, null, 2)
    });
};

export const bashCommandResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("⚡ Bash Command Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    });
};

export const fileEditResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("✏️ File Edit Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    });
};

export const grepResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("🔍 Grep Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    });
};

export const taskResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("📋 Task Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    });
};

export const globResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("🌐 Glob Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    });
};

export const fileMultiEditResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("✏️ Multi Edit Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    });
};

export const webFetchResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("🌐 Web Fetch Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? 
            (content.length > 300 ? `${content.substring(0, 300)}...` : content) : 
            JSON.stringify(content, null, 2)
    });
};

export const webSearchResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("🔍 Web Search Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    });
};

export const notebookReadResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("📓 Notebook Read Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? 
            (content.length > 200 ? `${content.substring(0, 200)}...` : content) : 
            JSON.stringify(content, null, 2)
    });
};

export const notebookEditResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("📓 Notebook Edit Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    });
};

export const genericToolResultNotification = (toolUseId: string, content: string | any[], isError: boolean) => {
    console.log("🔧 Generic Tool Result:", {
        toolUseId,
        isError,
        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    });
};