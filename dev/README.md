# Development Documentation

This directory contains active task documentation that persists across Claude Code sessions.

## Structure

```
dev/
├── README.md                    # This file
└── active/                      # Active task documentation
    └── [task-name]/
        ├── [task-name]-plan.md      # Strategic plan
        ├── [task-name]-context.md   # Session progress tracker
        └── [task-name]-tasks.md     # Task checklist
```

## Purpose

The three-file structure preserves context across Claude Code session resets:

1. **Plan File** (`-plan.md`): Strategic overview, phases, acceptance criteria
2. **Context File** (`-context.md`): SESSION-SPECIFIC progress, blockers, decisions
3. **Tasks File** (`-tasks.md`): Checkbox-style task tracking

## Usage

### Starting a New Task
Use the `/dev-docs` slash command:
```
/dev-docs implement document viewer enhancements
```

### Before Context Reset
Use the `/dev-docs-update` slash command:
```
/dev-docs-update document-viewer
```

### Resuming Work
1. Read the context file for quick resume instructions
2. Check the tasks file for current status
3. Reference the plan for overall strategy

## Active Tasks

| Task | Status | Last Updated |
|------|--------|--------------|
| website-enhancement | Active | 2025-11-26 |

## Best Practices

1. **Update context before stopping** - Always run `/dev-docs-update` before ending a session
2. **Be specific** - Include file paths, line numbers, and exact changes
3. **Document decisions** - Explain WHY choices were made
4. **Track blockers** - Note any issues for follow-up
5. **Keep tasks atomic** - Break large tasks into small, completable items
