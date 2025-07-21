import { query, type SDKMessage } from "@anthropic-ai/claude-code";
import { match } from "ts-pattern";
import {
    sendUserMessageRecordNotification,
    agentTextResponseNotification,
    agentFileReadNotification,
    agentFileWriteNotification,
    agentFileEditNotification,
    agentMultiEditNotification,
    agentListFilesNotification,
    agentGrepNotification,
    agentGlobNotification,
    agentTaskNotification,
    agentBashNotification,
    agentTodoWriteNotification,
    agentWebFetchNotification,
    agentWebSearchNotification,
    agentNotebookReadNotification,
    agentNotebookEditNotification,
    sendTaskCompletion,
    sendSystemInitNotification,
    sendMaxTurnsErrorNotification,
    sendExecutionErrorNotification,
    agentCustomToolNotification,
    todoModificationResultNotification,
    fileListResultNotification,
    fileReadResultNotification,
    bashCommandResultNotification,
    fileEditResultNotification,
    grepResultNotification,
    taskResultNotification,
    globResultNotification,
    fileMultiEditResultNotification,
    webFetchResultNotification,
    webSearchResultNotification,
    notebookReadResultNotification,
    notebookEditResultNotification,
    genericToolResultNotification
} from "./functions.js";



// codebolt.onMessage((userMessage) => {})
// Map to track tool use IDs and their corresponding tool names
const toolUseIdMap = new Map<string, string>();

// Simple unified dispatcher using flat pattern matching
const dispatchMessage = (message: SDKMessage) => {
    // Show processed notification
    match(message)
        // User messages
        .with({ type: 'user' }, (msg) => {
            // Check if this is a regular user message or contains tool results
            if (Array.isArray(msg.message.content)) {
                // Process each content block
                msg.message.content.forEach(content => {
                    match(content)
                        .with({ type: 'tool_result' }, (toolResult) => {
                            const toolName = toolUseIdMap.get(toolResult.tool_use_id);
                            const resultContent = toolResult.content || '';
                            const isError = toolResult.is_error || false;
                            
                            match(toolName)
                                .with('Read', () => fileReadResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('Write', () => fileEditResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('Edit', () => fileEditResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('MultiEdit', () => fileMultiEditResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('LS', () => fileListResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('Grep', () => grepResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('Glob', () => globResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('Task', () => taskResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('Bash', () => bashCommandResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('TodoWrite', () => todoModificationResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('WebFetch', () => webFetchResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('WebSearch', () => webSearchResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('NotebookRead', () => notebookReadResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .with('NotebookEdit', () => notebookEditResultNotification(toolResult.tool_use_id, resultContent, isError))
                                .otherwise(() => genericToolResultNotification(toolResult.tool_use_id, resultContent, isError));
                        })
                        .with({ type: 'text' }, (textContent) => {
                            // Regular text user message
                            sendUserMessageRecordNotification(textContent.text, msg.session_id, msg.parent_tool_use_id);
                        })
                        .otherwise(() => {
                            // Other content types (images, documents, etc.)
                            sendUserMessageRecordNotification(content, msg.session_id, msg.parent_tool_use_id);
                        });
                });
            } else {
                // String content - regular user message
                sendUserMessageRecordNotification(msg.message.content, msg.session_id, msg.parent_tool_use_id);
            }
        })

        // System messages
        .with({ type: 'system' }, (msg) => {
            sendSystemInitNotification(msg.apiKeySource, msg.cwd, msg.tools, msg.mcp_servers, msg.model, msg.permissionMode);
        })

        // Result messages - success
        .with({ type: 'result', subtype: 'success' }, (msg) => {
            sendTaskCompletion(msg.result, msg.duration_ms, msg.duration_api_ms, msg.num_turns, msg.total_cost_usd, msg.usage);
        })

        // Result messages - max turns error
        .with({ type: 'result', subtype: 'error_max_turns' }, (msg) => {
            sendMaxTurnsErrorNotification(msg.num_turns, msg.duration_ms, msg.total_cost_usd);
        })

        // Result messages - execution error
        .with({ type: 'result', subtype: 'error_during_execution' }, (msg) => {
            sendExecutionErrorNotification(msg.num_turns, msg.duration_ms, msg.total_cost_usd);
        })

        // Assistant messages
        .with({ type: 'assistant' }, (msg) => {
            // Process content
            if (msg.message.content) {
                msg.message.content.forEach(content => {
                    match(content)
                        .with({ type: 'text' }, (textContent) => {
                            agentTextResponseNotification(textContent.text);
                        })

                        // Claude Code tools mapping
                        .with({ type: 'tool_use', name: 'Read' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'Read');
                            agentFileReadNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Write' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'Write');
                            agentFileWriteNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Edit' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'Edit');
                            agentFileEditNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'MultiEdit' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'MultiEdit');
                            agentMultiEditNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'LS' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'LS');
                            agentListFilesNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Grep' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'Grep');
                            agentGrepNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Glob' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'Glob');
                            agentGlobNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Task' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'Task');
                            agentTaskNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Bash' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'Bash');
                            agentBashNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'TodoWrite' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'TodoWrite');
                            agentTodoWriteNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'WebFetch' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'WebFetch');
                            agentWebFetchNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'WebSearch' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'WebSearch');
                            agentWebSearchNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'NotebookRead' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'NotebookRead');
                            agentNotebookReadNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'NotebookEdit' }, (tool) => {
                            toolUseIdMap.set(tool.id, 'NotebookEdit');
                            agentNotebookEditNotification(tool.id, tool.input);
                        })

                        // Custom tool fallback
                        .with({ type: 'tool_use' }, (tool) => {
                            toolUseIdMap.set(tool.id, tool.name);
                            agentCustomToolNotification(tool.name, tool.id, tool.input);
                        })

                        .otherwise(() => {
                            console.log("❓ Unknown content type:", content);
                        });
                });
            }
        })

        .otherwise(() => console.log("❓ Unknown:", message));

    // Show raw JSON
    console.log("\n🔍 Raw JSON:");
    console.log(JSON.stringify(message, null, 2));
};

// Main execution
const messages: SDKMessage[] = [];

console.log("🚀 Starting Claude Code query...\n");

for await (const message of query({
    prompt: "create a react website of cow store",
    abortController: new AbortController(),
    options: {
        permissionMode: "bypassPermissions",
        cwd: "/Users/utkarshshukla/Codebolt/cludecodeagent/claudecodeworkspace"
    },
})) {
    messages.push(message);
    dispatchMessage(message);
    console.log("---");
}

console.log(`\n📊 Total messages received: ${messages.length}`);