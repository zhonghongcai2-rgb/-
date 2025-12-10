

import React, { useState, useEffect } from 'react';
import { 
    Edit, Plus, Trash2, ChevronLeft, ChevronRight, Search, Eye, 
    FileText, CheckCircle, XCircle, AlertTriangle, Filter,
    Briefcase, Building, Users, Store, Settings, Download
} from 'lucide-react';
import { 
    Role, ServiceProvider, Partner, PropertyCompany, Station, 
    AuditRecord, PartnerAuditRecord, PropertyAuditRecord, 
    Ticket, Parcel, FinanceRecord, RevenueBill, SplitConfig, 
    PaymentRecord, HelpDocument, SystemRole, SystemUser, ReportData 
} from '../types';
import { 
    MOCK_PROVIDERS, MOCK_PARTNERS, MOCK_PROPERTIES, MOCK_STATIONS, 
    MOCK_AUDITS, MOCK_PARTNER_AUDITS, MOCK_PROPERTY_AUDITS, 
    MOCK_TICKETS, MOCK_PARCELS, MOCK_ARCHIVED_PARCELS, 
    MOCK_FINANCE, MOCK_BILLS, MOCK_SPLIT_CONFIGS, MOCK_PAYMENTS, 
    MOCK_DOCUMENTS, MOCK_ROLES, MOCK_SYSTEM_USERS, MOCK_REPORTS
} from '../constants';
import { 
    ServiceProviderModal, PartnerModal, PropertyModal, StationFormModal, 
    StationConfigModal, AuditModal, PartnerAuditModal, PropertyAuditModal, 
    TicketModal, BillDetailModal, SplitConfigModal, 
    DocumentViewerModal, RoleModal, UserModal, ReportDetailModal, 
    TraceModal, ConfirmationModal
} from './ActionModals';

export interface ManagerProps { 
    userRole: Role; 
    userName: string; 
    userOrg?: string;
    onNotify: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => void; 
}

// ---------------------------
// 服务商管理 (Service Provider Manager)
// ---------------------------
export const ServiceProviderManager = ({ onNotify, userRole, userOrg }: ManagerProps) => {
    // 权限过滤：快金看到所有，服务商只能看到自己
    const [providers, setProviders] = useState(() => {
        if (userRole === Role.KUAIJIN) return MOCK_PROVIDERS;
        if (userRole === Role.PROVIDER) return MOCK_PROVIDERS.filter(p => p.name === userOrg);
        return []; // 其他角色无权查看或为空
    });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentData, setCurrentData] = useState<ServiceProvider | undefined>(undefined);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const handleSave = (data: any) => {
        if (currentData) {
            setProviders(prev => prev.map(p => p.id === currentData.id ? { ...p, ...data } : p));
            onNotify('保存成功', '服务商信息已更新', 'success');
        } else {
            const newId = `sp_${Date.now()}`;
            setProviders([{ id: newId, ...data, createTime: new Date().toISOString(), status: 'active', partnerCount: 0 }, ...providers]);
            onNotify('添加成功', '新服务商已添加', 'success');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-3 border border-gray-200 p-4 rounded-lg bg-white flex justify-between items-center">
                 {userRole === Role.KUAIJIN ? (
                    <button onClick={() => { setCurrentData(undefined); setIsReadOnly(false); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> 新增服务商
                    </button>
                 ) : <div></div>}
                 
                 <div className="flex gap-2">
                     <input type="text" placeholder="服务商名称" className="border border-gray-300 rounded px-3 py-2 text-sm w-48" />
                     <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">查询</button>
                 </div>
             </div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">服务商名称</th>
                            <th className="p-4">负责人</th>
                            <th className="p-4">联系电话</th>
                            <th className="p-4">合伙人数</th>
                            <th className="p-4">账户余额</th>
                            <th className="p-4">状态</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {providers.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{p.name}</td>
                                <td className="p-4">{p.contact}</td>
                                <td className="p-4">{p.phone}</td>
                                <td className="p-4">{p.partnerCount}</td>
                                <td className="p-4">{p.balance ? `¥${p.balance}` : '-'}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${p.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{p.status === 'active' ? '正常' : '禁用'}</span></td>
                                <td className="p-4">
                                    <button onClick={() => { setCurrentData(p); setIsReadOnly(false); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 mr-2">编辑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ServiceProviderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={currentData} onSubmit={handleSave} isReadOnly={isReadOnly} />
        </div>
    );
};

// ---------------------------
// 合伙人管理 (Partner Manager)
// ---------------------------
export const PartnerManager = ({ onNotify, userRole, userOrg, userName }: ManagerProps) => {
    // 权限过滤：
    // Kuaijin -> 所有
    // Provider -> 归属自己的合伙人
    // Partner -> 只能看到自己
    const [partners, setPartners] = useState(() => {
        if (userRole === Role.KUAIJIN) return MOCK_PARTNERS;
        if (userRole === Role.PROVIDER) return MOCK_PARTNERS.filter(p => p.providerName === userOrg);
        if (userRole === Role.PARTNER) return MOCK_PARTNERS.filter(p => p.name === userOrg || p.contactPerson === userName);
        return [];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentData, setCurrentData] = useState<Partner | undefined>(undefined);

    const handleSave = (data: any) => {
        if (currentData) {
            setPartners(prev => prev.map(p => p.id === currentData.id ? { ...p, ...data } : p));
            onNotify('保存成功', '合伙人信息已更新', 'success');
        } else {
            // 如果是服务商添加，自动绑定
            const newData = userRole === Role.PROVIDER 
                ? { ...data, providerName: userOrg } 
                : data;

            setPartners([{ id: `p_${Date.now()}`, ...newData, status: 'active', createTime: new Date().toISOString(), stationCount: 0, staffCount: 0 }, ...partners]);
            onNotify('添加成功', '合伙人已添加', 'success');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-3 border border-gray-200 p-4 rounded-lg bg-white flex justify-between items-center">
                 {userRole !== Role.PARTNER ? (
                     <button onClick={() => { setCurrentData(undefined); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> 新增合伙人
                     </button>
                 ) : <div></div>}
                 
                 <div className="flex gap-2">
                     <input type="text" placeholder="合伙人名称/电话" className="border border-gray-300 rounded px-3 py-2 text-sm w-48" />
                     <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">查询</button>
                 </div>
             </div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">合伙人名称</th>
                            <th className="p-4">所属服务商</th>
                            <th className="p-4">负责人</th>
                            <th className="p-4">联系电话</th>
                            <th className="p-4">服务站数</th>
                            <th className="p-4">状态</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {partners.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{p.name}</td>
                                <td className="p-4">{p.providerName}</td>
                                <td className="p-4">{p.contactPerson}</td>
                                <td className="p-4">{p.phone}</td>
                                <td className="p-4">{p.stationCount}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${p.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{p.status === 'active' ? '正常' : '禁用'}</span></td>
                                <td className="p-4">
                                    <button onClick={() => { setCurrentData(p); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 mr-2">编辑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <PartnerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={currentData} onSubmit={handleSave} isReadOnly={userRole === Role.PARTNER} />
        </div>
    );
};

// ---------------------------
// 物业公司管理 (Property Manager)
// ---------------------------
export const PropertyManager = ({ onNotify, userRole, userOrg }: ManagerProps) => {
    // 权限过滤 - Fixed Logic
    const [properties, setProperties] = useState(() => {
        if (userRole === Role.KUAIJIN) return MOCK_PROPERTIES;
        if (userRole === Role.PROPERTY) return MOCK_PROPERTIES.filter(p => p.name === userOrg);
        if (userRole === Role.PROVIDER) return MOCK_PROPERTIES.filter(p => p.providerName === userOrg);
        return [];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProperty, setCurrentProperty] = useState<PropertyCompany | undefined>(undefined);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [searchName, setSearchName] = useState('');

    const handleSave = (data: any) => {
        if (currentProperty) {
            setProperties(prev => prev.map(p => p.id === currentProperty.id ? { ...p, ...data } : p));
            onNotify('保存成功', '物业公司信息已更新', 'success');
        } else {
             // Auto-inject provider name if logged in as provider
             const newData = userRole === Role.PROVIDER 
                ? { ...data, providerName: userOrg } 
                : data;

            if (userRole === Role.PROVIDER) {
                // If provider adds, assume active or pending, here we just add to list for demo
                 setProperties([{ id: `prop_${Date.now()}`, ...newData, stationCount: 0, createTime: new Date().toISOString().slice(0, 19).replace('T', ' '), status: 'active' }, ...properties]);
                onNotify('添加成功', '新物业公司已添加', 'success');
            } else {
                setProperties([{ id: `prop_${Date.now()}`, ...newData, stationCount: 0, createTime: new Date().toISOString().slice(0, 19).replace('T', ' '), status: 'active' }, ...properties]);
                onNotify('添加成功', '新物业公司已添加', 'success');
            }
        }
    };

    const handleDelete = (id: string) => {
        if(confirm('确认删除?')) { 
            setProperties(properties.filter(x => x.id !== id)); 
            onNotify('删除成功', '', 'info'); 
        }
    };

    const filteredProperties = properties.filter(p => p.name.includes(searchName));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-3 border border-gray-200 p-4 rounded-lg bg-white flex justify-between items-center">
                 {userRole !== Role.PROPERTY && (
                     <button 
                        onClick={() => { setCurrentProperty(undefined); setIsReadOnly(false); setIsModalOpen(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                     >
                        <Edit className="w-4 h-4" /> 添加公司
                     </button>
                 )}
                 {userRole === Role.PROPERTY && <div></div>}

                 <div className="flex gap-2">
                     <input 
                        type="text" 
                        placeholder="公司名称" 
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none w-48"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                     />
                     <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                        查询
                     </button>
                 </div>
             </div>

             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold uppercase tracking-wider text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4 text-center bg-gray-50 border-b border-gray-200 whitespace-nowrap">公司名称</th>
                            <th className="p-4 text-center bg-gray-50 border-b border-gray-200 whitespace-nowrap">公司地址</th>
                            <th className="p-4 text-center bg-gray-50 border-b border-gray-200 whitespace-nowrap">所属服务商</th>
                            <th className="p-4 text-center bg-gray-50 border-b border-gray-200 whitespace-nowrap">服务站</th>
                            <th className="p-4 text-center bg-gray-50 border-b border-gray-200 whitespace-nowrap">用户名称</th>
                            <th className="p-4 text-center bg-gray-50 border-b border-gray-200 whitespace-nowrap">登录账号</th>
                            <th className="p-4 text-center bg-gray-50 border-b border-gray-200 whitespace-nowrap">手机号码</th>
                            <th className="p-4 text-center bg-gray-50 border-b border-gray-200 whitespace-nowrap">创建时间</th>
                            <th className="p-4 text-center bg-gray-50 border-b border-gray-200 whitespace-nowrap">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredProperties.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-center font-medium text-gray-900">{p.name}</td>
                                <td className="p-4 text-center max-w-xs truncate" title={p.address}>{p.address}</td>
                                <td className="p-4 text-center">{p.providerName || '-'}</td>
                                <td className="p-4 text-center">
                                    <span className="text-blue-600 cursor-pointer hover:underline">{p.stationCount}</span>
                                </td>
                                <td className="p-4 text-center">{p.contact}</td>
                                <td className="p-4 text-center">{p.account}</td>
                                <td className="p-4 text-center font-mono">{p.phone}</td>
                                <td className="p-4 text-center text-xs text-gray-500 whitespace-nowrap">{p.createTime}</td>
                                <td className="p-4 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => { setCurrentProperty(p); setIsReadOnly(false); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 text-sm font-medium">编辑</button>
                                        {userRole !== Role.PROPERTY && <button onClick={() => handleDelete(p.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">删除</button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <PropertyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={currentProperty} onSubmit={handleSave} isReadOnly={isReadOnly} />
        </div>
    );
};

// ---------------------------
// 服务站管理 (Station Manager)
// ---------------------------
export const StationManager = ({ onNotify, userRole, userOrg }: ManagerProps) => {
    // 权限过滤逻辑
    const [stations, setStations] = useState(() => {
        if (userRole === Role.KUAIJIN) return MOCK_STATIONS;
        
        if (userRole === Role.PROVIDER) {
            // 服务商看自己辖下的合伙人/物业的服务站
            // 1. 找出该服务商下的合伙人
            const myPartnerNames = MOCK_PARTNERS.filter(p => p.providerName === userOrg).map(p => p.name);
            // 2. 找出该服务商下的物业
            const myPropertyNames = MOCK_PROPERTIES.filter(p => p.providerName === userOrg).map(p => p.name);

            // 3. 找出这些合伙人/物业下的服务站
            return MOCK_STATIONS.filter(s => myPartnerNames.includes(s.partnerName) || (s.propertyName && myPropertyNames.includes(s.propertyName)));
        }

        if (userRole === Role.PARTNER) {
            return MOCK_STATIONS.filter(s => s.partnerName === userOrg);
        }

        if (userRole === Role.PROPERTY) {
            return MOCK_STATIONS.filter(s => s.propertyName === userOrg);
        }

        // 站长看自己 (如果扩展此角色)
        if (userRole === Role.STATION) {
             return MOCK_STATIONS.filter(s => s.name === userOrg);
        }

        return [];
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [currentData, setCurrentData] = useState<Station | undefined>(undefined);

    const handleSave = (data: any) => {
        if (currentData) {
            setStations(prev => prev.map(s => s.id === currentData.id ? { ...s, ...data } : s));
            onNotify('保存成功', '服务站信息已更新', 'success');
        } else {
            setStations([{ id: `s_${Date.now()}`, ...data, status: 'normal', createTime: new Date().toISOString() }, ...stations]);
            onNotify('添加成功', '服务站已添加', 'success');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-3 border border-gray-200 p-4 rounded-lg bg-white flex justify-between items-center">
                 {userRole !== Role.PROPERTY && (
                     <button onClick={() => { setCurrentData(undefined); setIsFormOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> 新增服务站
                     </button>
                 )}
                 {userRole === Role.PROPERTY && <div></div>}
                 
                 <div className="flex gap-2">
                     <input type="text" placeholder="服务站名称/账号" className="border border-gray-300 rounded px-3 py-2 text-sm w-48" />
                     <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">查询</button>
                 </div>
             </div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">服务站名称</th>
                            <th className="p-4">账号</th>
                            <th className="p-4">所属合伙人</th>
                            <th className="p-4">所属物业</th>
                            <th className="p-4">库存</th>
                            <th className="p-4">余额</th>
                            <th className="p-4">状态</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {stations.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{s.name}</td>
                                <td className="p-4">{s.account}</td>
                                <td className="p-4">{s.partnerName}</td>
                                <td className="p-4">{s.propertyName || '-'}</td>
                                <td className="p-4">{s.stock}</td>
                                <td className="p-4 font-bold text-orange-500">¥{s.balance.toFixed(2)}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${s.status === 'normal' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{s.status === 'normal' ? '正常' : '异常'}</span></td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => { setCurrentData(s); setIsFormOpen(true); }} className="text-blue-600 hover:text-blue-800">编辑</button>
                                    <button onClick={() => { setIsConfigOpen(true); }} className="text-gray-600 hover:text-gray-800">配置</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <StationFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} initialData={currentData} onSubmit={handleSave} />
            <StationConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
        </div>
    );
};

// ---------------------------
// 审核管理 (Audit Manager)
// ---------------------------
export const AuditManager = ({ onNotify, subModule, mode, userRole, userOrg }: ManagerProps & { subModule: 'station' | 'partner' | 'property', mode: 'action' | 'query' }) => {
    // 根据角色过滤审核单
    const filterByRole = (list: any[]) => {
        if (userRole === Role.KUAIJIN) return list;
        if (userRole === Role.PROVIDER) {
            // 服务商能看到的审核：
            // 1. 自己提交的 (Query模式)
            // 2. 下级合伙人/服务站提交的 (Action模式)
            if (subModule === 'station') return list.filter(i => i.providerName === userOrg);
            if (subModule === 'property') return list.filter(i => i.providerName === userOrg);
        }
        if (userRole === Role.PARTNER) {
            if (subModule === 'station') return list.filter(i => i.partnerName === userOrg);
        }
        return list; // Default fallback
    };

    const [stationAudits, setStationAudits] = useState(() => filterByRole(MOCK_AUDITS));
    const [partnerAudits, setPartnerAudits] = useState(() => filterByRole(MOCK_PARTNER_AUDITS));
    const [propertyAudits, setPropertyAudits] = useState(() => filterByRole(MOCK_PROPERTY_AUDITS));

    const [modalOpen, setModalOpen] = useState(false);
    const [currentData, setCurrentData] = useState<any>(null);

    // Filter States
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Reset filters when module/mode changes
    useEffect(() => {
        setSearchText('');
        setStatusFilter('all');
    }, [subModule, mode]);

    const handleApprove = (id: string) => {
        if (subModule === 'station') setStationAudits(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
        else if (subModule === 'partner') setPartnerAudits(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
        else setPropertyAudits(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
        
        onNotify('审核通过', '申请已批准', 'success');
        setModalOpen(false);
    };

    const handleReject = (id: string) => {
        if (subModule === 'station') setStationAudits(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
        else if (subModule === 'partner') setPartnerAudits(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
        else setPropertyAudits(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));

        onNotify('审核驳回', '申请已驳回', 'warning');
        setModalOpen(false);
    };

    const getFilteredData = () => {
        let data: any[] = [];
        if (subModule === 'station') data = stationAudits;
        else if (subModule === 'partner') data = partnerAudits;
        else data = propertyAudits;

        // Base filter for Action mode (usually only pending)
        if (mode === 'action') {
            data = data.filter(item => item.status === 'pending');
        }

        // Search Filter
        if (searchText) {
            const lower = searchText.toLowerCase();
            data = data.filter(item => {
                const name = (item.stationName || item.partnerName || item.name || '').toLowerCase();
                const phone = (item.phone || '').toLowerCase();
                const contact = (item.contactPerson || item.contact || '').toLowerCase();
                const account = (item.account || '').toLowerCase();
                return name.includes(lower) || phone.includes(lower) || contact.includes(lower) || account.includes(lower);
            });
        }

        // Status Filter (Query Mode)
        if (mode === 'query' && statusFilter !== 'all') {
            data = data.filter(item => item.status === statusFilter);
        }

        return data;
    };

    const displayList = getFilteredData();

    // 渲染不同的表格列
    const renderTable = () => {
        if (subModule === 'station') {
            return (
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">服务站名称</th>
                            <th className="p-4">申请账号</th>
                            <th className="p-4">所属合伙人</th>
                            <th className="p-4">联系电话</th>
                            <th className="p-4">申请时间</th>
                            <th className="p-4">状态</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {displayList.length > 0 ? displayList.map(a => (
                            <tr key={a.id} className="hover:bg-gray-50">
                                <td className="p-4">{a.stationName}</td>
                                <td className="p-4">{a.account}</td>
                                <td className="p-4">{a.partnerName}</td>
                                <td className="p-4">{a.phone}</td>
                                <td className="p-4">{a.applyTime}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${a.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : a.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{a.status === 'pending' ? '待审核' : a.status === 'approved' ? '已通过' : '已驳回'}</span></td>
                                <td className="p-4"><button onClick={() => { setCurrentData(a); setModalOpen(true); }} className="text-blue-600 hover:underline">{mode === 'action' ? '审核' : '查看'}</button></td>
                            </tr>
                        )) : (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-400">暂无数据</td></tr>
                        )}
                    </tbody>
                </table>
            );
        } else if (subModule === 'partner') {
             return (
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">合伙人名称</th>
                            <th className="p-4">联系人</th>
                            <th className="p-4">联系电话</th>
                            <th className="p-4">申请时间</th>
                            <th className="p-4">状态</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {displayList.length > 0 ? displayList.map(a => (
                            <tr key={a.id} className="hover:bg-gray-50">
                                <td className="p-4">{a.partnerName}</td>
                                <td className="p-4">{a.contactPerson}</td>
                                <td className="p-4">{a.phone}</td>
                                <td className="p-4">{a.applyTime}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${a.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : a.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{a.status === 'pending' ? '待审核' : a.status === 'approved' ? '已通过' : '已驳回'}</span></td>
                                <td className="p-4"><button onClick={() => { setCurrentData(a); setModalOpen(true); }} className="text-blue-600 hover:underline">{mode === 'action' ? '审核' : '查看'}</button></td>
                            </tr>
                        )) : (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-400">暂无数据</td></tr>
                        )}
                    </tbody>
                </table>
             )
        } else {
             return (
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">物业公司</th>
                            <th className="p-4">联系人</th>
                            <th className="p-4">提交服务商</th>
                            <th className="p-4">申请时间</th>
                            <th className="p-4">状态</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {displayList.length > 0 ? displayList.map(a => (
                            <tr key={a.id} className="hover:bg-gray-50">
                                <td className="p-4">{a.name}</td>
                                <td className="p-4">{a.contact}</td>
                                <td className="p-4">{a.providerName}</td>
                                <td className="p-4">{a.applyTime}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${a.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : a.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{a.status === 'pending' ? '待审核' : a.status === 'approved' ? '已通过' : '已驳回'}</span></td>
                                <td className="p-4"><button onClick={() => { setCurrentData(a); setModalOpen(true); }} className="text-blue-600 hover:underline">{mode === 'action' ? '审核' : '查看'}</button></td>
                            </tr>
                        )) : (
                             <tr><td colSpan={6} className="p-8 text-center text-gray-400">暂无数据</td></tr>
                        )}
                    </tbody>
                </table>
             )
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-4 border border-gray-200 p-4 rounded-lg bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    {subModule === 'station' ? '服务站' : subModule === 'partner' ? '合伙人' : '物业公司'}
                    {mode === 'action' ? '审核' : '进度查询'}
                </h2>
                <div className="flex gap-2">
                     <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="搜索名称/电话/账号" 
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                        />
                     </div>
                     
                     {mode === 'query' && (
                         <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                         >
                             <option value="all">所有状态</option>
                             <option value="pending">待审核</option>
                             <option value="approved">已通过</option>
                             <option value="rejected">已驳回</option>
                         </select>
                     )}
                     
                     <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 whitespace-nowrap">查询</button>
                </div>
            </div>
            
            <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                {renderTable()}
            </div>
            
            {subModule === 'station' && <AuditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} data={currentData} onApprove={handleApprove} onReject={handleReject} isReadOnly={mode === 'query'} />}
            {subModule === 'partner' && <PartnerAuditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} data={currentData} onApprove={handleApprove} onReject={handleReject} isReadOnly={mode === 'query'} />}
            {subModule === 'property' && <PropertyAuditModal isOpen={modalOpen} onClose={() => setModalOpen(false)} data={currentData} onApprove={handleApprove} onReject={handleReject} isReadOnly={mode === 'query'} />}
        </div>
    );
};

// ---------------------------
// 工单管理 (Ticket Manager)
// ---------------------------
export const TicketManager = ({ onNotify }: ManagerProps) => {
    const [tickets, setTickets] = useState(MOCK_TICKETS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentData, setCurrentData] = useState<Ticket | undefined>(undefined);

    const handleSave = (data: any) => {
        if (currentData) {
            setTickets(prev => prev.map(t => t.id === currentData.id ? { ...t, status: 'resolved' } : t));
            onNotify('处理成功', '工单状态已更新', 'success');
        } else {
            const newId = `GD${Date.now()}`;
            setTickets([{ id: newId, ...data, status: 'pending', createTime: new Date().toISOString(), initiator: '当前用户', handler: '-' }, ...tickets]);
            onNotify('创建成功', '工单已提交', 'success');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-3 border border-gray-200 p-4 rounded-lg bg-white flex justify-between items-center">
                 <button onClick={() => { setCurrentData(undefined); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                    <Plus className="w-4 h-4" /> 发起工单
                 </button>
             </div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">工单号</th>
                            <th className="p-4">类型</th>
                            <th className="p-4">描述</th>
                            <th className="p-4">发起人</th>
                            <th className="p-4">状态</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {tickets.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="p-4">{t.id}</td>
                                <td className="p-4">{t.type}</td>
                                <td className="p-4 max-w-xs truncate">{t.description}</td>
                                <td className="p-4">{t.initiator}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${t.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>{t.status === 'pending' ? '待处理' : '已解决'}</span></td>
                                <td className="p-4"><button onClick={() => { setCurrentData(t); setIsModalOpen(true); }} className="text-blue-600 hover:underline">处理</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <TicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={currentData} onSubmit={handleSave} />
        </div>
    );
};

// ---------------------------
// 快递包裹管理 (Parcel Manager)
// ---------------------------
export const ParcelManager = ({ onNotify }: ManagerProps) => {
    const [parcels] = useState(MOCK_PARCELS);
    const [traceModalOpen, setTraceModalOpen] = useState(false);
    const [currentTrackingNo, setCurrentTrackingNo] = useState('');

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-3 border border-gray-200 p-4 rounded-lg bg-white flex justify-between items-center">
                 <div className="flex gap-2">
                     <input type="text" placeholder="运单号/取件码" className="border border-gray-300 rounded px-3 py-2 text-sm w-48" />
                     <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">查询</button>
                 </div>
             </div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">运单号</th>
                            <th className="p-4">快递品牌</th>
                            <th className="p-4">取件码</th>
                            <th className="p-4">入库时间</th>
                            <th className="p-4">状态</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {parcels.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono">{p.id}</td>
                                <td className="p-4">{p.brand}</td>
                                <td className="p-4 font-bold">{p.pickupCode}</td>
                                <td className="p-4">{p.inboundTime}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${p.status === 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{p.status}</span></td>
                                <td className="p-4">
                                    <button onClick={() => { setCurrentTrackingNo(p.id); setTraceModalOpen(true); }} className="text-blue-600 hover:underline text-xs">查看轨迹</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <TraceModal isOpen={traceModalOpen} onClose={() => setTraceModalOpen(false)} trackingNo={currentTrackingNo} />
        </div>
    );
};

// ---------------------------
// 归档管理 (Archive Manager)
// ---------------------------
export const ArchiveManager = ({ onNotify }: ManagerProps) => {
    const [archives] = useState(MOCK_ARCHIVED_PARCELS);
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-4 font-bold text-gray-700">历史归档包裹</div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">运单号</th>
                            <th className="p-4">快递品牌</th>
                            <th className="p-4">入库时间</th>
                            <th className="p-4">出库时间</th>
                            <th className="p-4">状态</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {archives.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono">{p.id}</td>
                                <td className="p-4">{p.brand}</td>
                                <td className="p-4">{p.inboundTime}</td>
                                <td className="p-4">{p.outboundTime}</td>
                                <td className="p-4 text-green-600">已签收</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ---------------------------
// 交易明细管理 (Finance Transaction Manager)
// ---------------------------
export const FinanceTransactionManager = ({ onNotify }: ManagerProps) => {
    const [records] = useState(MOCK_FINANCE);

    // Removed the "Manual Transaction Adjustment" button as requested
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-3 border border-gray-200 p-4 rounded-lg bg-white flex justify-between items-center">
                 <h3 className="font-bold text-gray-700">交易流水明细</h3>
             </div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">流水号</th>
                            <th className="p-4">日期</th>
                            <th className="p-4">类型</th>
                            <th className="p-4">主体</th>
                            <th className="p-4 text-right">金额</th>
                            <th className="p-4 text-center">状态</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {records.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono">{r.id}</td>
                                <td className="p-4">{r.date}</td>
                                <td className="p-4">{r.type}</td>
                                <td className="p-4">{r.subject}</td>
                                <td className={`p-4 text-right font-bold ${r.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{r.amount > 0 ? '+' : ''}{r.amount}</td>
                                <td className="p-4 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs">成功</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ---------------------------
// 收益账单管理 (Finance Bill Manager)
// ---------------------------
export const FinanceBillManager = ({ onNotify, userRole, userOrg }: ManagerProps) => {
    // 账单数据过滤逻辑：确保物业公司只能看到自己下属服务站的账单
    const [bills] = useState(() => {
        let relevantStations: string[] = [];
        
        // 平台管理员：所有账单
        if (userRole === Role.KUAIJIN) return MOCK_BILLS;

        // 服务商：自己辖下的合伙人 -> 辖下的服务站
        if (userRole === Role.PROVIDER) {
             const partnerNames = MOCK_PARTNERS.filter(p => p.providerName === userOrg).map(p => p.name);
             relevantStations = MOCK_STATIONS.filter(s => partnerNames.includes(s.partnerName)).map(s => s.name);
        } 
        // 合伙人：自己名下的服务站
        else if (userRole === Role.PARTNER) {
             relevantStations = MOCK_STATIONS.filter(s => s.partnerName === userOrg).map(s => s.name);
        } 
        // 物业公司：归属于自己物业公司的服务站
        else if (userRole === Role.PROPERTY) {
             relevantStations = MOCK_STATIONS.filter(s => s.propertyName === userOrg).map(s => s.name);
        }
        // 其他角色 (如站长)
        else if (userRole === Role.STATION) {
             return MOCK_BILLS.filter(b => b.stationName === userOrg);
        }
        else {
             return [];
        }
        
        return MOCK_BILLS.filter(b => relevantStations.includes(b.stationName));
    });

    const [detailModalOpen, setDetailModalOpen] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-4 font-bold text-gray-700">月度收益账单</div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">账单号</th>
                            <th className="p-4">账期</th>
                            <th className="p-4">账户名称</th>
                            <th className="p-4">归属服务站</th>
                            <th className="p-4 text-right">账单金额</th>
                            <th className="p-4">状态</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {bills.length > 0 ? bills.map(b => (
                            <tr key={b.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono">{b.id}</td>
                                <td className="p-4">{b.month}</td>
                                <td className="p-4">{b.name}</td>
                                <td className="p-4">{b.stationName}</td>
                                <td className="p-4 text-right font-bold">¥{b.amount.toFixed(2)}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${b.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{b.status === 'paid' ? '已打款' : '已确认'}</span></td>
                                <td className="p-4"><button onClick={() => setDetailModalOpen(true)} className="text-blue-600 hover:underline">明细</button></td>
                            </tr>
                        )) : (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-400">暂无账单数据</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <BillDetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} />
        </div>
    );
};

// ---------------------------
// 分账设置管理 (Split Bill Manager)
// ---------------------------
export const SplitBillManager = ({ onNotify }: ManagerProps) => {
    const [configs, setConfigs] = useState(MOCK_SPLIT_CONFIGS);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentConfig, setCurrentConfig] = useState<SplitConfig | null>(null);
    
    // Add tab state
    const [activeTab, setActiveTab] = useState<'kuaijin' | 'provider' | 'partner' | 'property' | 'staff'>('kuaijin');

    const handleUpdate = (updated: SplitConfig) => {
        setConfigs(prev => prev.map(c => c.id === updated.id ? updated : c));
        onNotify('更新成功', '分账配置已生效', 'success');
    };

    // Filter configs based on activeTab
    const filteredConfigs = configs.filter(c => c.entityType === activeTab);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-4 flex justify-between items-center">
                 <h3 className="font-bold text-gray-700">全平台分账比例配置</h3>
             </div>
             
             {/* Tab Navigation */}
             <div className="flex border-b mb-4">
                <button 
                    onClick={() => setActiveTab('kuaijin')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'kuaijin' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    平台
                </button>
                <button 
                    onClick={() => setActiveTab('provider')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'provider' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    服务商
                </button>
                <button 
                    onClick={() => setActiveTab('partner')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'partner' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    合伙人
                </button>
                <button 
                    onClick={() => setActiveTab('property')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'property' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    物业
                </button>
                <button 
                    onClick={() => setActiveTab('staff')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'staff' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    服务站人员
                </button>
             </div>

             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">分账主体</th>
                            <th className="p-4">主体类型</th>
                            {activeTab === 'staff' && (
                                <>
                                    <th className="p-4">服务站</th>
                                    <th className="p-4">所属合伙人</th>
                                    <th className="p-4">所属服务商</th>
                                    <th className="p-4">所属公司</th>
                                </>
                            )}
                            <th className="p-4">钱包账户</th>
                            
                            {/* Dynamic Ratio Headers */}
                            {activeTab === 'property' ? (
                                <>
                                    <th className="p-4 text-right">物业分润</th>
                                    <th className="p-4 text-right">服务商分润</th>
                                    <th className="p-4 text-right">总计</th>
                                </>
                            ) : (
                                <th className="p-4 text-right">分账比例</th>
                            )}
                            
                            <th className="p-4">状态</th>
                            <th className="p-4">更新时间</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredConfigs.length > 0 ? filteredConfigs.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{c.entityName}</td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded border ${
                                        c.entityType === 'kuaijin' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                        c.entityType === 'provider' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                        c.entityType === 'partner' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                                        c.entityType === 'staff' ? 'bg-teal-50 text-teal-600 border-teal-200' :
                                        'bg-orange-50 text-orange-600 border-orange-200'
                                    }`}>
                                        {c.entityType === 'kuaijin' ? '平台' :
                                         c.entityType === 'provider' ? '服务商' :
                                         c.entityType === 'partner' ? '合伙人' : 
                                         c.entityType === 'staff' ? '服务站人员' : '物业'}
                                    </span>
                                </td>
                                {activeTab === 'staff' && (
                                    <>
                                        <td className="p-4">{c.stationName || '-'}</td>
                                        <td className="p-4">{c.partnerName || '-'}</td>
                                        <td className="p-4">{c.providerName || '-'}</td>
                                        <td className="p-4">{c.propertyName || '-'}</td>
                                    </>
                                )}
                                <td className="p-4 font-mono text-gray-500">{c.walletAccount}</td>
                                
                                {/* Dynamic Ratio Cells */}
                                {activeTab === 'property' ? (
                                    <>
                                        <td className="p-4 text-right font-bold text-orange-600">{c.ratio}%</td>
                                        <td className="p-4 text-right font-bold text-blue-600">{c.providerRatio || 0}%</td>
                                        <td className="p-4 text-right font-bold">
                                            <span className={(c.ratio + (c.providerRatio || 0)) > 25 ? 'text-red-500' : 'text-green-600'}>
                                                {c.ratio + (c.providerRatio || 0)}%
                                            </span>
                                        </td>
                                    </>
                                ) : (
                                    <td className="p-4 text-right font-bold text-blue-600">{c.ratio}%</td>
                                )}

                                <td className="p-4">
                                    <span className={`w-2 h-2 inline-block rounded-full mr-1 ${c.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {c.status === 'active' ? '启用' : '停用'}
                                </td>
                                <td className="p-4 text-gray-400">{c.updateTime}</td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => { setCurrentConfig(c); setEditModalOpen(true); }}
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <Edit className="w-3 h-3" /> 调整
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={activeTab === 'staff' ? 11 : activeTab === 'property' ? 9 : 7} className="p-8 text-center text-gray-400">暂无数据</td></tr>
                        )}
                    </tbody>
                </table>
             </div>
             <SplitConfigModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} config={currentConfig} onUpdate={handleUpdate} />
        </div>
    );
};

// ---------------------------
// 支付管理 (Payment Manager)
// ---------------------------
export const PaymentManager = ({ onNotify }: ManagerProps) => {
    const [payments] = useState(MOCK_PAYMENTS);
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-4 font-bold text-gray-700">充值支付记录</div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">充值人</th>
                            <th className="p-4">手机号</th>
                            <th className="p-4">充值金额</th>
                            <th className="p-4">方式</th>
                            <th className="p-4">时间</th>
                            <th className="p-4">充值后余额</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {payments.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-4">{p.courierName}</td>
                                <td className="p-4">{p.phone}</td>
                                <td className="p-4 font-bold">¥{p.amount}</td>
                                <td className="p-4">{p.method}</td>
                                <td className="p-4">{p.time}</td>
                                <td className="p-4">¥{p.balance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ---------------------------
// 帮助中心 (Help Center)
// ---------------------------
export const HelpCenterManager = ({ onNotify }: ManagerProps) => {
    const [docs] = useState(MOCK_DOCUMENTS);
    const [viewDoc, setViewDoc] = useState<HelpDocument | undefined>(undefined);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                帮助文档库
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {docs.map(doc => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gray-50 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">{doc.category}</span>
                            <span className="text-xs text-gray-400">{doc.updateTime}</span>
                        </div>
                        <h4 className="text-md font-bold text-gray-800 mb-2">{doc.title}</h4>
                        <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end">
                            <button 
                                onClick={() => setViewDoc(doc)}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                            >
                                <Eye className="w-4 h-4" /> 在线查阅
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <DocumentViewerModal isOpen={!!viewDoc} onClose={() => setViewDoc(undefined)} document={viewDoc} watermarkText="快金数据内部文档" />
        </div>
    );
};

// ---------------------------
// 角色管理 (System Role Manager)
// ---------------------------
export const SystemRoleManager = ({ onNotify }: ManagerProps) => {
    const [roles, setRoles] = useState(MOCK_ROLES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRole, setCurrentRole] = useState<SystemRole | undefined>(undefined);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-3 border border-gray-200 p-4 rounded-lg bg-white flex justify-between items-center">
                 <button onClick={() => { setCurrentRole(undefined); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                    <Plus className="w-4 h-4" /> 新增角色
                 </button>
             </div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">角色名称</th>
                            <th className="p-4">描述</th>
                            <th className="p-4">创建时间</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {roles.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold">{r.name}</td>
                                <td className="p-4">{r.description}</td>
                                <td className="p-4">{r.createTime}</td>
                                <td className="p-4"><button onClick={() => { setCurrentRole(r); setIsModalOpen(true); }} className="text-blue-600 hover:underline">权限配置</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <RoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={currentRole} />
        </div>
    );
};

// ---------------------------
// 用户管理 (System User Manager)
// ---------------------------
export const SystemUserManager = ({ onNotify, userRole, userOrg }: ManagerProps) => {
    const [users, setUsers] = useState(MOCK_SYSTEM_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<SystemUser | undefined>(undefined);

    // Filter logic: Kuaijin sees all, others see only their organization
    const filteredUsers = users.filter(u => {
        if (userRole === Role.KUAIJIN) return true;
        // Strict isolation based on organization name
        return u.organization === userOrg;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-3 border border-gray-200 p-4 rounded-lg bg-white flex justify-between items-center">
                 <button onClick={() => { setCurrentUser(undefined); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                    <Plus className="w-4 h-4" /> 新增用户
                 </button>
             </div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4">用户名</th>
                            <th className="p-4">手机号</th>
                            <th className="p-4">角色</th>
                            <th className="p-4">归属组织</th>
                            <th className="p-4">钱包余额</th>
                            <th className="p-4">状态</th>
                            <th className="p-4">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{u.username}</td>
                                <td className="p-4">{u.phone}</td>
                                <td className="p-4"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">{u.roleName}</span></td>
                                <td className="p-4 max-w-xs truncate" title={u.organization}>{u.organization || '-'}</td>
                                <td className="p-4 font-mono">{u.walletBalance ? `¥${u.walletBalance}` : '-'}</td>
                                <td className="p-4"><span className="text-green-600 text-xs">正常</span></td>
                                <td className="p-4"><button onClick={() => { setCurrentUser(u); setIsModalOpen(true); }} className="text-blue-600 hover:underline">编辑</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <UserModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                initialData={currentUser} 
                currentUserRole={userRole}
                currentUserOrg={userOrg}
            />
        </div>
    );
};

// ---------------------------
// 报表管理 (Report Manager)
// ---------------------------
export const ReportManager = ({ onNotify }: ManagerProps) => {
    const [reports] = useState(MOCK_REPORTS);
    const [detailReport, setDetailReport] = useState<ReportData | undefined>(undefined);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-3 border border-gray-200 p-4 rounded-lg bg-white flex justify-between items-center">
                 <h3 className="font-bold text-gray-700">业务数据报表</h3>
                 <button className="text-gray-600 hover:text-gray-800 border px-3 py-1.5 rounded text-sm flex items-center gap-1">
                     <Download className="w-4 h-4" /> 导出Excel
                 </button>
             </div>
             <div className="flex-1 overflow-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4 whitespace-nowrap">服务站名称</th>
                            <th className="p-4 whitespace-nowrap">省</th>
                            <th className="p-4 whitespace-nowrap">市</th>
                            <th className="p-4 whitespace-nowrap">区</th>
                            <th className="p-4 whitespace-nowrap">小区名称</th>
                            <th className="p-4 whitespace-nowrap">负责人</th>
                            <th className="p-4 text-right whitespace-nowrap">入库条数</th>
                            <th className="p-4 text-right whitespace-nowrap">出库条数</th>
                            <th className="p-4 text-right whitespace-nowrap">问题件数</th>
                            <th className="p-4 whitespace-nowrap">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {reports.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{r.name}</td>
                                <td className="p-4">{r.province || '-'}</td>
                                <td className="p-4">{r.city || '-'}</td>
                                <td className="p-4">{r.district || '-'}</td>
                                <td className="p-4">{r.community || '-'}</td>
                                <td className="p-4">{r.contact || '-'}</td>
                                <td className="p-4 text-right">{r.totalInbound}</td>
                                <td className="p-4 text-right">{r.totalOutbound}</td>
                                <td className="p-4 text-right text-red-600 font-medium">{r.issueCount || 0}</td>
                                <td className="p-4">
                                    <button onClick={() => setDetailReport(r)} className="text-blue-600 hover:underline">查看明细</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ReportDetailModal isOpen={!!detailReport} onClose={() => setDetailReport(undefined)} report={detailReport} />
        </div>
    );
};