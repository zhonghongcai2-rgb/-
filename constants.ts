

// ==========================================
// 常量与Mock数据文件 (Constants & Mock Data)
// 包含菜单配置、权限树定义、下拉选项以及模拟业务数据
// ==========================================

import { Role, Partner, Station, AuditRecord, PartnerAuditRecord, Parcel, FinanceRecord, Ticket, Monitor, RevenueBill, PaymentRecord, SystemRole, SystemUser, ReportData, Notification, PropertyCompany, StationStaff, BillDetail, HelpDocument, ServiceProvider, PropertyAuditRecord, SplitConfig } from './types';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Store, 
  ClipboardList, 
  Video, 
  Truck, 
  Wallet, 
  CreditCard, 
  Settings, 
  Database,
  Building,
  BookOpen,
  Briefcase,
  Percent
} from 'lucide-react';

// 模拟当前登录用户 (演示用，可通过修改此处 Role 切换角色视角)
export const MOCK_USER = {
  id: 'u001',
  name: '快金管理员',
  role: Role.KUAIJIN, // 默认为快金平台权限
  avatar: 'https://picsum.photos/100/100'
};

// 侧边栏菜单配置
export const MENU_ITEMS = [
  { id: 'dashboard', label: '首页', icon: LayoutDashboard, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.PROPERTY, Role.STATION] },
  { id: 'data', label: '数据报表', icon: Database, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.PROPERTY], children: [
    { id: 'data-reports', label: '报表', icon: null, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.PROPERTY] }
  ]},
  // 新增：服务商管理 (仅快金可见)
  { id: 'provider', label: '服务商管理', icon: Briefcase, roles: [Role.KUAIJIN], children: [
    { id: 'provider-list', label: '服务商列表', icon: null, roles: [Role.KUAIJIN] }
  ]},
  { id: 'partner', label: '合伙人管理', icon: Users, roles: [Role.KUAIJIN, Role.PROVIDER], children: [
    { id: 'partner-list', label: '合伙人列表', icon: null, roles: [Role.KUAIJIN, Role.PROVIDER] } 
  ]},
  { id: 'property', label: '物业公司管理', icon: Building, roles: [Role.KUAIJIN, Role.PROVIDER] }, 
  { id: 'station', label: '服务站管理', icon: Store, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.PROPERTY] },
  // 审核管理
  { id: 'audit', label: '审核管理', icon: FileCheck, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.STATION], children: [
      // Station Audit
      { id: 'audit-station-action', label: '服务站审核', icon: null, roles: [Role.KUAIJIN, Role.PROVIDER] },
      { id: 'audit-station-query', label: '服务站审核进度查询', icon: null, roles: [Role.PARTNER] },

      // Partner Audit
      { id: 'audit-partner-action', label: '合伙人审核', icon: null, roles: [Role.KUAIJIN] },
      { id: 'audit-partner-query', label: '合伙人审核进度查询', icon: null, roles: [Role.PROVIDER] }, 

      // Property Audit
      { id: 'audit-property-action', label: '物业公司审核', icon: null, roles: [Role.KUAIJIN] }, 
      { id: 'audit-property-query', label: '物业公司审核进度查询', icon: null, roles: [Role.PROVIDER] },
  ]}, 
  { id: 'ticket', label: '工单管理', icon: ClipboardList, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER] },
  // 快递管理
  { id: 'express', label: '快递管理', icon: Truck, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.PROPERTY], children: [
    { id: 'express-package', label: '包裹管理', icon: null, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.PROPERTY] },
    { id: 'express-archive', label: '归档管理', icon: null, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.PROPERTY] }
  ]},
  { id: 'finance', label: '财务管理', icon: Wallet, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.PROPERTY], children: [
    { id: 'finance-trans', label: '交易明细', icon: null, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER] }, 
    { id: 'finance-bill', label: '收益账单', icon: null, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.PROPERTY] },
    { id: 'split-settings', label: '分账设置', icon: Percent, roles: [Role.KUAIJIN] } // New Module
  ]},
  { id: 'payment', label: '支付管理', icon: CreditCard, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER] },
  { id: 'help', label: '帮助中心', icon: BookOpen, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.STATION, Role.PROPERTY], children: [
      { id: 'help-docs', label: '帮助文档', icon: null, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.STATION, Role.PROPERTY] }
  ]},
  { id: 'system', label: '系统管理', icon: Settings, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER], children: [
    { id: 'system-role', label: '角色管理', icon: null, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER] },
    { id: 'system-user', label: '用户管理', icon: null, roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER] }
  ]}
];

// --- 模拟数据 (Mock Data) ---

export const CASCADER_REGIONS: any = {
    '浙江省': {
        '杭州市': ['西湖区', '上城区', '滨江区', '余杭区'],
        '宁波市': ['海曙区', '江北区', '镇海区']
    },
    '江苏省': {
        '南京市': ['玄武区', '秦淮区'],
        '苏州市': ['姑苏区', '虎丘区']
    }
};

// 新增：服务商数据
export const MOCK_PROVIDERS: ServiceProvider[] = [
    { 
        id: 'sp001', 
        name: '深圳市快金数据', 
        address: '华强科技广场',
        contact: '寇鑫', 
        phone: '18618162830', 
        partnerCount: 1,
        accountName: '寇鑫',
        accountId: '18618162830',
        creditCode: '',
        margin: '-', 
        region: '广东省深圳市', 
        businessLicense: '-',
        createTime: '2025-11-10 09:58:34', 
        status: 'active'
    },
    { 
        id: 'sp002', 
        name: '翟总', 
        address: '深圳南山区',
        contact: '翟总', 
        phone: '13428796300', 
        partnerCount: 1,
        accountName: '翟总',
        accountId: '13428796300',
        creditCode: '',
        margin: '-', 
        region: '广东省深圳市南山区', 
        businessLicense: '-',
        createTime: '2025-11-02 12:47:27', 
        status: 'active' 
    },
    {
        id: 'sp003',
        name: 'KDN服务商',
        address: '广东省深圳市福田区梅林街道华强科创广场1F',
        contact: '研发测试',
        phone: '15010102301',
        partnerCount: 1,
        accountName: 'KDN测试服务商钱包',
        accountId: '99067386025',
        creditCode: '',
        margin: 10000,
        region: '广东省深圳市福田区',
        businessLicense: 'https://via.placeholder.com/50x50', // Mock Image
        createTime: '2025-10-31 16:49:15',
        status: 'active'
    },
    {
        id: 'sp004',
        name: '快递鸟',
        address: '广东省深圳市福田区梅丰社区北环大道6018号华强科创广场1栋',
        contact: '',
        phone: '',
        partnerCount: 0,
        accountName: '',
        accountId: '',
        creditCode: '',
        margin: '-',
        region: '-',
        businessLicense: '-',
        createTime: '2025-07-25 18:46:44',
        status: 'disabled'
    },
    {
        id: 'sp005',
        name: '快递鸟服务商',
        address: '深圳福田区华强科创广场1栋17F',
        contact: '',
        phone: '',
        partnerCount: 0,
        accountName: '',
        accountId: '',
        creditCode: '',
        margin: '-',
        region: '-',
        businessLicense: '-',
        createTime: '2025-07-25 16:46:53',
        status: 'disabled'
    }
];

export const MOCK_PARTNERS: Partner[] = [
  { 
    id: 'p001', 
    name: '快递鸟', 
    providerName: '深圳市快金数据', 
    providerId: 'sp001', 
    contactPerson: '寇鑫', 
    phone: '18618162830', 
    staffCount: 10, 
    stationCount: 1, 
    margin: 0, 
    accountName: '寇鑫', 
    accountId: '18618162830', 
    creditCode: '',
    status: 'active', 
    createTime: '2025-11-10 09:59:52', 
    address: '华强科创大厦', 
    serviceScope: '九堡街道', 
    addressDetail: '科技园1号楼101' 
  },
  { 
    id: 'p002', 
    name: '翟总', 
    providerName: '翟总', 
    providerId: 'sp002', 
    contactPerson: '翟总', 
    phone: '13428796300', 
    staffCount: 6, 
    stationCount: 4, 
    margin: 0, 
    accountName: '翟总', 
    accountId: '13428796300', 
    creditCode: '',
    status: 'active', 
    createTime: '2025-11-02 12:48:45', 
    address: '广东深圳南山', 
    serviceScope: '长河街道', 
    addressDetail: '创智中心202室' 
  },
  { 
    id: 'p003', 
    name: 'KDN合伙人', 
    providerName: 'KDN测试服务商', 
    providerId: 'sp003', 
    contactPerson: 'KDN测试001', 
    phone: '15014042029', 
    staffCount: 16, 
    stationCount: 7, 
    margin: 0, 
    accountName: 'KDN测试合伙人钱包', 
    accountId: '11067386025', 
    creditCode: '',
    status: 'active', 
    createTime: '2025-10-31 16:51:11', 
    address: '广东省深圳市福田区梅林街道梅林一村', 
    serviceScope: '全区', 
    addressDetail: '物流园区A座' 
  },
];

export const MOCK_PROPERTIES: PropertyCompany[] = [
  { id: 'prop001', name: '深圳市澎柏物业管理有限公司‌', address: '深圳市南山区粤海街道滨海社区书山路23号创世纪滨海花园二期裙楼会所三层', stationCount: 4, contact: '翟总', account: '19007560872', phone: '19007560872', createTime: '2025-11-02 12:21:19', status: 'active', providerName: '翟总' },
  { id: 'prop002', name: '碧桂园物业公司', address: '北京海淀区', stationCount: 4, contact: '王鑫', account: '18104445320', phone: '18104445320', createTime: '2025-09-03 10:42:48', status: 'active', providerName: '深圳市快金数据' },
  { id: 'prop003', name: '快递鸟公司', address: '深圳市福田区华强科创广场17楼', stationCount: 5, contact: '李总', account: '15815746335', phone: '15815746335', createTime: '2025-08-28 11:23:15', status: 'active', providerName: 'KDN服务商' },
  { id: 'prop004', name: '【碧喜公司-测试】', address: '北京市朝阳区', stationCount: 1, contact: '陈经理', account: '15915915915', phone: '15915915915', createTime: '2025-08-28 11:16:39', status: 'active', providerName: '深圳市快金数据' },
  { id: 'prop005', name: '京基物业公司', address: '深圳市福田区沙头街道下沙社区滨河路9289号', stationCount: 2, contact: '刘杰', account: 'liujie', phone: '13673678037', createTime: '2025-07-25 18:45:41', status: 'active', providerName: '翟总' },
  { id: 'prop006', name: '都之都物业公司', address: '深圳市宝安区新安街道罗田路 68', stationCount: 2, contact: '研发测试', account: '15014043685', phone: '15014043685', createTime: '2025-07-25 16:46:37', status: 'active', providerName: 'KDN服务商' },
];

export const MOCK_STATIONS: Station[] = [
  { id: 's001', name: '厚德品园上门服务', partnerName: '翟总', account: '18618162830', contact: '18618162830', status: 'normal', accountStatus: 'active', inbound: 133, outbound: 133, stock: 0, balance: 3000.00, region: '广东省深圳市', margin: 0, courierCount: 1, staffCount: 1, isDispatching: true, isReceiving: false, createTime: '2025-11-20 13:16:19', propertyName: '深圳市澎柏物业管理有限公司‌' },
  { id: 's002', name: '锦隆花园上门服务', partnerName: '翟总', account: '13510221470', contact: '13510221470', status: 'normal', accountStatus: 'active', inbound: 0, outbound: 0, stock: 0, balance: 1000.00, region: '广东省深圳市', margin: 0, courierCount: 6, staffCount: 1, isDispatching: true, isReceiving: false, createTime: '2025-11-14 17:05:27', propertyName: '深圳市澎柏物业管理有限公司‌' },
  { id: 's003', name: '嘉铭D区上门（未收联系15369803719）', partnerName: 'KDN合伙人', account: '15369803719', contact: '15369803719', status: 'normal', accountStatus: 'active', inbound: 299, outbound: 188, stock: 112, balance: 20000.00, region: '广东省深圳市', margin: 0, courierCount: 4, staffCount: 1, isDispatching: true, isReceiving: false, createTime: '2025-11-06 10:10:13', propertyName: '快递鸟公司' },
  { id: 's004', name: '宏观苑上门服务（找件专线：17620366468）', partnerName: '翟总', account: '18588462126', contact: '18588462126', status: 'normal', accountStatus: 'active', inbound: 45, outbound: 45, stock: 0, balance: 2000.00, region: '广东省深圳市', margin: 0, courierCount: 1, staffCount: 1, isDispatching: true, isReceiving: false, createTime: '2025-11-05 16:37:17', propertyName: '深圳市澎柏物业管理有限公司‌' },
  { id: 's005', name: '创世纪滨海花园上门服务', partnerName: '翟总', account: '19007560871', contact: '19007560871', status: 'normal', accountStatus: 'active', inbound: 311, outbound: 312, stock: 1, balance: 5000.00, region: '广东省深圳市', margin: 0, courierCount: 6, staffCount: 3, isDispatching: true, isReceiving: false, createTime: '2025-11-02 19:21:00', propertyName: '深圳市澎柏物业管理有限公司‌' },
  { id: 's006', name: '嘉铭E区上门服务（未收请联系13253156983）', partnerName: 'KDN合伙人', account: '13253156983', contact: '13253156983', status: 'normal', accountStatus: 'active', inbound: 245, outbound: 146, stock: 99, balance: 20000.00, region: '广东省深圳市', margin: 0, courierCount: 5, staffCount: 2, isDispatching: true, isReceiving: false, createTime: '2025-10-31 17:36:08', propertyName: '快递鸟公司' },
];

export const MOCK_STATION_STAFF: StationStaff[] = [
    { id: 'st_01', name: '操作员小王', phone: '13988887777', role: 'operator', createTime: '2023-09-01' },
    { id: 'st_02', name: '派送员小李', phone: '15066665555', role: 'courier', createTime: '2023-09-15' },
];

export const MOCK_AUDITS: AuditRecord[] = [
  { 
    id: 'a001', 
    stationName: '未来科技城服务站', 
    account: 'YZ_APPLY_001', 
    password: 'password123',
    phone: '15011112222', 
    businessHours: '09:00-21:00',
    region: '杭州市余杭区', 
    community: '未来科技城小区',
    address: '仓前街道xxx路', 
    partnerName: '城东区域合伙人', 
    providerName: '杭州顺达服务商',
    propertyName: '绿城物业公司',
    deliveryPayer: '服务站',
    smsPayer: '服务站',
    status: 'pending', 
    applyTime: '2023-10-25 10:00' 
  },
  { 
    id: 'a002', 
    stationName: '西溪湿地服务站', 
    account: 'YZ_APPLY_002', 
    password: 'password456',
    phone: '15033334444', 
    businessHours: '08:30-20:30',
    region: '杭州市西湖区', 
    community: '西溪花园',
    address: '文二西路xxx号', 
    partnerName: '滨江联合合伙人', 
    providerName: '上海快运通服务商',
    propertyName: '万科物业公司',
    deliveryPayer: '快递员',
    smsPayer: '服务站',
    status: 'approved', 
    applyTime: '2023-10-24 14:30' 
  },
];

export const MOCK_PARTNER_AUDITS: PartnerAuditRecord[] = [
  { id: 'pa001', partnerName: '城西物流合伙人', contactPerson: '周八', phone: '13700001111', status: 'pending', applyTime: '2023-10-26 09:00' },
  { id: 'pa002', partnerName: '萧山南部合伙人', contactPerson: '吴九', phone: '13566667777', status: 'approved', applyTime: '2023-10-20 14:00' }
];

// Mock Property Audits (New)
export const MOCK_PROPERTY_AUDITS: PropertyAuditRecord[] = [
    { id: 'pra001', name: '保利物业公司', contact: '张经理', phone: '0571-77777777', region: '浙江省-杭州市', providerName: '杭州顺达服务商', status: 'pending', applyTime: '2023-10-27 10:00' },
    { id: 'pra002', name: '龙湖物业公司', contact: '刘经理', phone: '0571-66666666', region: '浙江省-杭州市', providerName: '杭州顺达服务商', status: 'approved', applyTime: '2023-10-25 09:00' }
];

// Mock Split Configs (New)
export const MOCK_SPLIT_CONFIGS: SplitConfig[] = [
    // Kuaijin (Platform)
    { id: 'sc000', entityId: 'kj001', entityName: '快金数据有限公司', entityType: 'kuaijin', walletAccount: 'PLATFORM_WALLET_001', ratio: 5.0, status: 'active', updateTime: '2023-01-01' },
    
    // Service Providers
    { id: 'sc001', entityId: 'sp001', entityName: '杭州顺达服务商', entityType: 'provider', walletAccount: 'SP_WALLET_001', ratio: 5.0, status: 'active', updateTime: '2023-10-01' },
    { id: 'sc002', entityId: 'sp002', entityName: '上海快运通服务商', entityType: 'provider', walletAccount: 'SP_WALLET_002', ratio: 5.0, status: 'active', updateTime: '2023-10-02' },
    
    // Partners
    { id: 'sc003', entityId: 'p001', entityName: '城东区域合伙人', entityType: 'partner', walletAccount: 'PT_WALLET_001', ratio: 3.5, status: 'active', updateTime: '2023-10-03' },
    { id: 'sc004', entityId: 'p002', entityName: '滨江联合合伙人', entityType: 'partner', walletAccount: 'PT_WALLET_002', ratio: 3.5, status: 'active', updateTime: '2023-10-04' },
    
    // Properties (Updated with providerRatio)
    { id: 'sc005', entityId: 'prop001', entityName: '绿城物业公司', entityType: 'property', walletAccount: 'PROP_WALLET_001', ratio: 10.0, providerRatio: 15.0, status: 'active', updateTime: '2023-10-05' },
    { id: 'sc006', entityId: 'prop002', entityName: '万科物业公司', entityType: 'property', walletAccount: 'PROP_WALLET_002', ratio: 15.0, providerRatio: 5.0, status: 'active', updateTime: '2023-10-06' },

    // Staff (New)
    { 
        id: 'sc007', 
        entityId: 'st_01', 
        entityName: '操作员小王', 
        entityType: 'staff', 
        walletAccount: '13988887777', 
        ratio: 0.5, 
        status: 'active', 
        updateTime: '2023-11-20',
        stationName: '幸福小区服务站',
        partnerName: '城东区域合伙人',
        providerName: '杭州顺达服务商',
        propertyName: '绿城物业公司'
    },
     { 
        id: 'sc008', 
        entityId: 'st_02', 
        entityName: '派送员小李', 
        entityType: 'staff', 
        walletAccount: '15066665555', 
        ratio: 0.8, 
        status: 'active', 
        updateTime: '2023-11-21',
        stationName: '幸福小区服务站',
        partnerName: '城东区域合伙人',
        providerName: '杭州顺达服务商',
        propertyName: '绿城物业公司'
    }
];

export const MOCK_PARCELS: Parcel[] = [
  { id: 'SF1234567890', pickupCode: 'A-1-1024', brand: '顺丰速运', inboundTime: '2023-10-26 09:30', receiverPhone: '13900000001', stationName: '幸福小区服务站', stationAccount: 'YZ001', status: 'pending', notifyStatus: 'sent', partnerName: '城东区域合伙人', propertyName: '绿城物业公司' },
  { id: 'YT9876543210', pickupCode: 'B-2-0512', brand: '圆通速递', inboundTime: '2023-10-26 10:15', outboundTime: '2023-10-26 18:00', receiverPhone: '13900000002', stationName: '幸福小区服务站', stationAccount: 'YZ001', status: 'signed', notifyStatus: 'sent', partnerName: '城东区域合伙人', propertyName: '绿城物业公司' },
  { id: 'YD1122334455', pickupCode: 'C-3-2048', brand: '韵达快递', inboundTime: '2023-10-25 16:20', outboundTime: '2023-10-26 09:10', receiverPhone: '13900000003', stationName: '阳光花园服务站', stationAccount: 'YZ002', status: 'outbound', notifyStatus: 'failed', partnerName: '城东区域合伙人', propertyName: '万科物业公司' },
];

export const MOCK_ARCHIVED_PARCELS: Parcel[] = [
    { id: 'SF0000000001', pickupCode: 'H-1-0001', brand: '顺丰速运', inboundTime: '2023-01-01 09:00', outboundTime: '2023-01-01 18:30', receiverPhone: '13911111111', stationName: '幸福小区服务站', stationAccount: 'YZ001', status: 'signed', notifyStatus: 'sent', partnerName: '城东区域合伙人', propertyName: '绿城物业公司' }
];

export const MOCK_TRACES = [
    { time: '2023-10-26 09:30', status: '已入库', description: '包裹已到达幸福小区服务站，入库成功' },
    { time: '2023-10-26 09:31', status: '发送通知', description: '取件码短信已发送给收件人' },
    { time: '2023-10-26 18:00', status: '已出库', description: '客户凭取件码取走包裹' },
];

export const MOCK_FINANCE: FinanceRecord[] = [
  { id: 'TRX001', date: '2023-10-26', type: '派费收入', amount: 0.80, subject: '幸福小区服务站', status: 'success' },
  { id: 'TRX002', date: '2023-10-26', type: '短信费', amount: -0.05, subject: '幸福小区服务站', status: 'success' },
  { id: 'TRX003', date: '2023-10-25', type: '人工充值', amount: 100.00, subject: '阳光花园服务站', status: 'success' },
];

export const MOCK_TICKETS: Ticket[] = [
    { id: 'GD20231026001', type: 'complaint', initiator: '幸福小区服务站', stationName: '幸福小区服务站', description: '客户投诉包裹破损，要求赔偿', createTime: '2023-10-26 11:00', status: 'pending', handler: '运营专员A' },
    { id: 'GD20231025002', type: 'business', initiator: '城东区域合伙人', stationName: '-', description: '咨询下个月的活动政策', createTime: '2023-10-25 14:00', status: 'resolved', handler: '运营主管' },
];

export const MOCK_MONITORS: Monitor[] = [
    { id: 'CAM001', stationName: '幸福小区服务站', account: 'YZ001', status: 'online', createTime: '2023-01-01', previewUrl: '' },
    { id: 'CAM002', stationName: '阳光花园服务站', account: 'YZ002', status: 'offline', createTime: '2023-02-01', previewUrl: '' },
];

export const MOCK_BILLS: RevenueBill[] = [
    { id: 'BILL202309001', month: '2023-09', accountType: 'station', name: '幸福小区服务站', userId: 'u_s001', userPhone: '138****1111', stationName: '幸福小区服务站', amount: 3450.00, status: 'confirmed' },
    { id: 'BILL202309002', month: '2023-09', accountType: 'courier', name: '李四', userId: 'u_c002', userPhone: '139****2222', stationName: '创智中心服务站', amount: 1200.50, status: 'paid' },
];

export const MOCK_BILL_DETAILS: BillDetail[] = [
    { id: 'BD001', orderNo: 'SF123123', time: '2023-09-01 10:00', amount: 0.8, type: '派费' },
    { id: 'BD002', orderNo: 'YT456456', time: '2023-09-01 11:00', amount: 0.8, type: '派费' },
    { id: 'BD003', orderNo: 'SMS001', time: '2023-09-01 10:01', amount: -0.05, type: '短信费' },
];

export const MOCK_PAYMENTS: PaymentRecord[] = [
    { id: 'PAY001', courierName: '张三', phone: '138****0000', amount: 500, method: 'wechat', time: '2023-10-26 10:00', balance: 520.5, status: 'success' }
];

// 系统默认角色：确保包含 服务商, 合伙人, 派送员
export const MOCK_ROLES: SystemRole[] = [
    { id: 'r001', name: '超级管理员', description: '系统最高权限', permissions: ['all'], createTime: '2023-01-01' },
    { id: 'r002', name: '服务商', description: '服务商企业账号，拥有下属合伙人、服务站管理权限', permissions: ['partner', 'station', 'express', 'finance', 'system'], createTime: '2023-01-02' },
    { id: 'r003', name: '合伙人', description: '区域合伙人账号，拥有辖区内服务站管理权限', permissions: ['station', 'express', 'finance'], createTime: '2023-01-03' },
    { id: 'r004', name: '派送员', description: '一线派送人员，仅操作包裹业务', permissions: ['express-package'], createTime: '2023-01-04' },
    { id: 'r005', name: '财务专员', description: '负责财务审核与查看', permissions: ['finance-view', 'finance-export'], createTime: '2023-02-01' },
];

export const MOCK_SYSTEM_USERS: (SystemUser & { password?: string })[] = [
    { id: 'u001', username: 'admin', phone: '13800000000', roleName: '超级管理员', status: 'active', createTime: '2023-01-01', organization: '平台总部', walletId: '13800000000', walletName: 'admin的钱包', walletType: 'company', walletBalance: 10000.00, password: '123456a' },
    { id: 'u002', username: 'provider_01', phone: '13900000001', roleName: '服务商', status: 'active', createTime: '2023-02-01', organization: '杭州顺达服务商', walletId: '13900000001', walletName: '顺达钱包', walletType: 'company', walletBalance: 500000.00, password: '123456a' },
];

export const MOCK_REPORTS: ReportData[] = [
    { 
        id: 'rep001', 
        name: '幸福小区服务站', 
        type: 'station', 
        province: '浙江省', 
        city: '杭州市', 
        district: '西湖区', 
        community: '幸福家园', 
        contact: '张三', 
        totalInbound: 120, 
        totalOutbound: 80, 
        issueCount: 2, 
        income: 96.00, 
        date: '2023-10-26' 
    },
    { 
        id: 'rep002', 
        name: '阳光花园服务站', 
        type: 'station', 
        province: '广东省', 
        city: '深圳市', 
        district: '福田区', 
        community: '阳光花园', 
        contact: '李四', 
        totalInbound: 0, 
        totalOutbound: 0, 
        issueCount: 0, 
        income: 0.00, 
        date: '2023-10-26' 
    },
    { 
        id: 'rep003', 
        name: '杭州顺达服务商', 
        type: 'provider', 
        province: '浙江省', 
        city: '杭州市', 
        district: '-', 
        community: '-', 
        contact: '王五', 
        totalInbound: 1520, 
        totalOutbound: 1400, 
        issueCount: 15, 
        income: 1216.00, 
        date: '2023-10-26' 
    },
    { 
        id: 'rep004', 
        name: '城东区域合伙人', 
        type: 'partner', 
        province: '浙江省', 
        city: '杭州市', 
        district: '上城区', 
        community: '-', 
        contact: '赵六', 
        totalInbound: 620, 
        totalOutbound: 580, 
        issueCount: 5, 
        income: 496.00, 
        date: '2023-10-26' 
    },
    { 
        id: 'rep005', 
        name: '绿城物业公司', 
        type: 'property', 
        province: '浙江省', 
        city: '杭州市', 
        district: '西湖区', 
        community: '-', 
        contact: '钱七', 
        totalInbound: 420, 
        totalOutbound: 360, 
        issueCount: 1, 
        income: 0.00, 
        date: '2023-10-26' 
    }, 
    { 
        id: 'rep006', 
        name: '顺丰速运', 
        type: 'brand', 
        province: '-', 
        city: '-', 
        district: '-', 
        community: '-', 
        contact: '-', 
        totalInbound: 500, 
        totalOutbound: 480, 
        issueCount: 10, 
        income: 500.00, 
        date: '2023-10-26' 
    },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', title: '新的服务站入驻申请', message: '未来科技城服务站提交了入驻申请，请及时审核。', type: 'info', isRead: false, createTime: '10分钟前' },
    { id: 'n2', title: '系统维护通知', message: '系统将于今晚 00:00 进行例行维护，预计耗时 2 小时。', type: 'warning', isRead: true, createTime: '2小时前' },
];

// 帮助文档 Mock 数据
export const MOCK_DOCUMENTS: HelpDocument[] = [
    {
        id: 'doc_001',
        title: '服务站出入库操作手册',
        category: '操作指南',
        updateTime: '2023-10-15',
        roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER, Role.STATION, Role.PROPERTY],
        content: `
# 服务站出入库操作手册

## 一、 系统登录
使用分配的服务站账号（YZ开头）和密码登录系统。建议使用最新版 Chrome 浏览器。

## 二、 包裹入库
1. 进入【快递管理】 > 【包裹管理】。
2. 点击“入库”按钮或使用扫码枪扫描快递单号。
3. 系统自动识别快递品牌，如未识别请手动选择。
4. 输入收件人手机号（后四位或全号）。
5. 打印并粘贴取件码标签，将包裹放置在对应货架。
6. 系统将自动发送取件短信给用户。

## 三、 包裹出库
1. 用户凭取件码或手机号后四位取件。
2. 在【包裹管理】搜索框输入取件码。
3. 确认包裹信息无误后，点击“出库”或“一键签收”。
4. 若开启了高拍仪，出库时会自动抓拍底图。

## 四、 异常处理
- **拒收/退回**: 在包裹列表找到对应运单，点击“退回”并输入原因。
- **滞留件**: 超过 3 天未取件的包裹会标记为滞留，建议二次通知用户。
        `
    },
    {
        id: 'doc_002',
        title: '服务商合伙人准入手册',
        category: '准入规则',
        updateTime: '2023-09-01',
        roles: [Role.KUAIJIN, Role.PROVIDER, Role.PARTNER],
        content: `
# 服务商合伙人准入手册

## 一、 合伙人定义
区域合伙人是指在指定区域内，负责拓展、管理服务站，并承担相应经营风险与收益的商业合作伙伴。

## 二、 准入条件
1. **企业资质**: 必须为合法注册的企业法人，注册资金不低于 50 万元。
2. **行业经验**: 具备 2 年以上物流、快递或相关行业管理经验。
3. **资金实力**: 需缴纳 5 万元平台保证金（可退），并具备不少于 20 万元的流动资金。
4. **团队配置**: 至少配备 3 人以上的专职运营团队（含客服、市场拓展）。

## 三、 申请流程
1. 联系平台商务经理，提交《合伙人申请表》。
2. 平台进行资质初审与背景调查（3个工作日）。
3. 初审通过后，进行线下面谈与区域考察。
4. 签订《区域合作协议》，缴纳保证金。
5. 开通合伙人后台账号，参加系统培训。

## 四、 考核与退出
- **月度考核**: 新增服务站数量、服务站活跃度、投诉率。
- **退出机制**: 连续 3 个月未达标，平台有权解除合约并清退。
        `
    }
];

// --- 选项配置 (Options) ---

export const PARTNER_STATUS_OPTS = ['启用', '禁用'];
export const STATION_STATUS_OPTS = ['正常', '异常', '注销'];
export const AUDIT_STATUS_PENDING_OPTS = ['待审核', '审核中']; 
export const AUDIT_STATUS_APPROVED_OPTS = ['通过', '驳回'];
export const TICKET_TYPES = ['系统问题', '业务咨询', '投诉建议'];
export const TICKET_STATUS_OPTS = ['待处理', '处理中', '已解决', '已关闭'];
export const MONITOR_STATUS_OPTS = ['在线', '离线'];
export const PARCEL_STATUS_OPTS = ['待出库', '已出库', '已签收', '退回'];
export const NOTIFY_STATUS_OPTS = ['已发送', '发送失败', '未发送'];
export const EXPRESS_BRANDS = ['顺丰速运', '圆通速递', '中通快递', '申通快递', '韵达快递', '极兔速递', '邮政EMS', '京东物流'];
export const FINANCE_TYPES = ['派费收入', '短信费', '揽件提成', '奖励补贴', '人工充值', '人工扣款', '赔偿扣款'];
export const FINANCE_SUBJECTS = ['服务站', '快递员'];
export const PAYER_TYPES = ['快递员', '服务站', '合作公司', '快递网点', '寄件人', '商写公司'];
// 更新：系统角色选项
export const ROLES_OPTIONS = ['超级管理员', '服务商', '合伙人', '派送员', '财务专员', '客服专员'];
export const BILLING_TYPES = ['入库', '出库'];

// 带有钱包余额模拟的快递品牌配置
export const MOCK_EXPRESS_CONFIGS = EXPRESS_BRANDS.map(brand => ({
    name: brand,
    balance: Math.floor(Math.random() * 5000), // 模拟余额
    active: true
}));

// 权限树结构定义 (仅用于展示)
export interface PermissionNode {
    key: string;
    label: string;
    children?: PermissionNode[];
    type: 'menu' | 'button'; // 权限类型：菜单 or 按钮
}

export const PERMISSION_TREE: PermissionNode[] = [
    {
        key: 'dashboard', label: '首页看板', type: 'menu', children: [
            { key: 'dashboard-export', label: '导出报表', type: 'button' }
        ]
    },
    {
        key: 'provider', label: '服务商管理', type: 'menu', children: [
             { key: 'provider-add', label: '新增服务商', type: 'button' },
             { key: 'provider-edit', label: '编辑服务商', type: 'button' },
             { key: 'provider-delete', label: '删除服务商', type: 'button' }
        ]
    },
    {
        key: 'partner', label: '合伙人管理', type: 'menu', children: [
             { key: 'partner-add', label: '新增合伙人', type: 'button' },
             { key: 'partner-edit', label: '编辑合伙人', type: 'button' },
             { key: 'partner-delete', label: '删除合伙人', type: 'button' }
        ]
    },
    {
        key: 'property', label: '物业公司管理', type: 'menu', children: [
            { key: 'property-add', label: '新增物业', type: 'button' },
            { key: 'property-edit', label: '编辑物业', type: 'button' },
            { key: 'property-delete', label: '删除物业', type: 'button' }
       ]
    },
    {
        key: 'station', label: '服务站管理', type: 'menu', children: [
             { key: 'station-add', label: '新增服务站', type: 'button' },
             { key: 'station-edit', label: '编辑服务站', type: 'button' },
             { key: 'station-audit', label: '审核入驻申请', type: 'button' },
             { key: 'station-config', label: '管理员工/快递', type: 'button' }
        ]
    },
    {
        key: 'express', label: '快递管理', type: 'menu', children: [
             { key: 'express-package', label: '包裹管理', type: 'menu', children: [
                 { key: 'parcel-sign', label: '一键签收', type: 'button' },
                 { key: 'parcel-force-out', label: '强制出库', type: 'button' }
             ]},
             { key: 'express-archive', label: '归档管理', type: 'menu' }
        ]
    },
    {
        key: 'finance', label: '财务管理', type: 'menu', children: [
             { key: 'finance-trans', label: '交易明细', type: 'menu', children: [
                 { key: 'trans-manual', label: '人工资金调节', type: 'button' }
             ]},
             { key: 'finance-bill', label: '收益账单', type: 'menu' }
        ]
    },
    {
        key: 'system', label: '系统管理', type: 'menu', children: [
             { key: 'role-manage', label: '角色管理', type: 'menu' },
             { key: 'user-manage', label: '用户管理', type: 'menu' }
        ]
    }
];