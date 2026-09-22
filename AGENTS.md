# AGENTS.md - Project Workspace Rules

This project enforces strict workspace isolation rules for all AI agents.
See details in [RULE.md](./RULE.md).

## Operational Constraints
- **Strict Boundary**: Agents MUST operate solely within `D:\UIT\NamBonUIT\pseo-uk-water-hardness`.
- **No External Access**: Never read, write, modify, or traverse outside the repository directory.
- **Terminal Execution**: All commands must have `Cwd` strictly set inside this repository.
- **Data Protection**: Never commit or expose `.env` / `.env.local` secrets or API credentials.
- **Code Standards**: Maintain Next.js 16 + TypeScript standards.
- **FORBIDDEN COMMANDS (CẤM TIỆT `npm run build`)**:
  - **TUYỆT ĐỐI CẤM CHẠY `npm run build` hoặc `next build`**: Do dự án có hơn 3.300 trang tĩnh (SSG), chạy build sẽ làm treo tiến trình và tốn tài nguyên. Để kiểm tra lỗi TypeScript / Type check, CHỈ ĐƯỢC CHẠY: `npx tsc --noEmit`.
- **GIT RESTRICTIONS**:
  - **CẤM TỰ Ý COMMIT / PUSH**: Agents KHÔNG được tự ý commit hay push code.
  - **CẤM `git commit -S`**: Cấm ký số GPG vì gây treo tiến trình gpg-agent trên Windows.
