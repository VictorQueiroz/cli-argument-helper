# Copilot Coding Agent Instructions

This repository uses the Copilot Coding Agent for automated code changes and pull requests. To ensure best practices and smooth collaboration, please follow these guidelines:

## 1. Pull Request Workflow
- All automated changes by Copilot Coding Agent are made via pull requests (PRs).
- Review PRs for correctness, style, and security before merging.
- Use clear, descriptive PR titles and bodies.

## 2. Commit Messages
- Commit messages should be concise and explain the change.
- Reference related issues or discussions when relevant.

## 3. Code Style & Quality
- Follow the coding standards defined in this repository (see `tsconfig.json`, `package.json`, or other config files).
- Run tests and linters before merging PRs.
- Ensure all code is type-safe and well-documented.

## 4. Error Handling
- Handle errors gracefully and provide meaningful messages.
- Add or update tests for new error cases.

## 5. Documentation
- Update `README.md` and other docs when adding new features or making significant changes.
- Document public APIs and usage examples.

## 6. Security
- Avoid introducing secrets, credentials, or sensitive data in code or config files.
- Review dependencies for known vulnerabilities.

## 7. Communication
- Use comments in PRs to clarify decisions or request feedback.
- Tag relevant contributors for review when needed.

## 8. Configuration
- If you need to customize Copilot Coding Agent behavior, add a `.copilot-coding-agent/config.yml` file with your preferences.

---

For more details, see [Best practices for Copilot coding agent in your repository](https://gh.io/copilot-coding-agent-tips).
