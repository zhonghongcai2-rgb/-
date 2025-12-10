// ==========================================
// 类型定义文件 (Type Definitions)
// 用于定义系统中的枚举、接口和数据模型
// ==========================================

// 系统角色枚举
export enum Role {
  KUAIJIN = 'KUAIJIN',           // 快金平台 (超级管理员，统筹服务商)
  PROVIDER = 'SERVICE_PROVIDER', // 服务商 (管理合伙人)
  PARTNER = 'PARTNER',           // 合伙人 (管理区域内的服务站)
  PROPERTY = 'PROPERTY',         // 物业公司 (仅拥有查看数据的权限)
  STATION = 'STATION',           // 驿站 (具体业务操作端)
  COURIER = 'COURIER',           // 派送员
}

// 登录用户信息接口
export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  organization?: string; // 用户归属组织
}

// 侧边栏菜单结构接口
export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  roles: Role[]; // 允许访问该菜单的角色列表
  children?: MenuItem[]; // 子菜单
}

// --- 业务实体类型定义 ---

// 服务商实体 (新 - 快金管理的对象)
export interface ServiceProvider {
    id: string;
    name: string; // 服务商名称
    address: string; // 服务商地址
    contact: string; // 负责人
    phone: string; // 负责人联系方式
    partnerCount: number; // 下属合伙人数量
    accountName: string; // 账户名称
    accountId: string; // 账户ID
    creditCode: string; // 社会信用代码
    margin: number | string; // 保证金 (number or '-' string)
    region: string; // 管辖范围
    businessLicense?: string; // 营业执照图片
    createTime: string; // 创建时间
    status: 'active' | 'disabled'; // 状态 (启用/禁用)
    balance?: number; // 账户余额 (保留原有逻辑)
}

// 物业公司实体
export interface PropertyCompany {
    id: string;
    name: string;
    address: string; // 公司地址
    stationCount: number; // 服务站数量
    contact: string; // 用户名称
    account: string; // 登录账号
    phone: string;
    createTime: string;
    status: 'active' | 'disabled';
    region?: string; // 保留字段兼容旧逻辑
    providerName?: string; // 归属服务商
}

// 合伙人实体
export interface Partner {
  id: string;
  name: string;
  providerName?: string; // 归属服务商 - 新字段
  providerId?: string;   // 归属服务商ID - 新字段
  contactPerson: string;
  phone: string;
  staffCount: number;
  stationCount: number;
  margin: number | string; // 保证金
  accountName: string; // 关联账户名
  accountId: string;   // 关联账户ID
  creditCode?: string; // 社会信用代码
  status: 'active' | 'disabled'; // 状态：启用/禁用
  createTime: string;
  address: string; // 区域地址 (省市区)
  serviceScope?: string; // 服务范围 (街道)
  addressDetail?: string; // 详细地址
  attachments?: string[]; // 附件
}

// 分账配置接口
export interface BillingConfig {
    inboundWallet: string; // 入库分账钱包
    outboundWallet: string; // 出库分账钱包
    ratio: number; // 比例
}

// 快递品牌分账配置 (新)
export interface StationBrandConfig {
    brand: string; // 快递品牌
    isEnabled: boolean; // 是否启用
    inboundSplit: number; // 入库分账金额 (元/单)
    outboundSplit: number; // 出库分账金额 (元/单)
}

// 平台分账配置实体 (新)
export interface SplitConfig {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'provider' | 'partner' | 'property' | 'kuaijin' | 'staff'; // 增加 'staff'
  walletAccount: string; // 钱包账号
  ratio: number; // 分账比例 0-100 (自身比例)
  providerRatio?: number; // 新增：服务商在该物业上的分润比例
  status: 'active' | 'disabled';
  updateTime: string;
  // Optional fields for staff
  stationName?: string;
  partnerName?: string;
  providerName?: string;
  propertyName?: string;
}

// 服务站实体
export interface Station {
  id: string;
  name: string;
  partnerName: string;
  propertyName?: string;
  account: string;
  contact: string;
  status: string; // 'normal' | 'abnormal' etc.
  accountStatus: string;
  inbound: number;
  outbound: number;
  stock: number;
  balance: number;
  region: string;
  margin: number;
  courierCount: number;
  staffCount: number;
  isDispatching: boolean;
  isReceiving: boolean;
  createTime: string;
}

// 服务站员工
export interface StationStaff {
    id: string;
    name: string;
    phone: string;
    role: 'operator' | 'courier';
    createTime: string;
}

// 审核记录
export interface AuditRecord {
  id: string;
  stationName: string;
  account: string;
  password?: string;
  phone: string;
  businessHours?: string;
  region: string;
  community?: string;
  address: string;
  partnerName: string;
  providerName: string;
  propertyName?: string;
  deliveryPayer?: string;
  smsPayer?: string;
  status: 'pending' | 'approved' | 'rejected';
  applyTime: string;
}

export interface PartnerAuditRecord {
  id: string;
  partnerName: string;
  contactPerson: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  applyTime: string;
}

export interface PropertyAuditRecord {
    id: string;
    name: string;
    contact: string;
    phone: string;
    region: string;
    providerName: string;
    status: 'pending' | 'approved' | 'rejected';
    applyTime: string;
}

// 包裹
export interface Parcel {
  id: string;
  pickupCode: string;
  brand: string;
  inboundTime: string;
  outboundTime?: string;
  receiverPhone: string;
  stationName: string;
  stationAccount: string;
  status: string; // 'pending', 'signed', 'outbound', etc.
  notifyStatus: string;
  partnerName?: string;
  propertyName?: string;
}

// 财务记录
export interface FinanceRecord {
  id: string;
  date: string;
  type: string;
  amount: number;
  subject: string;
  status: string;
}

// 工单
export interface Ticket {
    id: string;
    type: string; // 'complaint' | 'business' | 'system'
    initiator: string;
    stationName: string;
    description: string;
    createTime: string;
    status: 'pending' | 'resolved' | 'closed';
    handler?: string;
}

// 监控
export interface Monitor {
    id: string;
    stationName: string;
    account: string;
    status: 'online' | 'offline';
    createTime: string;
    previewUrl: string;
}

// 账单
export interface RevenueBill {
    id: string;
    month: string;
    accountType: string;
    name: string;
    userId: string;
    userPhone: string;
    stationName: string;
    amount: number;
    status: 'confirmed' | 'paid' | 'pending';
}

export interface BillDetail {
    id: string;
    orderNo: string;
    time: string;
    amount: number;
    type: string;
}

// 支付记录
export interface PaymentRecord {
    id: string;
    courierName: string;
    phone: string;
    amount: number;
    method: string;
    time: string;
    balance: number;
    status: string;
}

// 系统角色
export interface SystemRole {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    createTime: string;
}

// 系统用户
export interface SystemUser {
    id: string;
    username: string;
    phone: string;
    roleName: string;
    status: string;
    createTime: string;
    organization?: string;
    walletId?: string;
    walletName?: string;
    walletType?: 'company' | 'personal';
    walletBalance?: number;
    password?: string;
}

// 报表数据
export interface ReportData {
    id: string;
    name: string;
    type: 'station' | 'provider' | 'partner' | 'property' | 'brand';
    province: string;
    city: string;
    district: string;
    community: string;
    contact: string;
    totalInbound: number;
    totalOutbound: number;
    issueCount: number;
    income: number;
    date: string;
}

export interface ReportDetailItem {
    id: string;
    name: string;
    province: string;
    city: string;
    district: string;
    community: string;
    contact: string;
    inbound: number;
    outbound: number;
    issueCount: number;
}

// 通知
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createTime: string;
}

// 帮助文档
export interface HelpDocument {
    id: string;
    title: string;
    category: string;
    updateTime: string;
    roles: Role[];
    content: string;
}