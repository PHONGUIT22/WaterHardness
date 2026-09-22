# AGENT OPERATIONAL BOUNDARIES & WORKSPACE RULES
# QUY TẮC PHẠM VI HOẠT ĐỘNG CHO AI AGENT

> **QUY TẮC TỐI CAO (CARDINAL RULE):**
> AI Agent **CHỈ ĐƯỢC PHÉP** hoạt động hoàn toàn bên trong thư mục dự án này (`pseo-uk-water-hardness`).
> **TUYỆT ĐỐI CẤM** đọc, ghi, sửa đổi, thực thi hoặc táy máy ra bất kỳ thư mục, ổ đĩa hoặc tệp tin nào bên ngoài phạm vi dự án.

---

## 1. PHẠM VI KHÔNG GIAN LÀM VIỆC (WORKSPACE SCOPE)

1. **Phạm vi hợp lệ (Whitelisted Directory):**
   - Thư mục gốc dự án: `D:\UIT\NamBonUIT\pseo-uk-water-hardness` (hoặc đường dẫn tương đối từ gốc repository).
   - Thư mục nội bộ phục vụ agent runtime (artifact/brain directory do hệ thống tự sinh).

2. **Vùng cấm tuyệt đối (Strictly Prohibited Areas):**
   - **CẤM** truy cập vào các thư mục cá nhân của người dùng: `Desktop`, `Downloads`, `Documents`, `Pictures`, `AppData` (ngoại trừ thư mục runtime được cấp quyền), `C:\Users\*`.
   - **CẤM** truy cập hoặc quét các dự án/thư mục khác trong ổ `D:\` hoặc bất kỳ ổ đĩa nào khác (`C:\`, `E:\`, v.v.).
   - **CẤM** dùng đường dẫn tuyệt đối ra ngoài dự án hoặc dùng path traversal (`../`, `../../`, `../../../`) để rời khỏi workspace.

---

## 2. GIỚI HẠN THỰC THI TERMINAL & LỆNH (COMMAND EXECUTION RULES)

1. **Working Directory (`Cwd`):**
   - Mọi lệnh terminal (`run_command`) **BẮT BUỘC** phải có `Cwd` nằm bên trong thư mục dự án `D:\UIT\NamBonUIT\pseo-uk-water-hardness`.
   - **TUYỆT ĐỐI KHÔNG** dùng lệnh `cd` để nhảy ra ngoài thư mục dự án.

2. **Phạm vi lệnh được phép:**
   - Chỉ chạy các lệnh liên quan trực tiếp đến dự án: `npm`, `npx`, `git`, `node` (các file script bên trong dự án).
   - **CẤM** chạy các lệnh hệ thống tác động lên OS, sửa registry, can thiệp tiến trình khác ngoài tác vụ dev của dự án.
   - **CẤM** cài đặt các gói npm/pip toàn cục (`-g`) vào máy tính cá nhân nếu không có yêu cầu rõ ràng từ người dùng.

3. **ĐIỀU LUẬT ĐẶC BIỆT: CẤM TIỆT `npm run build` / `next build`**:
   - **Lý do**: Dự án PSEO này có hơn 3.300 trang tĩnh (SSG), chạy `npm run build` sẽ chiếm dụng toàn bộ tài nguyên và mất nhiều phút gây treo máy/nghẽn luồng làm việc.
   - **QUY ĐỊNH**: **TUYỆT ĐỐI CẤM TIỆT** chạy `npm run build` hoặc `next build`.
   - **Thay thế**: Để kiểm tra lỗi syntax, type safety và tính toàn vẹn code, **CHỈ ĐƯỢC PHÉP CHẠY**: `npx tsc --noEmit`.

---

## 3. BẢO MẬT, MÃ NGUỒN & QUY ĐỊNH GIT (DATA & GIT RULES)

1. **Bảo vệ Secrets:**
   - **CẤM** đọc trộm, in ra màn hình hoặc commit các file chứa secret như `.env`, `.env.local`, API keys, tokens của Supabase hoặc các dịch vụ bên ngoài.
   - Không được sửa đổi file cấu hình môi trường nếu không được chỉ đạo trực tiếp.

2. **Toàn vẹn mã nguồn & Quy định Git:**
   - **CẤM** tự ý xóa file, refactor quy mô lớn các thư mục không liên quan đến task được giao.
   - Luôn tôn trọng cấu trúc có sẵn: Next.js 16 (App Router), Tailwind CSS, TypeScript strict mode.
   - **CẤM TỰ Ý COMMIT / PUSH**: Agent chỉ viết code và kiểm tra type (`npx tsc --noEmit`). Tuyệt đối KHÔNG tự ý chạy `git commit` hay `git push`.
   - **TUYỆT ĐỐI CẤM `git commit -S`**: Cấm hoàn toàn việc ký số GPG vì gây treo tiến trình `gpg-agent` trên Windows. Việc commit và push sẽ do người dùng tự thực hiện.

---

## 4. XỬ LÝ KHI PHÁT HIỆN YÊU CẦU NGOÀI PHẠM VI

Nếu nhận được chỉ thị hoặc câu hỏi liên quan đến file/thư mục ngoài dự án:
1. Agent phải lập tức từ chối và cảnh báo người dùng về giới hạn phạm vi.
2. Yêu cầu người dùng xác nhận hoặc copy dữ liệu cần thiết vào trong thư mục dự án trước khi xử lý.

---

## ENGLISH SUMMARY FOR AGENT RUNTIME

```yaml
rules:
  boundary_enforcement: STRICT
  allowed_root: "D:\\UIT\\NamBonUIT\\pseo-uk-water-hardness"
  actions:
    file_system:
      read: "ONLY inside allowed_root"
      write: "ONLY inside allowed_root"
      delete: "ONLY inside allowed_root"
      external_traversal: FORBIDDEN
    terminal:
      cwd: "STRICTLY within allowed_root"
      system_modifications: FORBIDDEN
      global_installs: FORBIDDEN
      npm_run_build: FORBIDDEN # STRICTLY FORBIDDEN! Use 'npx tsc --noEmit' instead
    git:
      auto_commit: FORBIDDEN
      auto_push: FORBIDDEN
      signed_commit_gpg: FORBIDDEN # Never run git commit -S
    security:
      leak_env_secrets: FORBIDDEN
      commit_sensitive_data: FORBIDDEN
```
