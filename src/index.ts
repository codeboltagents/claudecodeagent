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
    agentCustomToolNotification
} from "./functions.js";


// Simple unified dispatcher using flat pattern matching
const dispatchMessage = (message: SDKMessage) => {
    // Show processed notification
    match(message)
        // User messages
        .with({ type: 'user' }, (msg) => {
            sendUserMessageRecordNotification(msg.message.content, msg.session_id, msg.parent_tool_use_id);
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
                            agentFileReadNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Write' }, (tool) => {
                            agentFileWriteNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Edit' }, (tool) => {
                            agentFileEditNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'MultiEdit' }, (tool) => {
                            agentMultiEditNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'LS' }, (tool) => {
                            agentListFilesNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Grep' }, (tool) => {
                            agentGrepNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Glob' }, (tool) => {
                            agentGlobNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Task' }, (tool) => {
                            agentTaskNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'Bash' }, (tool) => {
                            agentBashNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'TodoWrite' }, (tool) => {
                            agentTodoWriteNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'WebFetch' }, (tool) => {
                            agentWebFetchNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'WebSearch' }, (tool) => {
                            agentWebSearchNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'NotebookRead' }, (tool) => {
                            agentNotebookReadNotification(tool.id, tool.input);
                        })
                        .with({ type: 'tool_use', name: 'NotebookEdit' }, (tool) => {
                            agentNotebookEditNotification(tool.id, tool.input);
                        })

                        // Custom tool fallback
                        .with({ type: 'tool_use' }, (tool) => {
                            agentCustomToolNotification(tool.name, tool.id, tool.input);
                        })

                        .otherwise(() => {
                            console.log("❓ Unknown content type:", content);
                        });
                });
            }
        })

        .otherwise(()=>console.log("❓ Unknown:", message));
    
    // Show raw JSON
    console.log("\n🔍 Raw JSON:");
    console.log(JSON.stringify(message, null, 2));
};

// Main execution
const messages: SDKMessage[] = [];

console.log("🚀 Starting Claude Code query...\n");

for await (const message of query({
    prompt: "create a react website of pet store",
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