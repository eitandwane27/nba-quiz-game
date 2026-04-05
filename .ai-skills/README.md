# Agent Skills - Custom Web Dev Collection

A minimal, focused collection of AI assistant skills for web development, organized for gradual expansion.

## 📁 Folder Structure

```
agent-skills/
│
├─ frontend/                    # Frontend development
│   ├─ frontend.md              # Main frontend generation (design-focused)
│   └─ react-patterns.md        # React best practices & patterns
│
├─ quality/                     # Code quality & improvement
│   ├─ lint-and-validate.md    # Automated linting & validation
│   ├─ code-review.md           # Code review guidelines
│   ├─ refactor.md              # Refactoring strategies
│   └─ debugging-strategies.md # Systematic debugging approach
│
├─ tests/                       # Testing
│   └─ unit-test-suggestions.md # Unit test generation & best practices
│
├─ security/                    # Security & auditing
│   └─ security-checks.md       # Security review & vulnerability scanning
│
├─ styling/                     # CSS & design systems
│   ├─ css-best-practices.md    # CSS architecture & performance
│   └─ tailwind-patterns.md     # Tailwind CSS patterns & utilities
│
└─ docs/                        # Documentation
    └─ documentation-helper.md  # Code documentation & comments
```

---

## 🚀 Quick Start

### 1. Choose Your AI Assistant

**For Claude Code:**
```bash
# Copy to Claude's skills directory
cp -r agent-skills ~/.claude/skills/
```

**For Cursor:**
```bash
# Copy to Cursor's directory
cp -r agent-skills ~/.cursor/skills/
```

**For Custom Setup:**
```bash
# Copy anywhere and configure your AI tool to look there
cp -r agent-skills ~/my-project/.ai-skills/
```

---

## 📖 How to Use Skills

### In Chat/Prompts:

**Claude Code:**
```
>> /frontend help me build a landing page
>> /react-patterns create a user dashboard component
>> /debugging-strategies this API call is failing
```

**Cursor:**
```
@frontend build a product card component
@code-review review this file
@security-checks audit this authentication flow
```

**Generic:**
```
Use the frontend skill to create a hero section
Apply react-patterns to refactor this component
Run debugging-strategies on this error
```

---

## 📝 What Each Skill Does

### Frontend (`frontend/`)
- **frontend.md**: High-craft UI generation with intentional design systems
- **react-patterns.md**: Modern React patterns, hooks, composition, performance

### Quality (`quality/`)
- **lint-and-validate.md**: Automated code quality checks
- **code-review.md**: Comprehensive code review guidelines
- **refactor.md**: Clean code refactoring strategies
- **debugging-strategies.md**: Systematic root-cause debugging (no guessing!)

### Tests (`tests/`)
- **unit-test-suggestions.md**: Generate unit tests, TDD workflows

### Security (`security/`)
- **security-checks.md**: Security audits, vulnerability scanning, OWASP checks

### Styling (`styling/`)
- **css-best-practices.md**: CSS architecture, performance, accessibility
- **tailwind-patterns.md**: Tailwind CSS v4 patterns and utilities

### Docs (`docs/`)
- **documentation-helper.md**: Code documentation, JSDoc, README generation

---

## 🌱 How to Expand

As you grow, add skills in these categories:

### Backend (Future)
```
backend/
├─ api-design.md
├─ database-optimization.md
└─ authentication-patterns.md
```

### DevOps (Future)
```
devops/
├─ docker-deployment.md
├─ ci-cd-pipelines.md
└─ monitoring-setup.md
```

### Performance (Future)
```
performance/
├─ web-vitals.md
├─ lighthouse-optimization.md
└─ bundle-analysis.md
```

---

## 🎯 Skill Selection Philosophy

These skills were hand-picked from the [Antigravity Awesome Skills](https://github.com/sickn33/antigravity-awesome-skills) repo based on:

1. **Immediate usefulness** for web developers
2. **Quality over quantity** (10 focused skills > 100 generic ones)
3. **Room to grow** organically as your needs evolve
4. **No overwhelming complexity** on day one

---

## 📚 Source

All skills (except `css-best-practices.md` which is custom) are sourced from:
- **Repository:** https://github.com/sickn33/antigravity-awesome-skills
- **License:** MIT (code) / CC BY 4.0 (content)
- **Date Extracted:** April 2026

---

## 🔧 Tips for Best Results

### 1. Be Specific When Invoking
```
❌ "use frontend"
✅ "use frontend to create a hero section with brutalist aesthetic"
```

### 2. Combine Skills
```
"Use react-patterns and code-review to refactor this component"
```

### 3. Reference Skills in Context
```
"Following debugging-strategies, investigate why this test fails"
```

### 4. Update Skills Over Time
As the source repo updates, you can pull fresh versions:
```bash
# Pull latest from antigravity repo
git pull
# Copy updated skills you use
```

---

## 🎨 Next Steps

1. **Start small**: Try 2-3 skills in your next project
2. **Observe quality**: Notice improvements in AI-generated code
3. **Add more**: Browse the source repo for additional skills
4. **Customize**: Edit skills to match your team's standards
5. **Share**: Distribute to your team for consistency

---

## 📞 Need More?

- **Full catalog:** https://sickn33.github.io/antigravity-awesome-skills/
- **Source repo:** https://github.com/sickn33/antigravity-awesome-skills
- **Bundles:** Check `/plugins/` in the source for pre-made collections

---

**Happy coding! 🚀**
