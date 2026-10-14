import { TableSchema } from '../types/sql';


// ========================================================
// CƠ SỞ DỮ LIỆU CÔNG TY (DB CTY) DÀNH CHO THỰC HÀNH TỰ DO
// Thiết kế thuần Tiếng Việt, đơn giản và dễ hiểu cho người mới học SQL.
// Bao gồm 4 bảng có quan hệ liên kết khóa chính (PK) và khóa ngoại (FK):
// 1. PHONGBAN (Phòng ban công ty)
// 2. NHANVIEN (Nhân viên) -> FK đến PHONGBAN (MAPB)
// 3. DUAN (Dự án công ty) -> FK đến PHONGBAN (MAPB)
// 4. PHANCONG (Phân công nhân viên tham gia dự án) -> FK đến NHANVIEN (MANV) & DUAN (MADA)
// ========================================================
export const companyDbTables: TableSchema[] = [
  // ------------------------------------------------------
  // 1. BẢNG PHONGBAN: Quản lý danh sách các phòng ban
  // ------------------------------------------------------
  {
    name: 'PHONGBAN',
    columns: [
      { name: 'MAPB', type: 'INTEGER', isPrimary: true, nullable: false },
      { name: 'TENPB', type: 'TEXT', nullable: false },
      { name: 'DIADIEM', type: 'TEXT', nullable: true },
      { name: 'NGANSACH', type: 'INTEGER', nullable: false },
    ],
    rows: [
      {
        MAPB: 1,
        TENPB: 'Phòng Kỹ Thuật (IT)',
        DIADIEM: 'Tầng 4 - Tòa A',
        NGANSACH: 500000000,
      },
      {
        MAPB: 2,
        TENPB: 'Phòng Kinh Doanh',
        DIADIEM: 'Tầng 3 - Tòa A',
        NGANSACH: 350000000,
      },
      {
        MAPB: 3,
        TENPB: 'Phòng Nhân Sự',
        DIADIEM: 'Tầng 2 - Tòa B',
        NGANSACH: 150000000,
      },
      {
        MAPB: 4,
        TENPB: 'Phòng Kế Toán',
        DIADIEM: 'Tầng 2 - Tòa A',
        NGANSACH: 200000000,
      },
    ],
  },

  // ------------------------------------------------------
  // 2. BẢNG NHANVIEN: Quản lý hồ sơ và mức lương của nhân viên
  // ------------------------------------------------------
  {
    name: 'NHANVIEN',
    columns: [
      { name: 'MANV', type: 'INTEGER', isPrimary: true, nullable: false },
      { name: 'HOTEN', type: 'TEXT', nullable: false },
      { name: 'GIOITINH', type: 'TEXT', nullable: false },
      { name: 'NGAYSINH', type: 'TEXT', nullable: false },
      { name: 'CHUCVU', type: 'TEXT', nullable: false },
      { name: 'LUONG', type: 'INTEGER', nullable: false },
      {
        name: 'MAPB',
        type: 'INTEGER',
        isForeign: true,
        foreignKeyTarget: { table: 'PHONGBAN', column: 'MAPB' },
        nullable: false,
      },
    ],
    rows: [
      {
        MANV: 1,
        HOTEN: 'Nguyễn Văn An',
        GIOITINH: 'Nam',
        NGAYSINH: '1992-05-15',
        CHUCVU: 'Trưởng phòng IT',
        LUONG: 28000000,
        MAPB: 1,
      },
      {
        MANV: 2,
        HOTEN: 'Trần Thị Mai',
        GIOITINH: 'Nữ',
        NGAYSINH: '1996-08-22',
        CHUCVU: 'Lập trình viên Backend',
        LUONG: 18000000,
        MAPB: 1,
      },
      {
        MANV: 3,
        HOTEN: 'Lê Hoàng Nam',
        GIOITINH: 'Nam',
        NGAYSINH: '1998-11-04',
        CHUCVU: 'Lập trình viên Frontend',
        LUONG: 16000000,
        MAPB: 1,
      },
      {
        MANV: 4,
        HOTEN: 'Phạm Quốc Bảo',
        GIOITINH: 'Nam',
        NGAYSINH: '1994-02-18',
        CHUCVU: 'Trưởng phòng Kinh Doanh',
        LUONG: 25000000,
        MAPB: 2,
      },
      {
        MANV: 5,
        HOTEN: 'Hoàng Thu Trang',
        GIOITINH: 'Nữ',
        NGAYSINH: '1999-09-30',
        CHUCVU: 'Chuyên viên Sale',
        LUONG: 13000000,
        MAPB: 2,
      },
      {
        MANV: 6,
        HOTEN: 'Đỗ Minh Trí',
        GIOITINH: 'Nam',
        NGAYSINH: '1995-12-10',
        CHUCVU: 'Trưởng phòng Kế Toán',
        LUONG: 22000000,
        MAPB: 4,
      },
      {
        MANV: 7,
        HOTEN: 'Vũ Thị Hoa',
        GIOITINH: 'Nữ',
        NGAYSINH: '1997-03-25',
        CHUCVU: 'Chuyên viên Nhân Sự',
        LUONG: 14000000,
        MAPB: 3,
      },
      {
        MANV: 8,
        HOTEN: 'Bùi Đức Anh',
        GIOITINH: 'Nam',
        NGAYSINH: '2000-07-19',
        CHUCVU: 'Kiểm thử QA',
        LUONG: 12000000,
        MAPB: 1,
      },
    ],
  },

  // ------------------------------------------------------
  // 3. BẢNG DUAN: Quản lý các dự án triển khai trong công ty
  // ------------------------------------------------------
  {
    name: 'DUAN',
    columns: [
      { name: 'MADA', type: 'INTEGER', isPrimary: true, nullable: false },
      { name: 'TENDA', type: 'TEXT', nullable: false },
      { name: 'KINHPHI', type: 'INTEGER', nullable: false },
      {
        name: 'MAPB',
        type: 'INTEGER',
        isForeign: true,
        foreignKeyTarget: { table: 'PHONGBAN', column: 'MAPB' },
        nullable: false,
      },
      { name: 'TRANGTHAI', type: 'TEXT', nullable: false },
    ],
    rows: [
      {
        MADA: 1,
        TENDA: 'Xây dựng Website E-Commerce',
        KINHPHI: 120000000,
        MAPB: 1,
        TRANGTHAI: 'Đang thực hiện',
      },
      {
        MADA: 2,
        TENDA: 'Ứng dụng Di động SQLFlow Mobile',
        KINHPHI: 180000000,
        MAPB: 1,
        TRANGTHAI: 'Đang thực hiện',
      },
      {
        MADA: 3,
        TENDA: 'Chiến dịch Quảng bá Mùa Hè',
        KINHPHI: 80000000,
        MAPB: 2,
        TRANGTHAI: 'Hoàn thành',
      },
      {
        MADA: 4,
        TENDA: 'Triển khai Phần mềm Kế toán ERP',
        KINHPHI: 150000000,
        MAPB: 4,
        TRANGTHAI: 'Chuẩn bị triển khai',
      },
    ],
  },

  // ------------------------------------------------------
  // 4. BẢNG PHANCONG: Phân công nhân viên vào các dự án cụ thể
  // ------------------------------------------------------
  {
    name: 'PHANCONG',
    columns: [
      { name: 'MAPC', type: 'INTEGER', isPrimary: true, nullable: false },
      {
        name: 'MANV',
        type: 'INTEGER',
        isForeign: true,
        foreignKeyTarget: { table: 'NHANVIEN', column: 'MANV' },
        nullable: false,
      },
      {
        name: 'MADA',
        type: 'INTEGER',
        isForeign: true,
        foreignKeyTarget: { table: 'DUAN', column: 'MADA' },
        nullable: false,
      },
      { name: 'VAITRO', type: 'TEXT', nullable: false },
      { name: 'SOGIO', type: 'INTEGER', nullable: false },
    ],
    rows: [
      {
        MAPC: 1,
        MANV: 1,
        MADA: 1,
        VAITRO: 'Quản lý dự án',
        SOGIO: 120,
      },
      {
        MAPC: 2,
        MANV: 2,
        MADA: 1,
        VAITRO: 'Lập trình viên Backend',
        SOGIO: 160,
      },
      {
        MAPC: 3,
        MANV: 3,
        MADA: 1,
        VAITRO: 'Lập trình viên Frontend',
        SOGIO: 140,
      },
      {
        MAPC: 4,
        MANV: 8,
        MADA: 1,
        VAITRO: 'Kiểm thử QA',
        SOGIO: 80,
      },
      {
        MAPC: 5,
        MANV: 1,
        MADA: 2,
        VAITRO: 'Kiến trúc sư hệ thống',
        SOGIO: 100,
      },
      {
        MAPC: 6,
        MANV: 2,
        MADA: 2,
        VAITRO: 'Lập trình viên API',
        SOGIO: 150,
      },
      {
        MAPC: 7,
        MANV: 3,
        MADA: 2,
        VAITRO: 'Thiết kế Giao diện',
        SOGIO: 110,
      },
      {
        MAPC: 8,
        MANV: 4,
        MADA: 3,
        VAITRO: 'Trưởng ban Marketing',
        SOGIO: 90,
      },
    ],
  },
];

// Đồng bộ hóa: phần học và SQL playground đều sử dụng chung 4 bảng dữ liệu Tiếng Việt chuẩn
export const initialTables: TableSchema[] = companyDbTables;
