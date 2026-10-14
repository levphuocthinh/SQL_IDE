import { Chapter } from '../types/lesson';

export const chaptersData: Chapter[] = [
  // --- BÀI 1 ---
  {
    id: 'ch1',
    title: 'Bài 1: DDL Cơ bản, Khóa chính, Khóa ngoại & Mệnh đề WHERE',
    badge: '01',
    description: 'Nắm vững kiến thức nền tảng về DDL, Khóa chính (PK), Khóa ngoại (FK) và mệnh đề lọc WHERE cơ bản.',
    lessons: [
      {
        id: 'lesson-1',
        chapterId: 'ch1',
        chapterTitle: 'Bài 1: DDL, Khóa chính, Khóa ngoại & WHERE',
        title: 'Bài 1: DDL Cơ bản, Khóa chính, Khóa ngoại & WHERE',
        slug: 'ddl-pk-fk-where',
        level: 'beginner',
        durationMinutes: 15,
        summary: 'Tạo cấu trúc bảng quan hệ phòng ban và nhân viên, thiết lập ràng buộc PK/FK và lọc dữ liệu với WHERE.',
        concepts: ['CREATE TABLE', 'PRIMARY KEY', 'FOREIGN KEY', 'WHERE', 'BETWEEN'],
        initialSchemaTables: ['departments', 'employees'],
        theory: `### 1. Lý thuyết cốt lõi
* **DDL (Data Definition Language)**: Nhóm lệnh định nghĩa cấu trúc lưu trữ (\`CREATE\`, \`ALTER\`, \`DROP\`).
* **Khóa chính (PRIMARY KEY)**: Cột định danh duy nhất mỗi dòng; tự động mang tính chất **UNIQUE** và **NOT NULL**.
* **Khóa ngoại (FOREIGN KEY)**: Cột liên kết từ bảng con trỏ về khóa chính của bảng cha; đảm bảo tính toàn vẹn tham chiếu.
* **Mệnh đề WHERE**: Bộ lọc dòng trước khi dữ liệu được nạp vào bộ nhớ để xử lý.
* **Thứ tự thực thi logic**: \`FROM\` $\\rightarrow$ \`WHERE\` $\\rightarrow$ \`SELECT\`.

#### Cú pháp minh họa:
\`\`\`sql
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL,
    location VARCHAR(100)
);

CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    dept_id INT NOT NULL,
    salary DECIMAL(10, 2),
    hire_date DATE,
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);
\`\`\`
`,
        quizzes: [
          {
            id: 'q1-1',
            question: 'Mệnh đề nào thực thi trước trong quá trình xử lý truy vấn?',
            options: [
              { key: 'A', text: 'SELECT' },
              { key: 'B', text: 'WHERE' },
              { key: 'C', text: 'FROM' },
              { key: 'D', text: 'Cả ba mệnh đề chạy song song' },
            ],
            correctAnswer: 'C',
            explanation: 'Trong cơ chế xử lý logic của SQL Engine, mệnh đề FROM được thực thi đầu tiên để xác định bảng nguồn, tiếp theo là WHERE để lọc dòng, và SELECT được thực thi sau cùng để xuất dữ liệu.',
          },
          {
            id: 'q1-2',
            question: 'Giá trị của một cột được định nghĩa là PRIMARY KEY có thể mang giá trị NULL không?',
            options: [
              { key: 'A', text: 'Có, nếu là kiểu dữ liệu chuỗi.' },
              { key: 'B', text: 'Có, nhưng chỉ tối đa một dòng mang giá trị NULL.' },
              { key: 'C', text: 'Không bao giờ.' },
              { key: 'D', text: 'Tùy thuộc vào thiết lập của hệ quản trị cơ sở dữ liệu.' },
            ],
            correctAnswer: 'C',
            explanation: 'Khóa chính (PRIMARY KEY) bắt buộc phải tuân thủ nghiêm ngặt 2 tính chất: Duy nhất (UNIQUE) và Không được rỗng (NOT NULL).',
          },
        ],
        essay: {
          question: 'Phân tích sự khác nhau giữa việc xóa bảng bằng lệnh DROP TABLE và làm rỗng bảng bằng lệnh TRUNCATE TABLE. Khi nào nên dùng lệnh nào?',
          detailedAnswer: `1. **DROP TABLE**: Xóa bỏ hoàn toàn định nghĩa cấu trúc bảng, toàn bộ dữ liệu, chỉ mục (indexes), ràng buộc (constraints) và quyền truy cập khỏi Data Dictionary. Bảng biến mất hoàn toàn khỏi cơ sở dữ liệu.
2. **TRUNCATE TABLE**: Làm rỗng bảng (xóa sạch toàn bộ dữ liệu) nhưng giữ nguyên định nghĩa cấu trúc bảng. Thao tác này nhanh hơn nhiều so với DELETE FROM vì giải phóng các trang dữ liệu (data pages) mà không ghi log cho từng dòng riêng lẻ, đồng thời tự động reset bộ đếm AUTO_INCREMENT về ban đầu.
-> **Khi nào nên dùng**:
- Dùng **DROP TABLE** khi bảng không còn cần thiết trong hệ thống nữa.
- Dùng **TRUNCATE TABLE** khi muốn dọn dẹp dữ liệu cũ để nạp lại dữ liệu kiểm thử mới từ đầu mà vẫn giữ nguyên schema.`,
        },
        initialSql: `-- Yêu cầu 1: Lấy danh sách nhân viên có lương từ 1000 trở lên.
SELECT emp_id, full_name, salary 
FROM employees 
WHERE salary >= 1000;`,
        solutionSql: `SELECT emp_id, full_name, salary 
FROM employees 
WHERE salary >= 1000;`,
        hint: 'Sử dụng SELECT emp_id, full_name, salary FROM employees WHERE salary >= 1000;',
        exercise: {
          prompt: 'Viết truy vấn lấy danh sách nhân viên gồm: emp_id, full_name, salary từ bảng employees có mức lương từ 1000 trở lên.',
          targetDescription: 'Truy vấn trả về 3 nhân viên (Nguyen Van An, Tran Thi Binh, Pham Thi Dung).',
          criteria: {
            requiredKeywords: ['SELECT', 'FROM', 'EMPLOYEES', 'WHERE', 'SALARY', '>=', '1000'],
            customValidation: (sql, result) => {
              if (!result || !result.rows || result.rows.length === 0) {
                return { success: false, message: 'Chưa có kết quả trả về từ truy vấn!' };
              }
              if (result.rows.length === 3) {
                return { success: true, message: 'Chính xác! Đã lọc thành công 3 nhân viên có lương >= 1000.' };
              }
              return { success: false, message: `Số lượng bản ghi chưa đúng (kết quả mong đợi: 3, thực tế: ${result.rows.length}).` };
            }
          }
        }
      }
    ]
  },

  // --- BÀI 2 ---
  {
    id: 'ch2',
    title: 'Bài 2: Ràng buộc mở rộng, Xử lý chuỗi, NULL & Phân trang',
    badge: '02',
    description: 'Khám phá các ràng buộc CHECK, DEFAULT, toán tử so sánh chuỗi LIKE, xử lý giá trị rỗng NULL và phân trang.',
    lessons: [
      {
        id: 'lesson-2',
        chapterId: 'ch2',
        chapterTitle: 'Bài 2: Ràng buộc, Xử lý chuỗi, NULL & Phân trang',
        title: 'Bài 2: Ràng buộc mở rộng, LIKE, NULL & Phân trang',
        slug: 'constraints-like-null-pagination',
        level: 'beginner',
        durationMinutes: 15,
        summary: 'Lọc sản phẩm theo tên chứa từ khóa, tìm kiếm trường NULL và lấy Top sản phẩm có sẵn bằng ORDER BY & LIMIT.',
        concepts: ['CHECK', 'DEFAULT', 'LIKE', 'IS NULL', 'ORDER BY', 'LIMIT'],
        initialSchemaTables: ['categories', 'products'],
        theory: `### 1. Lý thuyết cốt lõi
* **Ràng buộc (CHECK, DEFAULT, UNIQUE)**: Đảm bảo tính hợp lệ của dữ liệu ngay tại tầng lưu trữ.
* **Toán tử so sánh chuỗi**: \`LIKE\` đi kèm ký tự đại diện \`%\` (chuỗi ký tự bất kỳ) và \`_\` (chính xác một ký tự).
* **Giá trị NULL**: Biểu thị trạng thái thiếu dữ liệu/không xác định. Phải kiểm tra bằng \`IS NULL\` hoặc \`IS NOT NULL\`, tuyệt đối **không dùng toán tử =**.
* **Phân trang**: \`ORDER BY\` sắp xếp kết quả (\`ASC\`/\`DESC\`), kết hợp \`LIMIT ... OFFSET ...\` để cắt trang.

#### Cú pháp minh họa:
\`\`\`sql
SELECT product_name, price, stock_quantity 
FROM products 
WHERE stock_quantity > 0 
ORDER BY price DESC 
LIMIT 3;
\`\`\`
`,
        quizzes: [
          {
            id: 'q2-1',
            question: 'Biểu thức NULL = NULL trả về kết quả nào trong chuẩn SQL?',
            options: [
              { key: 'A', text: 'TRUE' },
              { key: 'B', text: 'FALSE' },
              { key: 'C', text: 'UNKNOWN / NULL' },
              { key: 'D', text: 'Lỗi cú pháp (Syntax Error)' },
            ],
            correctAnswer: 'C',
            explanation: 'Chuẩn SQL áp dụng logic 3 giá trị (Three-Valued Logic: TRUE, FALSE, UNKNOWN). So sánh với NULL luôn cho ra kết quả UNKNOWN vì giá trị NULL mang nghĩa là chưa xác định.',
          },
          {
            id: 'q2-2',
            question: "Để tìm tất cả các chuỗi có chữ cái thứ 2 là 'a', biểu thức nào sau đây đúng?",
            options: [
              { key: 'A', text: "LIKE '%a%'" },
              { key: 'B', text: "LIKE '_a%'" },
              { key: 'C', text: "LIKE 'a_%'" },
              { key: 'D', text: "LIKE '__a%'" },
            ],
            correctAnswer: 'B',
            explanation: "Ký tự gạch dưới '_' đại diện cho chính xác 1 ký tự đầu tiên, tiếp theo là ký tự 'a', và '%' đại diện cho bất kỳ chuỗi ký tự nào ở sau.",
          },
        ],
        essay: {
          question: 'Tại sao việc phân trang bằng cặp lệnh LIMIT 10 OFFSET 1000000 trên bảng lớn lại gây suy giảm hiệu năng nghiêm trọng? Nêu giải pháp thay thế.',
          detailedAnswer: `1. **Nguyên nhân**: Khi thực thi \`LIMIT 10 OFFSET 1000000\`, database engine vẫn buộc phải quét, đọc và giải mã qua 1,000,000 dòng dữ liệu trước đó từ đĩa/bộ nhớ, sau đó mới vứt bỏ chúng để lấy ra 10 dòng cuối cùng. Thao tác này gây tắc nghẽn tài nguyên CPU và I/O đĩa cực lớn.
2. **Giải pháp thay thế**: Sử dụng **Keyset Pagination (Cursor-based Pagination / Seek Method)**:
Thay vì dùng OFFSET, ta lưu lại ID của bản ghi cuối cùng của trang trước đó và truy vấn:
\`\`\`sql
SELECT * FROM products WHERE product_id > 1000000 ORDER BY product_id ASC LIMIT 10;
\`\`\`
Cách này tận dụng chỉ mục B-Tree để nhảy thẳng đến vị trí cần lấy chỉ với độ phức tạp $O(\\log N)$.`,
        },
        initialSql: `-- Yêu cầu: Lấy top 3 sản phẩm có giá cao nhất còn hàng trong kho (stock_quantity > 0)
SELECT product_name, price, stock_quantity 
FROM products 
WHERE stock_quantity > 0 
ORDER BY price DESC 
LIMIT 3;`,
        solutionSql: `SELECT product_name, price, stock_quantity 
FROM products 
WHERE stock_quantity > 0 
ORDER BY price DESC 
LIMIT 3;`,
        hint: 'Sử dụng WHERE stock_quantity > 0 ORDER BY price DESC LIMIT 3;',
        exercise: {
          prompt: 'Lấy top 3 sản phẩm (product_name, price, stock_quantity) có giá cao nhất trong kho còn hàng (stock_quantity > 0).',
          targetDescription: 'Kết quả gồm 3 sản phẩm đắt nhất: ThinkPad T14 ($1200), Gaming Monitor ($350), Ergonomic Chair ($220).',
          criteria: {
            requiredKeywords: ['SELECT', 'FROM', 'PRODUCTS', 'WHERE', 'STOCK_QUANTITY', 'ORDER', 'BY', 'DESC', 'LIMIT', '3'],
            customValidation: (sql, result) => {
              if (result && result.rows && result.rows.length === 3) {
                const topPrice = Number(result.rows[0][1]);
                if (topPrice === 1200) {
                  return { success: true, message: 'Xuất sắc! Đã lấy đúng top 3 sản phẩm giá cao nhất còn hàng trong kho.' };
                }
              }
              return { success: false, message: 'Kết quả chưa khớp với top 3 sản phẩm sắp xếp giá giảm dần.' };
            }
          }
        }
      }
    ]
  },

  // --- BÀI 3 ---
  {
    id: 'ch3',
    title: 'Bài 3: Hàm tập hợp, Gom nhóm & Lọc nhóm (GROUP BY, HAVING)',
    badge: '03',
    description: 'Làm chủ các hàm tổng hợp COUNT, SUM, AVG và phân biệt rõ ràng giữa bộ lọc WHERE và HAVING.',
    lessons: [
      {
        id: 'lesson-3',
        chapterId: 'ch3',
        chapterTitle: 'Bài 3: Hàm tập hợp, Gom nhóm & Lọc nhóm',
        title: 'Bài 3: Hàm tập hợp & Gom nhóm (GROUP BY, HAVING)',
        slug: 'group-by-having-aggregates',
        level: 'intermediate',
        durationMinutes: 20,
        summary: 'Tính tổng doanh thu đơn hàng theo từng cửa hàng và lọc các chi nhánh có doanh số thẻ tín dụng trên 1500.',
        concepts: ['COUNT', 'SUM', 'AVG', 'GROUP BY', 'HAVING'],
        initialSchemaTables: ['stores', 'sales'],
        theory: `### 1. Lý thuyết cốt lõi
* **Hàm tập hợp (Aggregate Functions)**: \`COUNT()\`, \`SUM()\`, \`AVG()\`, \`MIN()\`, \`MAX()\`. Các hàm này tự động bỏ qua giá trị NULL (ngoại trừ \`COUNT(*)\`).
* **Mệnh đề GROUP BY**: Thu gom nhiều bản ghi có cùng giá trị trên các cột chỉ định thành một nhóm duy nhất. Mọi cột trong \`SELECT\` bắt buộc phải nằm trong \`GROUP BY\` hoặc nằm trong hàm tập hợp.
* **Mệnh đề HAVING**: Lọc dữ liệu sau khi đã gom nhóm. Phân biệt rõ: \`WHERE\` lọc từng dòng riêng lẻ (trước khi gom), còn \`HAVING\` lọc điều kiện của nhóm (sau khi tính toán aggregate).

#### Cú pháp minh họa:
\`\`\`sql
SELECT store_id, SUM(amount) AS card_revenue 
FROM sales 
WHERE payment_method = 'Credit Card' 
GROUP BY store_id 
HAVING SUM(amount) > 1500;
\`\`\`
`,
        quizzes: [
          {
            id: 'q3-1',
            question: 'Điểm khác biệt mấu chốt giữa mệnh đề WHERE và HAVING là gì?',
            options: [
              { key: 'A', text: 'WHERE chỉ dùng cho số, HAVING chỉ dùng cho chuỗi.' },
              { key: 'B', text: 'WHERE lọc dòng trước khi gom nhóm; HAVING lọc nhóm sau khi thực hiện hàm tập hợp.' },
              { key: 'C', text: 'HAVING có thể thay thế hoàn toàn cho WHERE trong mọi trường hợp.' },
              { key: 'D', text: 'WHERE bắt buộc phải có ORDER BY đi kèm.' },
            ],
            correctAnswer: 'B',
            explanation: 'WHERE lọc từng dòng riêng lẻ tại bảng thô trước khi nạp vào GROUP BY; HAVING lọc trên kết quả tính toán của các hàm tập hợp sau khi đã gom nhóm.',
          },
          {
            id: 'q3-2',
            question: 'Lệnh COUNT(column_name) sẽ trả về điều gì nếu cột đó chứa 3 giá trị số và 2 giá trị NULL?',
            options: [
              { key: 'A', text: '5' },
              { key: 'B', text: '3' },
              { key: 'C', text: '2' },
              { key: 'D', text: 'Báo lỗi do không tính toán được giá trị NULL' },
            ],
            correctAnswer: 'B',
            explanation: 'Hàm COUNT(column_name) tự động loại bỏ các giá trị NULL và chỉ đếm các giá trị có thực (ở đây là 3). Chỉ có COUNT(*) mới đếm cả dòng NULL.',
          },
        ],
        essay: {
          question: 'Một lập trình viên viết truy vấn SELECT dept_id, full_name, AVG(salary) FROM employees GROUP BY dept_id. Truy vấn này có thực thi thành công không? Giải thích bản chất lỗi theo cơ chế xử lý của SQL Engine.',
          detailedAnswer: `Truy vấn này **KHÔNG** thể thực thi thành công (báo lỗi cú pháp/logic ở hầu hết các DBMS chuẩn SQL ANSI như PostgreSQL, SQL Server, Oracle).
* **Bản chất lỗi**: Mệnh đề \`GROUP BY dept_id\` thu gọn toàn bộ nhân viên trong cùng phòng ban thành 1 dòng kết quả duy nhất đại diện cho phòng ban đó. Trong khi đó, \`full_name\` lại chứa nhiều giá trị tên nhân viên khác nhau trong cùng 1 nhóm. SQL Engine không thể quyết định chọn tên của nhân viên nào để hiển thị bên cạnh giá trị trung bình \`AVG(salary)\`.
* **Quy tắc vàng**: Mọi cột xuất hiện trong mệnh đề \`SELECT\` bắt buộc phải nằm trong danh sách của \`GROUP BY\` hoặc phải được bao bọc bên trong một hàm tập hợp (Aggregate function).`,
        },
        initialSql: `-- Yêu cầu: Tìm những cửa hàng có tổng doanh thu từ hình thức 'Credit Card' vượt quá 1500.
SELECT store_id, SUM(amount) AS card_revenue 
FROM sales 
WHERE payment_method = 'Credit Card' 
GROUP BY store_id 
HAVING SUM(amount) > 1500;`,
        solutionSql: `SELECT store_id, SUM(amount) AS card_revenue 
FROM sales 
WHERE payment_method = 'Credit Card' 
GROUP BY store_id 
HAVING SUM(amount) > 1500;`,
        hint: "Dùng WHERE payment_method = 'Credit Card' GROUP BY store_id HAVING SUM(amount) > 1500;",
        exercise: {
          prompt: "Tìm cửa hàng (store_id, SUM(amount) AS card_revenue) có tổng doanh thu từ 'Credit Card' vượt quá 1500.",
          targetDescription: 'Kết quả trả về cửa hàng chi nhánh Cầu Giấy (store_id = 3) với doanh thu thẻ là 5600.',
          criteria: {
            requiredKeywords: ['SELECT', 'STORE_ID', 'SUM', 'FROM', 'SALES', 'WHERE', 'CREDIT', 'CARD', 'GROUP', 'BY', 'HAVING'],
            customValidation: (sql, result) => {
              if (result && result.rows && result.rows.length === 1) {
                const storeId = Number(result.rows[0][0]);
                const rev = Number(result.rows[0][1]);
                if (storeId === 3 && rev === 5600) {
                  return { success: true, message: 'Hoàn hảo! Đã xác định đúng cửa hàng 3 có tổng doanh thu thẻ vượt 1500 (đạt 5600).' };
                }
              }
              return { success: false, message: 'Kết quả chưa chính xác với yêu cầu GROUP BY kết hợp HAVING.' };
            }
          }
        }
      }
    ]
  },

  // --- BÀI 4 ---
  {
    id: 'ch4',
    title: 'Bài 4: Kỹ thuật Kết nối Đa bảng (Relational Joins)',
    badge: '04',
    description: 'Hiểu sâu bản chất các loại liên kết INNER JOIN, LEFT JOIN và kỹ thuật Anti-Join tìm kiếm bản ghi mồ côi.',
    lessons: [
      {
        id: 'lesson-4',
        chapterId: 'ch4',
        chapterTitle: 'Bài 4: Kỹ thuật Kết nối Đa bảng (Relational Joins)',
        title: 'Bài 4: Kỹ thuật Kết nối Đa bảng (INNER, LEFT JOIN)',
        slug: 'relational-joins-inner-left',
        level: 'intermediate',
        durationMinutes: 20,
        summary: 'Kết nối 3 bảng students, enrollments và courses để tổng hợp bảng điểm và tìm sinh viên chưa đăng ký học.',
        concepts: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'ANTI-JOIN', 'IS NULL'],
        initialSchemaTables: ['courses', 'students', 'enrollments'],
        theory: `### 1. Lý thuyết cốt lõi
* **INNER JOIN**: Trả về các dòng thỏa mãn điều kiện nối ở cả hai bảng.
* **LEFT (OUTER) JOIN**: Giữ nguyên toàn bộ dòng của bảng bên trái, ghép dữ liệu bảng bên phải nếu khớp; nếu không khớp, các cột của bảng phải nhận giá trị **NULL**.
* **RIGHT JOIN**: Ngược lại với LEFT JOIN.
* **FULL JOIN**: Giữ toàn bộ dữ liệu của cả hai bảng, điền NULL vào nơi không tìm thấy liên kết.
* **SELF JOIN**: Bảng tự kết nối với chính nó (ứng dụng cho mô hình quan hệ phân cấp cấp trên - cấp dưới).

#### Cú pháp minh họa:
\`\`\`sql
SELECT s.full_name, c.course_title, e.grade 
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id;
\`\`\`
`,
        quizzes: [
          {
            id: 'q4-1',
            question: 'Trong phép nối LEFT JOIN, nếu một dòng ở bảng bên trái không có dòng nào tương ứng ở bảng bên phải, giá trị của các cột thuộc bảng bên phải sẽ là:',
            options: [
              { key: 'A', text: "Chuỗi rỗng ''" },
              { key: 'B', text: 'Số 0' },
              { key: 'C', text: 'NULL' },
              { key: 'D', text: 'Dòng đó tự động bị loại bỏ khỏi kết quả' },
            ],
            correctAnswer: 'C',
            explanation: 'LEFT JOIN luôn giữ toàn bộ dòng của bảng bên trái; khi bảng phải không có khóa ngoại tương ứng, các cột bảng phải được điền giá trị NULL.',
          },
          {
            id: 'q4-2',
            question: 'Bảng A có 5 dòng, bảng B có 4 dòng. Thực hiện phép nối CROSS JOIN giữa A và B sẽ trả về bao nhiêu dòng?',
            options: [
              { key: 'A', text: '9' },
              { key: 'B', text: '20' },
              { key: 'C', text: '5' },
              { key: 'D', text: '0' },
            ],
            correctAnswer: 'B',
            explanation: 'CROSS JOIN là tích Descartes (Cartesian Product), nhân số hàng của bảng thứ nhất với số hàng bảng thứ hai: 5 * 4 = 20 dòng.',
          },
        ],
        essay: {
          question: 'Trình bày giải pháp sử dụng LEFT JOIN kết hợp mệnh đề WHERE ... IS NULL để tìm các bản ghi mồ côi (records không có tham chiếu ở bảng quan hệ). So sánh phương pháp này với toán tử NOT IN.',
          detailedAnswer: `1. **Kỹ thuật Anti-Join (LEFT JOIN + IS NULL)**:
Khi thực hiện \`LEFT JOIN bảng_con ON bảng_mẹ.id = bảng_con.parent_id\`, những bản ghi ở bảng mẹ không có liên kết bên bảng con sẽ có các cột của bảng con mang giá trị \`NULL\`. Ta chỉ cần lọc thêm \`WHERE bảng_con.id IS NULL\` để tìm chính xác các bản ghi mồ côi.
2. **So sánh với toán tử NOT IN**:
- Cú pháp \`WHERE id NOT IN (SELECT parent_id FROM bảng_con)\` rất nguy hiểm: nếu tập kết quả bên trong truy vấn con chứa dù chỉ **1 giá trị NULL**, toán tử NOT IN sẽ trả về tập rỗng (0 bản ghi) do cơ chế 3-Valued Logic (\`x <> NULL\` trả về UNKNOWN).
- Kỹ thuật \`LEFT JOIN ... WHERE ... IS NULL\` hoàn toàn an toàn trước giá trị NULL và thường được Database Query Optimizer tối ưu hóa thành thao tác Anti-Join cực nhanh.`,
        },
        initialSql: `-- Yêu cầu: Lấy danh sách sinh viên kèm tên môn học và điểm số (Kết nối đa bảng INNER JOIN).
SELECT s.full_name, c.course_title, e.grade 
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id;`,
        solutionSql: `SELECT s.full_name, c.course_title, e.grade 
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id;`,
        hint: 'Sử dụng INNER JOIN giữa students -> enrollments -> courses qua student_id và course_id.',
        exercise: {
          prompt: 'Viết truy vấn kết nối 3 bảng students, enrollments, courses để hiển thị full_name, course_title, grade.',
          targetDescription: 'Kết quả trả về danh sách 3 lượt đăng ký môn học kèm điểm số.',
          criteria: {
            requiredKeywords: ['SELECT', 'FROM', 'STUDENTS', 'JOIN', 'ENROLLMENTS', 'JOIN', 'COURSES'],
            customValidation: (sql, result) => {
              if (result && result.rows && result.rows.length === 3) {
                return { success: true, message: 'Chính xác! Đã nối thành công 3 bảng quan hệ (Students -> Enrollments -> Courses).' };
              }
              return { success: false, message: `Kết quả chưa đúng (mong đợi 3 dòng, nhận được ${result?.rows?.length ?? 0}).` };
            }
          }
        }
      }
    ]
  },

  // --- BÀI 5 ---
  {
    id: 'ch5',
    title: 'Bài 5: Truy vấn con (Subqueries), Phép thử Tồn tại (EXISTS) & Phép toán Tập hợp',
    badge: '05',
    description: 'Thành thạo Scalar Subquery, Correlated Subquery, toán tử EXISTS và phân biệt UNION vs UNION ALL.',
    lessons: [
      {
        id: 'lesson-5',
        chapterId: 'ch5',
        chapterTitle: 'Bài 5: Subqueries, EXISTS & Phép toán Tập hợp',
        title: 'Bài 5: Truy vấn con (Subqueries) & Phép thử EXISTS',
        slug: 'subqueries-exists-set-operators',
        level: 'intermediate',
        durationMinutes: 20,
        summary: 'Lọc hóa đơn cao hơn trung bình toàn hệ thống với Scalar Subquery và tìm khách hàng phát sinh đơn lớn bằng EXISTS.',
        concepts: ['Subquery', 'Scalar Subquery', 'Correlated Subquery', 'EXISTS', 'UNION'],
        initialSchemaTables: ['customers', 'invoices'],
        theory: `### 1. Lý thuyết cốt lõi
* **Subquery đơn dòng (Scalar Subquery)**: Trả về chính xác 1 dòng, 1 cột; thường dùng với các toán tử so sánh (\`=\`, \`>\`, \`<\`).
* **Subquery đa dòng**: Trả về một tập giá trị; kết hợp với các toán tử \`IN\`, \`ANY\`, \`ALL\`.
* **Correlated Subquery (Truy vấn con tương quan)**: Truy vấn con tham chiếu đến cột của truy vấn cha; chạy lặp lại cho từng dòng của truy vấn cha.
* **Toán tử EXISTS**: Kiểm tra sự tồn tại của dòng thỏa mãn điều kiện. Cơ chế dừng quét ngay khi gặp kết quả đầu tiên (Short-circuit evaluation), tối ưu hơn \`IN\` trên tập dữ liệu lớn.
* **Toán tử tập hợp**: \`UNION\` (loại bỏ phần tử trùng), \`UNION ALL\` (giữ nguyên bản ghi trùng lặp, tốc độ nhanh hơn).

#### Cú pháp minh họa:
\`\`\`sql
SELECT invoice_id, customer_id, total 
FROM invoices 
WHERE total > (SELECT AVG(total) FROM invoices);
\`\`\`
`,
        quizzes: [
          {
            id: 'q5-1',
            question: 'Toán tử NOT IN (subquery) sẽ trả về kết quả gì nếu truy vấn con chứa ít nhất một giá trị NULL?',
            options: [
              { key: 'A', text: 'Trả về toàn bộ các dòng khác NULL.' },
              { key: 'B', text: 'Trả về tập rỗng (0 bản ghi).' },
              { key: 'C', text: 'Báo lỗi vi phạm kiểu dữ liệu.' },
              { key: 'D', text: 'Tự động loại bỏ giá trị NULL và chạy bình thường.' },
            ],
            correctAnswer: 'B',
            explanation: 'Trong SQL 3-Valued Logic: x NOT IN (1, NULL) được phân tích thành (x <> 1 AND x <> NULL). Phép so sánh với NULL luôn cho UNKNOWN nên toàn bộ biểu thức không bao giờ TRUE, trả về 0 dòng.',
          },
          {
            id: 'q5-2',
            question: 'Điểm khác nhau chính giữa UNION và UNION ALL là:',
            options: [
              { key: 'A', text: 'UNION chạy nhanh hơn UNION ALL.' },
              { key: 'B', text: 'UNION ALL thực hiện thao tác sắp xếp và khử trùng dữ liệu.' },
              { key: 'C', text: 'UNION khử trùng bản ghi, còn UNION ALL giữ lại toàn bộ các bản ghi trùng lặp.' },
              { key: 'D', text: 'UNION có thể áp dụng cho các bảng khác số lượng cột.' },
            ],
            correctAnswer: 'C',
            explanation: 'UNION tự động khử trùng lặp (DISTINCT) nên tiêu tốn thêm tài nguyên sắp xếp (SORT/HASH). UNION ALL chỉ gộp dòng mà không lọc trùng, do đó chạy nhanh hơn.',
          },
        ],
        essay: {
          question: 'Phân tích sự khác biệt về mặt hiệu năng giữa IN và EXISTS khi truy vấn con trả về một bảng có hàng triệu bản ghi nhưng bảng cha chỉ có 100 bản ghi.',
          detailedAnswer: `1. **Khi dùng IN**:
Truy vấn con thường phải được thực thi độc lập trước để nạp toàn bộ hàng triệu bản ghi vào bộ nhớ (hoặc bảng tạm trong RAM/đĩa). Sau đó bảng cha (100 dòng) mới so khớp với tập hàng triệu dòng đó. Thao tác này gây áp lực RAM và CPU rất lớn.
2. **Khi dùng EXISTS**:
EXISTS hoạt động theo cơ chế Correlated Subquery và **Short-circuit Evaluation**: đối với mỗi dòng trong 100 dòng của bảng cha, truy vấn con chỉ cần tìm thấy **bản ghi đầu tiên** thỏa mãn là lập tức dừng quét ngay (không quét hết hàng triệu dòng còn lại). Kết quả là chỉ thực hiện tối đa 100 lần tìm kiếm với độ phức tạp cực thấp.`,
        },
        initialSql: `-- Yêu cầu: Tìm các hóa đơn có tổng tiền cao hơn mức hóa đơn trung bình của toàn hệ thống (Scalar Subquery).
SELECT invoice_id, customer_id, total 
FROM invoices 
WHERE total > (SELECT AVG(total) FROM invoices);`,
        solutionSql: `SELECT invoice_id, customer_id, total 
FROM invoices 
WHERE total > (SELECT AVG(total) FROM invoices);`,
        hint: 'Sử dụng WHERE total > (SELECT AVG(total) FROM invoices);',
        exercise: {
          prompt: 'Viết truy vấn tìm các hóa đơn (invoice_id, customer_id, total) có giá trị cao hơn mức trung bình của toàn hệ thống.',
          targetDescription: 'Hóa đơn trung bình là 2475. Kết quả gồm hóa đơn 502 (3400) và 504 (4500).',
          criteria: {
            requiredKeywords: ['SELECT', 'FROM', 'INVOICES', 'WHERE', 'TOTAL', '>', 'AVG'],
            customValidation: (sql, result) => {
              if (result && result.rows && result.rows.length === 2) {
                return { success: true, message: 'Tuyệt vời! Đã tìm được 2 hóa đơn có tổng tiền vượt mức trung bình hệ thống (2475).' };
              }
              return { success: false, message: 'Kết quả chưa chính xác (mong đợi 2 hóa đơn: 502 và 504).' };
            }
          }
        }
      }
    ]
  },

  // --- BÀI 6 ---
  {
    id: 'ch6',
    title: 'Bài 6: Thao tác Dữ liệu Nâng cao & Quản trị Giao dịch (DML & Transactions)',
    badge: '06',
    description: 'Nắm vững 4 thuộc tính ACID, kịch bản chuyển tiền an toàn với BEGIN, COMMIT, ROLLBACK và kiểm soát Deadlock.',
    lessons: [
      {
        id: 'lesson-6',
        chapterId: 'ch6',
        chapterTitle: 'Bài 6: DML & Quản trị Giao dịch (ACID)',
        title: 'Bài 6: Thao tác Dữ liệu Nâng cao & Giao dịch (ACID)',
        slug: 'dml-transactions-acid',
        level: 'advanced',
        durationMinutes: 25,
        summary: 'Thực hiện chuyển khoản an toàn giữa hai tài khoản ngân hàng với tính toàn vẹn tuyệt đối của Transaction.',
        concepts: ['Transaction', 'ACID', 'BEGIN', 'COMMIT', 'ROLLBACK', 'Deadlock'],
        initialSchemaTables: ['accounts', 'account_logs'],
        theory: `### 1. Lý thuyết cốt lõi
* **DML Nâng cao**: \`INSERT INTO ... SELECT\`, \`UPDATE\` kết hợp điều kiện, \`DELETE\` có ràng buộc.
* **Giao dịch (Transaction) & Tính chất ACID**:
  * **Atomicity (Nguyên tử)**: Tất cả thao tác thành công hoặc toàn bộ bị hủy bỏ (All or Nothing).
  * **Consistency (Nhất quán)**: Dữ liệu luôn tuân thủ các ràng buộc trước và sau giao dịch.
  * **Isolation (Cô lập)**: Các giao dịch chạy đồng thời không can thiệp lẫn nhau.
  * **Durability (Bền vững)**: Dữ liệu đã xác nhận (\`COMMIT\`) sẽ tồn tại vĩnh viễn dù hệ thống gặp sự cố sập nguồn.
* **Điều khiển giao dịch**: \`BEGIN TRANSACTION\`, \`COMMIT\`, \`ROLLBACK\`.

#### Cú pháp minh họa:
\`\`\`sql
BEGIN;
UPDATE accounts SET balance = balance - 1000.00 WHERE account_id = 101;
UPDATE accounts SET balance = balance + 1000.00 WHERE account_id = 102;
COMMIT;
\`\`\`
`,
        quizzes: [
          {
            id: 'q6-1',
            question: 'Trong giao dịch ngân hàng chuyển khoản, nếu tiền đã trừ ở tài khoản A nhưng xảy ra lỗi mất điện trước khi cộng vào tài khoản B, lệnh nào được kích hoạt để khôi phục trạng thái ban đầu?',
            options: [
              { key: 'A', text: 'COMMIT' },
              { key: 'B', text: 'ROLLBACK' },
              { key: 'C', text: 'SAVEPOINT' },
              { key: 'D', text: 'TRUNCATE' },
            ],
            correctAnswer: 'B',
            explanation: 'ROLLBACK có nhiệm vụ hủy bỏ mọi thay đổi tạm thời trong bộ đệm giao dịch, khôi phục dữ liệu về trạng thái toàn vẹn ban đầu (tính Atomicity).',
          },
          {
            id: 'q6-2',
            question: 'Mức độ cô lập (Isolation Level) nào ngăn chặn được hiện tượng Dirty Read?',
            options: [
              { key: 'A', text: 'READ UNCOMMITTED' },
              { key: 'B', text: 'READ COMMITTED' },
              { key: 'C', text: 'Không có mức nào ngăn được' },
              { key: 'D', text: 'Chỉ có SERIALIZABLE' },
            ],
            correctAnswer: 'B',
            explanation: 'READ COMMITTED là mức cô lập đảm bảo câu lệnh chỉ đọc dữ liệu đã được xác nhận (COMMITTED), hoàn toàn loại bỏ hiện tượng Dirty Read.',
          },
        ],
        essay: {
          question: 'Deadlock là gì? Trình bày một kịch bản thực tế phát sinh Deadlock giữa hai giao dịch đồng thời và cách ứng dụng backend phòng tránh hiện tượng này.',
          detailedAnswer: `1. **Khái niệm Deadlock**: Là hiện tượng bế tắc khi hai hay nhiều giao dịch đồng thời chiếm giữ tài nguyên mà bên kia đang cần, khiến cả hai bên rơi vào trạng thái chờ đợi lẫn nhau vô tận.
2. **Kịch bản thực tế**:
- Giao dịch 1: Trừ tiền tài khoản A (đang giữ Lock A) -> chuẩn bị cộng tiền tài khoản B (chờ Lock B).
- Cùng thời điểm đó, Giao dịch 2: Trừ tiền tài khoản B (đang giữ Lock B) -> chuẩn bị cộng tiền tài khoản A (chờ Lock A).
- Cả hai giao dịch cùng chờ đợi nhau giải phóng Lock, tạo thành Deadlock.
3. **Cách phòng tránh ở tầng Backend**:
- **Cố định thứ tự khóa tài nguyên (Lock Ordering)**: Quy ước mọi giao dịch chuyển tiền phải luôn khóa tài khoản có ID nhỏ hơn trước:
\`SELECT * FROM accounts WHERE id IN (A, B) ORDER BY id ASC FOR UPDATE\`.
- Thiết lập \`lock_timeout\` để giao dịch tự động giải phóng khi chờ đợi quá lâu.`,
        },
        initialSql: `-- Yêu cầu: Thực hiện chuyển khoản an toàn 1000 từ tài khoản 101 sang tài khoản 102
BEGIN;
UPDATE accounts SET balance = balance - 1000 WHERE account_id = 101;
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 102;
COMMIT;

SELECT account_id, owner_name, balance FROM accounts;`,
        solutionSql: `BEGIN;
UPDATE accounts SET balance = balance - 1000 WHERE account_id = 101;
UPDATE accounts SET balance = balance + 1000 WHERE account_id = 102;
COMMIT;

SELECT account_id, owner_name, balance FROM accounts;`,
        hint: 'Sử dụng khối BEGIN ... COMMIT với 2 lệnh UPDATE balance và kết thúc bằng SELECT kiểm tra.',
        exercise: {
          prompt: 'Thực hiện chuyển khoản an toàn 1000 từ tài khoản 101 sang 102 trong một khối Transaction (BEGIN ... COMMIT).',
          targetDescription: 'Số dư sau chuyển: Tài khoản 101 còn 4000, Tài khoản 102 lên 2200.',
          criteria: {
            requiredKeywords: ['BEGIN', 'UPDATE', 'ACCOUNTS', 'SET', 'BALANCE', 'COMMIT', 'SELECT'],
            customValidation: (sql, result, tables) => {
              const accTable = tables.find(t => t.name.toLowerCase() === 'accounts');
              if (accTable) {
                const acc1 = accTable.rows.find((r: any) => r.account_id == 101);
                const acc2 = accTable.rows.find((r: any) => r.account_id == 102);
                if (acc1 && acc2 && acc1.balance === 4000 && acc2.balance === 2200) {
                  return { success: true, message: 'Giao dịch chuyển tiền thành công trọn vẹn! Số dư đã được cập nhật chính xác (4000 và 2200).' };
                }
              }
              return { success: false, message: 'Số dư tài khoản chưa được cập nhật chính xác theo yêu cầu giao dịch.' };
            }
          }
        }
      }
    ]
  },

  // --- BÀI 7 ---
  {
    id: 'ch7',
    title: 'Bài 7: Biểu thức Bảng chung (CTE), Đệ quy & Điều kiện Phân nhánh (CASE WHEN)',
    badge: '07',
    description: 'Học cách làm gọn câu lệnh với WITH CTE, duyệt cây phân cấp tổ chức bằng Recursive CTE và rẽ nhánh với CASE WHEN.',
    lessons: [
      {
        id: 'lesson-7',
        chapterId: 'ch7',
        chapterTitle: 'Bài 7: CTE, Đệ quy & CASE WHEN',
        title: 'Bài 7: Biểu thức Bảng chung (CTE) & CASE WHEN',
        slug: 'cte-recursive-case-when',
        level: 'advanced',
        durationMinutes: 25,
        summary: 'Phân loại cấp bậc lương bằng biểu thức CASE WHEN và sử dụng CTE Đệ quy để truy vết cây cấp bậc quản lý nhân sự.',
        concepts: ['CTE', 'WITH', 'WITH RECURSIVE', 'CASE WHEN', 'Hierarchical Data'],
        initialSchemaTables: ['organization'],
        theory: `### 1. Lý thuyết cốt lõi
* **Common Table Expression (CTE)**: Định nghĩa tập kết quả tạm thời bằng mệnh đề \`WITH\`, giúp câu lệnh rõ ràng, tách bạch logic hơn so với việc lồng nhiều tầng Subquery.
* **Recursive CTE (CTE Đệ quy)**: Cấu trúc gồm phần mỏ neo (Anchor member) kết hợp với phần đệ quy (Recursive member) qua toán tử \`UNION ALL\`. Chuyên dùng để duyệt cây danh mục, cấu trúc phòng ban cấp bậc.
* **Biểu thức CASE WHEN**: Cung cấp cấu trúc rẽ nhánh IF-THEN-ELSE trực tiếp bên trong câu lệnh SQL.

#### Cú pháp minh họa:
\`\`\`sql
SELECT emp_name, title,
    CASE 
        WHEN title IN ('CEO', 'CTO', 'CFO') THEN 'Executive'
        WHEN title LIKE '%Lead%' THEN 'Management'
        ELSE 'Staff'
    END AS employee_level
FROM organization;
\`\`\`
`,
        quizzes: [
          {
            id: 'q7-1',
            question: 'Thành phần nào bắt buộc phải có trong một Recursive CTE để tránh vòng lặp vô tận?',
            options: [
              { key: 'A', text: 'Điều kiện dừng trong phần đệ quy (Termination condition)' },
              { key: 'B', text: 'Lệnh ORDER BY' },
              { key: 'C', text: 'Toán tử UNION thay vì UNION ALL' },
              { key: 'D', text: 'Hàm tổng hợp COUNT()' },
            ],
            correctAnswer: 'A',
            explanation: 'Recursive CTE bắt buộc phải có điều kiện dừng (thường là phép JOIN kết thúc khi không còn dòng con thỏa mãn) để ngăn ngừa vòng lặp vô tận.',
          },
          {
            id: 'q7-2',
            question: 'Biểu thức CASE WHEN condition THEN result END sẽ trả về giá trị gì nếu không có điều kiện nào thỏa mãn và không khai báo nhánh ELSE?',
            options: [
              { key: 'A', text: '0' },
              { key: 'B', text: "Chuỗi rỗng ''" },
              { key: 'C', text: 'NULL' },
              { key: 'D', text: 'Báo lỗi cú pháp' },
            ],
            correctAnswer: 'C',
            explanation: 'Trong SQL chuẩn, nếu không có nhánh ELSE rõ ràng, mọi trường hợp không khớp điều kiện WHEN đều tự động nhận giá trị NULL.',
          },
        ],
        essay: {
          question: 'So sánh CTE (WITH) và Bảng tạm (TEMPORARY TABLE) về mặt quản lý vòng đời (lifecycle), phạm vi truy cập (scope) và tài nguyên bộ nhớ/ổ đĩa.',
          detailedAnswer: `1. **Vòng đời & Phạm vi (Lifecycle & Scope)**:
- **CTE (WITH)**: Chỉ tồn tại trong phạm vi của đúng một câu lệnh SQL duy nhất chứa nó. Ngay sau khi câu lệnh hoàn tất, CTE tự động biến mất.
- **TEMPORARY TABLE**: Tồn tại xuyên suốt toàn bộ phiên làm việc (Session/Connection) của người dùng và có thể được tái sử dụng trong nhiều câu lệnh tiếp theo cho đến khi phiên kết thúc hoặc bị DROP.
2. **Tài nguyên & Hiệu năng**:
- **CTE**: Thường được Optimizer gộp trực tiếp vào kế hoạch thực thi (Inline query optimization), không ghi xuống đĩa, phù hợp cho logic đọc dữ liệu trong sáng.
- **TEMPORARY TABLE**: Có thể tạo Index riêng, lưu trữ dữ liệu trung gian khối lượng lớn và duy trì Statistics độc lập, rất thích hợp cho các quy trình ETL phân tích dữ liệu nhiều bước phức tạp.`,
        },
        initialSql: `-- Yêu cầu: Phân loại cấp bậc nhân sự bằng biểu thức CASE WHEN
SELECT emp_name, title,
    CASE 
        WHEN title IN ('CEO', 'CTO', 'CFO') THEN 'Executive'
        WHEN title LIKE '%Lead%' THEN 'Management'
        ELSE 'Staff'
    END AS employee_level
FROM organization;`,
        solutionSql: `SELECT emp_name, title,
    CASE 
        WHEN title IN ('CEO', 'CTO', 'CFO') THEN 'Executive'
        WHEN title LIKE '%Lead%' THEN 'Management'
        ELSE 'Staff'
    END AS employee_level
FROM organization;`,
        hint: 'Sử dụng CASE WHEN title IN (...) THEN ... WHEN ... LIKE ... THEN ... ELSE ... END AS employee_level',
        exercise: {
          prompt: 'Viết biểu thức CASE WHEN phân loại cấp bậc nhân viên: CEO/CTO/CFO là Executive, có chữ Lead là Management, còn lại là Staff.',
          targetDescription: 'Trả về danh sách 6 nhân viên với cột employee_level tương ứng.',
          criteria: {
            requiredKeywords: ['SELECT', 'CASE', 'WHEN', 'THEN', 'EXECUTIVE', 'MANAGEMENT', 'ELSE', 'STAFF', 'END'],
            customValidation: (sql, result) => {
              if (result && result.rows && result.rows.length === 6) {
                return { success: true, message: 'Chính xác! Đã phân loại cấp bậc nhân sự hoàn hảo bằng CASE WHEN.' };
              }
              return { success: false, message: 'Kết quả phân nhóm nhân viên chưa đủ 6 dòng.' };
            }
          }
        }
      }
    ]
  },

  // --- BÀI 8 ---
  {
    id: 'ch8',
    title: 'Bài 8: Hàm Cửa sổ Phân tích (Window Functions)',
    badge: '08',
    description: 'Nâng cao khả năng phân tích dữ liệu chuyên nghiệp với OVER, PARTITION BY, DENSE_RANK, LAG và Running Total.',
    lessons: [
      {
        id: 'lesson-8',
        chapterId: 'ch8',
        chapterTitle: 'Bài 8: Hàm Cửa sổ Phân tích (Window Functions)',
        title: 'Bài 8: Hàm Cửa sổ Phân tích (Window Functions)',
        slug: 'window-functions-over-partition',
        level: 'advanced',
        durationMinutes: 25,
        summary: 'Đánh số thứ hạng doanh số từng nhân viên với DENSE_RANK và tính tổng doanh thu lũy kế qua các tháng với LAG/SUM.',
        concepts: ['Window Functions', 'OVER', 'PARTITION BY', 'DENSE_RANK', 'LAG', 'Running Total'],
        initialSchemaTables: ['monthly_sales'],
        theory: `### 1. Lý thuyết cốt lõi
* **Khái niệm Window Function**: Tính toán trên một tập các dòng có liên quan đến dòng hiện tại (Window Frame) mà **không làm gộp dòng** như \`GROUP BY\`.
* **Cú pháp chung**: \`<Hàm>() OVER (PARTITION BY [cột chia cụm] ORDER BY [cột sắp thứ tự])\`.
* **Nhóm hàm xếp hạng**:
  * \`ROW_NUMBER()\`: Cấp số thứ tự liên tục duy nhất (1, 2, 3, 4...).
  * \`RANK()\`: Đồng hạng thì chung số, nhảy cách bậc (1, 2, 2, 4...).
  * \`DENSE_RANK()\`: Đồng hạng chung số, không nhảy cách bậc (1, 2, 2, 3...).
* **Nhóm hàm dịch chuyển giá trị**: \`LEAD()\` (lấy dòng phía sau), \`LAG()\` (lấy dòng phía trước) phục vụ bài toán so sánh tăng trưởng qua các kỳ.

#### Cú pháp minh họa:
\`\`\`sql
SELECT salesperson, sale_month, revenue,
       DENSE_RANK() OVER (PARTITION BY salesperson ORDER BY revenue DESC) AS rank_in_staff
FROM monthly_sales;
\`\`\`
`,
        quizzes: [
          {
            id: 'q8-1',
            question: 'Có 3 nhân viên cùng có mức lương cao nhất là 3000. Hàm DENSE_RANK() sẽ gán thứ hạng cho người có mức lương cao tiếp theo (2500) là bao nhiêu?',
            options: [
              { key: 'A', text: '2' },
              { key: 'B', text: '4' },
              { key: 'C', text: '3' },
              { key: 'D', text: '1' },
            ],
            correctAnswer: 'A',
            explanation: 'DENSE_RANK() không nhảy cách bậc (dense). Ba người đồng hạng 1 thì người kế tiếp nhận hạng 2. (Nếu dùng hàm RANK() thông thường thì người tiếp theo mới nhận hạng 4).',
          },
          {
            id: 'q8-2',
            question: 'Điểm khác biệt căn bản giữa SUM() OVER(PARTITION BY ...) và SUM() ... GROUP BY là:',
            options: [
              { key: 'A', text: 'Window Function yêu cầu ít RAM hơn.' },
              { key: 'B', text: 'Window Function giữ nguyên số lượng dòng ban đầu của bảng; GROUP BY gom các dòng lại thành một dòng đại diện.' },
              { key: 'C', text: 'GROUP BY chỉ dùng được trên số nguyên.' },
              { key: 'D', text: 'Cả hai cho ra cấu trúc bảng kết quả hoàn toàn giống nhau.' },
            ],
            correctAnswer: 'B',
            explanation: 'Window Function duy trì số lượng dòng ban đầu của bảng và đính kèm giá trị tổng hợp vào từng dòng; GROUP BY làm biến dạng cấu trúc ban đầu, thu gọn nhiều dòng thành một dòng đại diện duy nhất.',
          },
        ],
        essay: {
          question: 'Giải thích ý nghĩa của mệnh đề mặc định ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW khi sử dụng hàm tổng hợp kèm ORDER BY bên trong OVER(). Nó ảnh hưởng như thế nào đến việc tính tổng lũy kế (running total)?',
          detailedAnswer: `1. **Ý nghĩa**:
Mệnh đề định nghĩa khung cửa sổ phân tích (Window Frame) bao gồm:
- \`UNBOUNDED PRECEDING\`: Bắt đầu từ bản ghi đầu tiên trong phân vùng (partition).
- \`CURRENT ROW\`: Kết thúc tại chính bản ghi đang được con trỏ xử lý.
2. **Ảnh hưởng đến Running Total**:
Khi kết hợp với \`SUM(revenue) OVER (PARTITION BY staff ORDER BY month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\`, tại mỗi tháng, hệ thống sẽ cộng dồn doanh số từ tháng đầu tiên cho đến tháng hiện tại. Điều này tạo ra giá trị **Tổng lũy kế (Running Total)** phục vụ biểu đồ tăng trưởng kinh doanh mà không cần viết các câu lệnh lặp hoặc self-join phức tạp.`,
        },
        initialSql: `-- Yêu cầu: Đánh số thứ tự doanh thu từ cao xuống thấp cho từng nhân viên (DENSE_RANK)
SELECT salesperson, sale_month, revenue,
       DENSE_RANK() OVER (PARTITION BY salesperson ORDER BY revenue DESC) AS rank_in_staff
FROM monthly_sales;`,
        solutionSql: `SELECT salesperson, sale_month, revenue,
       DENSE_RANK() OVER (PARTITION BY salesperson ORDER BY revenue DESC) AS rank_in_staff
FROM monthly_sales;`,
        hint: 'Sử dụng DENSE_RANK() OVER (PARTITION BY salesperson ORDER BY revenue DESC) AS rank_in_staff',
        exercise: {
          prompt: 'Sử dụng hàm DENSE_RANK() xếp hạng doanh thu từ cao xuống thấp của từng nhân viên (PARTITION BY salesperson).',
          targetDescription: 'Kết quả xếp hạng doanh số nội bộ của Alice (tháng 2 top 1, tháng 3 top 2, tháng 1 top 3) và Bob.',
          criteria: {
            requiredKeywords: ['SELECT', 'DENSE_RANK', 'OVER', 'PARTITION', 'BY', 'SALESPERSON', 'ORDER', 'BY', 'REVENUE', 'DESC'],
            customValidation: (sql, result) => {
              if (result && result.rows && result.rows.length === 6) {
                return { success: true, message: 'Xuất sắc! Đã tính toán thứ hạng nhân viên chính xác bằng hàm cửa sổ DENSE_RANK().' };
              }
              return { success: false, message: 'Kết quả tính toán Window Function chưa chính xác.' };
            }
          }
        }
      }
    ]
  },

  // --- BÀI 9 ---
  {
    id: 'ch9',
    title: 'Bài 9: Chỉ mục (Indexes), Khung nhìn (Views) & Tối ưu hóa Truy vấn (Performance Tuning)',
    badge: '09',
    description: 'Chinh phục cơ chế B-Tree Index, quy tắc Sargable Query, Khung nhìn bảo mật Views và tối ưu hóa hệ thống dữ liệu lớn.',
    lessons: [
      {
        id: 'lesson-9',
        chapterId: 'ch9',
        chapterTitle: 'Bài 9: Chỉ mục, Views & Tối ưu hóa Truy vấn',
        title: 'Bài 9: Chỉ mục (Indexes), Views & Tối ưu hóa Truy vấn',
        slug: 'indexes-views-performance-tuning',
        level: 'advanced',
        durationMinutes: 25,
        summary: 'Tạo Composite Index, viết truy vấn chuẩn Sargable để tận dụng tối đa cây B-Tree và tạo Views che giấu dữ liệu nhạy cảm.',
        concepts: ['B-Tree Index', 'Clustered Index', 'Sargable Query', 'Composite Index', 'Views'],
        initialSchemaTables: ['user_logs'],
        theory: `### 1. Lý thuyết cốt lõi
* **Cơ chế B-Tree Index**: Cây tìm kiếm cân bằng giúp hạ độ phức tạp truy xuất từ quét toàn bảng (Full Table Scan - $O(N)$) xuống tìm kiếm theo nhánh ($O(\\log N)$).
* **Phân loại Index**:
  * **Clustered Index**: Quyết định trực tiếp thứ tự vật lý của các dòng dữ liệu trên ổ cứng (thường gắn với \`PRIMARY KEY\`). Mỗi bảng chỉ có duy nhất 1 Clustered Index.
  * **Non-Clustered Index**: Cấu trúc cây phụ lưu trữ con trỏ trỏ về dòng dữ liệu thực tế (Bảng có thể có nhiều Non-Clustered Index).
* **Khái niệm Sargable Query**: Viết điều kiện lọc sao cho RDBMS có thể tận dụng được Index. Không bao bọc cột bằng hàm toán học hoặc chuyển đổi kiểu dữ liệu ngầm (VD: tránh viết \`WHERE YEAR(date) = 2026\`, thay bằng \`WHERE date >= '2026-01-01' AND date < '2027-01-01'\`).
* **Views**: Bảng ảo đại diện cho một câu truy vấn \`SELECT\` phức tạp, giúp tăng tính bảo mật và trừu tượng hóa mô hình dữ liệu.

#### Cú pháp minh họa:
\`\`\`sql
CREATE INDEX idx_user_logs_user_date ON user_logs (user_id, created_at);

SELECT log_id, action, created_at 
FROM user_logs 
WHERE user_id = 1001 
  AND created_at >= '2026-04-01 00:00:00' 
  AND created_at < '2026-04-02 00:00:00';
\`\`\`
`,
        quizzes: [
          {
            id: 'q9-1',
            question: "Thao tác nào sau đây sẽ khiến chỉ mục (Index) trên cột phone_number bị vô hiệu hóa (Non-Sargable)?",
            options: [
              { key: 'A', text: "WHERE phone_number = '0905123456'" },
              { key: 'B', text: "WHERE phone_number LIKE '090%'" },
              { key: 'C', text: "WHERE SUBSTRING(phone_number, 1, 3) = '090'" },
              { key: 'D', text: "WHERE phone_number IN ('0905123456', '0905999888')" },
            ],
            correctAnswer: 'C',
            explanation: 'Bao bọc tên cột trong một hàm như SUBSTRING(...) làm vô hiệu hóa khả năng duyệt cây B-Tree của Index, buộc Database phải quét toàn bộ bảng (Full Table Scan).',
          },
          {
            id: 'q9-2',
            question: 'Việc tạo quá nhiều chỉ mục (Index) trên một bảng sẽ dẫn đến hệ quả tiêu cực nào?',
            options: [
              { key: 'A', text: 'Giảm tốc độ câu lệnh SELECT.' },
              { key: 'B', text: 'Làm chậm đáng kể các thao tác ghi dữ liệu (INSERT, UPDATE, DELETE) và tăng dung lượng đĩa lưu trữ.' },
              { key: 'C', text: 'Xảy ra lỗi hỏng toàn vẹn dữ liệu.' },
              { key: 'D', text: 'Vô hiệu hóa tính năng của các khóa ngoại.' },
            ],
            correctAnswer: 'B',
            explanation: 'Mỗi khi có thao tác ghi (INSERT, UPDATE, DELETE), database phải cập nhật lại cấu trúc của toàn bộ các cây B-Tree Index tương ứng, làm chậm đáng kể hiệu năng ghi.',
          },
        ],
        essay: {
          question: 'Thế nào là một Composite Index (Chỉ mục kết hợp)? Trình bày quy tắc "Cột ngoài cùng bên trái" (Leftmost Prefix Rule) khi tối ưu truy vấn nhiều điều kiện lọc WHERE col_a = ? AND col_b = ?.',
          detailedAnswer: `1. **Composite Index**: Là chỉ mục được xây dựng trên sự kết hợp của từ 2 cột trở lên (ví dụ: \`CREATE INDEX idx ON orders (user_id, order_date)\`).
2. **Quy tắc Leftmost Prefix Rule**:
- Database Engine xây dựng cấu trúc cây B-Tree sắp xếp tuần tự theo thứ tự cột được khai báo từ trái qua phải.
- Chỉ mục kết hợp chỉ có thể được kích hoạt tối ưu nếu câu truy vấn chứa các cột tiền tố ngoài cùng bên trái.
- Ví dụ với \`Index (col_a, col_b)\`:
  - \`WHERE col_a = 1 AND col_b = 2\`: Tận dụng trọn vẹn cả 2 cột của Index.
  - \`WHERE col_a = 1\`: Vẫn tận dụng được Index (vì chứa tiền tố bên trái \`col_a\`).
  - \`WHERE col_b = 2\`: **KHÔNG** thể tận dụng được Index vì đã bỏ qua cột ngoài cùng bên trái (\`col_a\`), buộc hệ thống phải quét toàn bảng.`,
        },
        initialSql: `-- Yêu cầu: Tạo Composite Index và viết truy vấn chuẩn Sargable
CREATE INDEX idx_user_logs_user_date ON user_logs (user_id, created_at);

SELECT log_id, action, created_at 
FROM user_logs 
WHERE user_id = 1001 
  AND created_at >= '2026-04-01 00:00:00' 
  AND created_at < '2026-04-02 00:00:00';`,
        solutionSql: `CREATE INDEX idx_user_logs_user_date ON user_logs (user_id, created_at);

SELECT log_id, action, created_at 
FROM user_logs 
WHERE user_id = 1001 
  AND created_at >= '2026-04-01 00:00:00' 
  AND created_at < '2026-04-02 00:00:00';`,
        hint: 'Sử dụng CREATE INDEX idx_user_logs_user_date ON user_logs (user_id, created_at); kết hợp truy vấn WHERE user_id = 1001 AND created_at >= ...',
        exercise: {
          prompt: 'Tạo chỉ mục Composite Index (user_id, created_at) trên user_logs và viết câu lệnh SELECT chuẩn Sargable lọc hoạt động ngày 2026-04-01 của user 1001.',
          targetDescription: 'Khởi tạo thành công B-Tree Index và trả về 3 nhật ký hoạt động (LOGIN, UPDATE_PROFILE, LOGOUT).',
          criteria: {
            requiredKeywords: ['CREATE', 'INDEX', 'ON', 'USER_LOGS', 'SELECT', 'WHERE', 'USER_ID', '1001'],
            customValidation: (sql, result) => {
              if (result && result.rows && result.rows.length === 3) {
                return { success: true, message: 'Tuyệt đỉnh! Đã khởi tạo B-Tree Index và truy vấn tối ưu chuẩn Sargable thành công.' };
              }
              return { success: false, message: 'Kết quả lọc nhật ký người dùng chưa đạt 3 bản ghi.' };
            }
          }
        }
      }
    ]
  },
];
