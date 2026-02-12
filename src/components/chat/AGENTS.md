# chat/
> L2 | Parent: src/components/AGENTS.md

Chat turn rendering — converts flat message streams into grouped assistant turns with activity trees, tool call visualization, and response blocks.

## Members

index.ts: Barrel export, public API surface for @craft/ui/chat
turn-utils.ts: Turn grouping engine — flat Message[] → AssistantTurn/UserTurn/SystemTurn, activity tree grouping, phase derivation, markdown formatting
TurnCard.tsx: Core assistant turn renderer — activity rows with expand/collapse, grouped tool calls, response block with streaming support, todo list
UserMessageBubble.tsx: User message renderer — text content, attachment previews, edit/retry actions
SystemMessage.tsx: System/status message display — info/warning/error variants
AcceptPlanDropdown.tsx: Plan acceptance UI — approve/reject/edit dropdown for agent-proposed plans
TurnCardActionsMenu.tsx: Context menu for turn actions — copy, retry, debug, export
InlineExecution.tsx: Compact execution summary for EditPopover — collapsed activity view with expand
SessionViewer.tsx: Read-only session transcript viewer — renders grouped turns with gradient fade, used by web viewer

[PROTOCOL]: Update this header on change, then check AGENTS.md
