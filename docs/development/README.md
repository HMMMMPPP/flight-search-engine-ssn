# Development Guidelines

This section contains contribution guidelines, coding standards, and testing practices for SkySpeed Neo.

## 📁 Documentation

### [Contributing Guide](./contributing.md)
How to contribute to the project.
- Development workflow
- Branch naming conventions
- Commit message standards
- Pull request process

### [Coding Standards](./coding-standards.md)
Code style and best practices.
- TypeScript guidelines
- Component patterns
- Naming conventions
- File organization

### [Testing Guidelines](./testing.md)
Testing strategy and procedures.
- Manual testing checklist
- Browser compatibility
- Mobile testing
- Performance testing

## 🛠️ Development Workflow

### 1. Create a Branch
```bash
# Feature branch
git checkout -b feature/feature-name

# Bug fix branch
git checkout -b fix/issue-description
```

### 2. Make Changes
- Follow [Coding Standards](./coding-standards.md)
- Keep changes focused and atomic
- Test thoroughly before committing

### 3. Commit Changes
Use conventional commits:
```bash
git commit -m "feat: add new search filter"
git commit -m "fix: resolve price calculation error"
git commit -m "docs: update API documentation"
```

### 4. Push and Create PR
```bash
git push origin feature/feature-name
```
Create a pull request with:
- Clear description of changes
- Screenshots/videos for UI changes
- Link to related issues

## 📐 Quick Standards

### TypeScript
- ✅ Use strict mode
- ✅ Define interfaces for all props
- ❌ No `any` types
- ✅ Prefer `const` over `let`

### Components
- ✅ Functional components only
- ✅ PascalCase naming
- ✅ Place in feature-specific directories
- ✅ Extract complex logic to hooks

### Styling
- ✅ Tailwind CSS classes preferred
- ✅ Dark mode support required
- ✅ Mobile responsive by default
- ❌ Avoid inline styles

## 🔗 Related Documentation

- [Contributing Guide](./contributing.md)
- [Coding Standards](./coding-standards.md)
- [Testing Guidelines](./testing.md)
- [Architecture](../architecture/)
