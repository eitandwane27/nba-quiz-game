# Quick Reference - Agent Skills

## 🎯 One-Line Summary of Each Skill

| Skill | When to Use | Key Benefit |
|-------|-------------|-------------|
| **frontend.md** | Building UI components | Creates distinctive, high-craft interfaces |
| **react-patterns.md** | React development | Modern hooks, composition, performance |
| **lint-and-validate.md** | Before committing code | Catches errors automatically |
| **code-review.md** | Reviewing PRs or code | Comprehensive quality checklist |
| **refactor.md** | Cleaning messy code | Systematic cleanup approach |
| **debugging-strategies.md** | When bugs occur | Finds root cause, no guessing |
| **unit-test-suggestions.md** | Writing tests | Generates test cases & scenarios |
| **security-checks.md** | Security review | OWASP-aligned vulnerability scanning |
| **css-best-practices.md** | Writing/reviewing CSS | Maintainable, performant stylesheets |
| **tailwind-patterns.md** | Using Tailwind | Modern utility patterns |
| **documentation-helper.md** | Documenting code | JSDoc, READMEs, inline comments |

---

## 🚀 Common Workflows

### Building a New Component
```
1. Use @frontend to scaffold the component
2. Use @react-patterns to optimize hooks/structure  
3. Use @tailwind-patterns for styling
4. Use @unit-test-suggestions to add tests
5. Use @code-review before committing
```

### Fixing a Bug
```
1. Use @debugging-strategies to investigate
2. Apply fix following identified root cause
3. Use @unit-test-suggestions to prevent regression
4. Use @code-review for final check
```

### Refactoring Old Code
```
1. Use @code-review to identify issues
2. Use @refactor for systematic cleanup
3. Use @lint-and-validate to catch regressions
4. Use @unit-test-suggestions to add coverage
```

### Security Audit
```
1. Use @security-checks for vulnerability scan
2. Use @code-review with security focus
3. Fix issues found
4. Re-run @security-checks to verify
```

---

## 💡 Pro Tips

### Combining Skills
Most tasks benefit from using 2-3 skills together:
- **Component creation**: frontend + react-patterns + tailwind-patterns
- **Bug fixing**: debugging-strategies + unit-test-suggestions
- **Code review**: code-review + security-checks + css-best-practices

### Customizing Skills
Each `.md` file is just text! Edit them to:
- Add your team's coding standards
- Include your specific tech stack patterns
- Remove sections you don't need
- Add examples from your codebase

### Growing Your Collection
Start here, then add from the source repo:
- **Next.js specific**: `nextjs-best-practices.md`
- **API development**: `api-design.md`, `rest-api-patterns.md`
- **Performance**: `lighthouse-optimization.md`, `core-web-vitals.md`
- **Testing**: `playwright-testing.md`, `cypress-testing.md`

---

## 📂 File Size Reference

Total: ~150KB (tiny!)

```
frontend/        ~30KB
quality/         ~50KB
tests/           ~15KB
security/        ~20KB
styling/         ~25KB
docs/            ~10KB
```

---

## 🎨 Skill Maturity Levels

**Ready to Use (No Setup)**
✅ All 11 included skills work out of the box

**Might Need Config**
⚠️ lint-and-validate (requires linter config in your project)

**External Tools Needed**
🔧 None of these skills require external tools

---

## ⚡ Quick Invoke Examples

### Claude Code
```bash
>> /frontend create a pricing card component with glassmorphism
>> /debugging-strategies the form validation isn't working
>> /security-checks review this authentication logic
```

### Cursor
```bash
@react-patterns optimize this useState logic
@code-review check this file for issues
@tailwind-patterns create a responsive grid
```

### Generic AI Chat
```
Using the frontend skill, build a hero section
Apply react-patterns to refactor this component
Run debugging-strategies on this error trace
```

---

## 🔄 Update Strategy

### Monthly
- Check source repo for skill updates
- Review new skills in categories you use

### When Needed
- Add new skills for new tech stack additions
- Customize existing skills for team standards
- Remove skills you never use

---

**Keep this file bookmarked for quick reference!**
