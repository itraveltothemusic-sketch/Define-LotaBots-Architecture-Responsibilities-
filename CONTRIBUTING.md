# Contributing to LotaBots

Thank you for your interest in contributing to the LotaBots system! This guide will help you understand how to contribute effectively while maintaining the integrity of the system.

## Table of Contents

- [Core Principles](#core-principles)
- [How to Contribute](#how-to-contribute)
- [Adding a New Bot](#adding-a-new-bot)
- [Modifying Existing Bots](#modifying-existing-bots)
- [Documentation](#documentation)
- [Review Process](#review-process)
- [Code of Conduct](#code-of-conduct)

## Core Principles

Before contributing, please understand and respect these core principles:

### 1. Single Responsibility Principle
Each bot must have exactly ONE well-defined responsibility. If you're tempted to add "just one more feature" to a bot, consider whether it belongs in a new bot instead.

**Good**: BuildBot only builds code
**Bad**: BuildBot builds code AND deploys it

### 2. Clear Boundaries
Bots must not overlap in functionality. If two bots could reasonably perform the same task, we need to clearly define which one should do it.

**Example**: Should SecurityBot or TestBot run security tests?
**Answer**: SecurityBot runs security scans; TestBot runs functional tests that may include security test cases.

### 3. No Logic Drift
Bots cannot modify their own behavior. All changes must be explicit configuration updates, reviewed and approved.

### 4. Controlled Communication
Bots communicate only through the message queue. No direct function calls, no shared databases (except message queue), no shared files.

## How to Contribute

### 1. Start with an Issue
Before making changes, create or comment on an issue describing:
- What you want to add/change
- Why it's needed
- How it fits within the LotaBots architecture

### 2. Fork and Branch
```bash
git clone https://github.com/your-username/Define-LotaBots-Architecture-Responsibilities-.git
cd Define-LotaBots-Architecture-Responsibilities-
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
Follow the guidelines in this document.

### 4. Validate Your Changes
```bash
# Validate configuration files
python3 scripts/validate-config.py --all

# Or validate a specific file
python3 scripts/validate-config.py bots/yourbot.yaml
```

### 5. Commit and Push
```bash
git add .
git commit -m "Add: Description of your changes"
git push origin feature/your-feature-name
```

### 6. Create Pull Request
Create a PR with:
- Clear description of changes
- Reference to related issue
- Explanation of how it maintains bot boundaries

## Adding a New Bot

### Step 1: Justify the Need
Ask yourself:
- Does this functionality fit within an existing bot's responsibility?
- Is this a distinct, single responsibility?
- Will this bot communicate through messages only?

If yes to all, proceed.

### Step 2: Define the Bot

Create a design document (can be in the issue) covering:

**Bot Name**: NewBot (must end with 'Bot')

**Category**: One of:
- infrastructure
- development
- operations
- data
- security

**Responsibility**: One sentence describing its SINGLE purpose

**Scope**: What it DOES
- Bullet points of specific actions

**Boundaries**: What it DOES NOT do
- Explicitly state what's out of scope

**Input**: What events/messages trigger it

**Output**: What messages it produces

**Dependencies**: Which bots it depends on

### Step 3: Create Configuration

Create `bots/newbot.yaml` following this template:

```yaml
bot:
  name: "NewBot"
  version: "1.0.0"
  enabled: true
  description: "Clear, one-sentence description"
  category: "operations"  # Choose appropriate category

triggers:
  - type: "event"
    pattern: "some.event"
    priority: "medium"

actions:
  - name: "main_action"
    type: "execute"
    command: "do-something"
    timeout: 300
    on_success: "notify"
    
  - name: "notify"
    type: "message"
    command: "send_message"
    parameters:
      event: "newbot.completed"

constraints:
  max_concurrent_jobs: 5
  timeout: 3600
  retry_policy:
    max_attempts: 3
    backoff: "exponential"
    initial_delay: 10
    max_delay: 300

dependencies:
  required: []
  optional: []
  conflicts: []

outputs:
  - type: "message"
    destination: "NotificationBot"
    format: "json"

security:
  permissions:
    - resource: "resource-name"
      actions: ["read"]
  encryption:
    enabled: true
    algorithm: "AES-256"
  authentication:
    method: "token"

monitoring:
  health_check:
    enabled: true
    interval: 30
    endpoint: "/health"
  metrics:
    enabled: true
    push_interval: 60
  logging:
    level: "info"
    format: "json"

notifications:
  - event: "newbot.failed"
    channels: ["slack"]
    severity: "critical"
```

### Step 4: Validate Configuration

```bash
python3 scripts/validate-config.py bots/newbot.yaml
```

Fix any errors or warnings.

### Step 5: Update Documentation

Update these files:

**1. LOTABOTS_ARCHITECTURE.md**
Add your bot to the appropriate category:

```markdown
### X. NewBot
**Responsibility**: Clear description

**Scope**:
- What it does
- What else it does

**Boundaries**:
- Does NOT do X
- Does NOT do Y

**Input**: Event type
**Output**: Message type
```

**2. README.md**
Add to the appropriate category list.

**3. WORKFLOW_EXAMPLES.md** (if applicable)
Add an example workflow showing how your bot interacts with others.

### Step 6: Validate All Documentation

Ensure:
- No typos or grammatical errors
- Consistent formatting
- Clear and concise language
- Examples are accurate

## Modifying Existing Bots

### When is it Appropriate?

Modify an existing bot when:
- Fixing a bug in configuration
- Improving efficiency within same scope
- Adding configuration options
- Updating dependencies

### When is it NOT Appropriate?

Do NOT modify an existing bot when:
- Adding new functionality outside its scope
- Making it depend on a new bot
- Changing its core responsibility

In these cases, create a new bot instead.

### Making Changes

1. **Update Configuration**: Modify `bots/botname.yaml`
2. **Update Version**: Increment version number appropriately
   - MAJOR: Breaking changes
   - MINOR: New backward-compatible features
   - PATCH: Bug fixes
3. **Validate**: Run validation script
4. **Update Docs**: Update LOTABOTS_ARCHITECTURE.md if needed
5. **Test**: Ensure changes don't break workflows

## Documentation

### Types of Documentation

1. **Architecture Docs** (`LOTABOTS_ARCHITECTURE.md`)
   - High-level system design
   - Bot definitions and boundaries
   - Communication protocols

2. **Implementation Guide** (`IMPLEMENTATION_GUIDE.md`)
   - How to deploy and run the system
   - Best practices
   - Troubleshooting

3. **Workflow Examples** (`WORKFLOW_EXAMPLES.md`)
   - Real-world scenarios
   - Bot interactions
   - Message flows

4. **Configuration Schema** (`bot-config-schema.yaml`)
   - Configuration format
   - Field descriptions
   - Examples

5. **Message Protocol** (`MESSAGE_PROTOCOL.md`)
   - Message format specification
   - Event types
   - Communication patterns

### Documentation Standards

- **Clear and Concise**: Get to the point quickly
- **Examples**: Provide concrete examples
- **Consistent**: Follow existing formatting
- **Accurate**: Keep in sync with implementation
- **Complete**: Don't leave gaps

### Updating Documentation

When making changes:
1. Update relevant documentation in the same PR
2. Keep examples up to date
3. Add new examples for new features
4. Remove outdated information

## Review Process

### What Reviewers Look For

1. **Boundary Respect**: Does the change respect bot boundaries?
2. **Single Responsibility**: Does each bot still have one clear purpose?
3. **Configuration Validity**: Does validation pass?
4. **Documentation**: Is documentation updated and accurate?
5. **Consistency**: Does it follow existing patterns?
6. **Clarity**: Is the purpose and impact clear?

### Review Checklist

Before requesting review, verify:

- [ ] Configuration validates without errors
- [ ] Documentation is updated
- [ ] Bot boundaries are respected
- [ ] Changes are clearly described in PR
- [ ] No secrets or sensitive data committed
- [ ] Examples are accurate
- [ ] Follows existing code style

### Addressing Feedback

- Respond to all review comments
- Make requested changes promptly
- Ask questions if something is unclear
- Be open to suggestions
- Thank reviewers for their time

## Code of Conduct

### Be Respectful
- Treat all contributors with respect
- Welcome newcomers
- Be patient with questions
- Provide constructive feedback

### Be Professional
- Focus on ideas, not people
- Accept criticism gracefully
- Give credit where due
- Admit mistakes

### Be Collaborative
- Work together toward common goals
- Share knowledge freely
- Help others learn
- Build on each other's work

## Questions?

If you have questions:

1. Check existing documentation
2. Search for related issues
3. Ask in discussions
4. Create a new issue if needed

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md (if we create one)
- Mentioned in release notes
- Thanked in PR merges

Thank you for contributing to LotaBots! 🤖
