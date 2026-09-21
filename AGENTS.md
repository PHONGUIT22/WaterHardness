# AGENTS.md - Project Workspace Rules

This project enforces strict workspace isolation rules for all AI agents.
See details in [RULE.md](./RULE.md).

## Operational Constraints
- **Strict Boundary**: Agents MUST operate solely within `D:\UIT\NamBonUIT\pseo-uk-water-hardness`.
- **No External Access**: Never read, write, modify, or traverse outside the repository directory.
- **Terminal Execution**: All commands must have `Cwd` strictly set inside this repository.
- **Data Protection**: Never commit or expose `.env` / `.env.local` secrets or API credentials.
- **Code Standards**: Maintain Next.js 16 + TypeScript standards and ensure all commits are signed (`git commit -S`).
