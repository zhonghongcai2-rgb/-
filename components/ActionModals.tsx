

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Upload, Plus, Trash2, Image as ImageIcon, ChevronRight, ChevronDown, Folder, MousePointer, AlertTriangle, User, Truck, Check, Wallet, Building, Users, Store, LayoutGrid, FileText, Briefcase, Eye, Clock, Search, MapPin } from 'lucide-react';
import { MOCK_TRACES, PAYER_TYPES, ROLES_OPTIONS, MOCK_PARTNERS, PERMISSION_TREE, PermissionNode, BILLING_TYPES, MOCK_PROPERTIES, EXPRESS_BRANDS, MOCK_STATION_STAFF, MOCK_BILL_DETAILS, MOCK_EXPRESS_CONFIGS, MOCK_STATIONS, MOCK_SYSTEM_USERS, MOCK_PROVIDERS, CASCADER_REGIONS } from '../constants';
import { Partner, Station, Ticket, SystemRole, SystemUser, PartnerAuditRecord, PropertyCompany, StationStaff, BillDetail, HelpDocument, ServiceProvider, PropertyAuditRecord, ReportData, ReportDetailItem, SplitConfig, StationBrandConfig, Role } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  zIndex?: number;
}

// 全局 Toast 组件 (简单模拟)
export const Toast = ({ message, type = 'success', visible, onClose }: { message: string, type?: 'success' | 'info' | 'error', visible: boolean, onClose: () => void }) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    if (!visible) return null;

    const bgColors = {
        success: 'bg-green-600',
        info: 'bg-blue-600',
        error: 'bg-red-600'
    };

    return (
        <div className={`fixed top-6 right-6 ${bgColors[type]} text-white px-4 py-3 rounded shadow-lg z-[100] flex items-center gap-2 animate-fade-in-down`}>
            {type === 'success' ? <CheckCircle className="w-5 h-5" /> : type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
};


// 通用弹窗容器组件 (Generic Wrapper)
export const GenericModal = ({ isOpen, onClose, title, children, footer, size = 'md', zIndex = 50 }: ModalProps) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-6xl', // Increased for wider content like tables
    full: 'max-w-[95%] h-[90%]',
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4`} style={{ zIndex }}>
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} flex flex-col max-h-full transform transition-all`}>
        {title && (
            <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
            </button>
            </div>
        )}
        {!title && (
             <div className="absolute right-4 top-4 z-10">
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-6 h-6" />
                </button>
             </div>
        )}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg flex justify-center gap-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 二次确认弹窗 (Confirmation Modal) ---
export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string, type?: 'danger' | 'warning' | 'info' }) => {
    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title} 
            size="sm"
            zIndex={60}
            footer={
                <>
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm font-medium">取消</button>
                    <button onClick={() => { onConfirm(); onClose(); }} className={`px-4 py-2 text-white rounded text-sm font-medium ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>确认</button>
                </>
            }
        >
             <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full shrink-0 ${type === 'danger' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <AlertTriangle className={`w-6 h-6 ${type === 'danger' ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div>
                    <h4 className="text-base font-bold text-gray-900 mb-1">{title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                </div>
            </div>
        </GenericModal>
    );
};

// --- 文档查看器弹窗 (Document Viewer Modal) ---
export const DocumentViewerModal = ({ isOpen, onClose, document, watermarkText }: { isOpen: boolean, onClose: () => void, document?: HelpDocument, watermarkText?: string }) => {
    
    // 生成 SVG 水印背景图
    const WatermarkOverlay = ({ text }: { text: string }) => {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
                <text x="150" y="150" fill="rgba(200, 200, 200, 0.25)" font-size="24" font-family="sans-serif" 
                      transform="rotate(-30 150 150)" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
                    ${text}
                </text>
            </svg>
        `;
        const bgImage = `url("data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}")`;
        
        return (
            <div 
                className="absolute inset-0 pointer-events-none z-50"
                style={{ backgroundImage: bgImage, backgroundRepeat: 'repeat' }}
            />
        );
    }

    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={document ? document.title : '文档查看'} 
            size="xl"
            footer={
                <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">关闭</button>
            }
        >
            {document ? (
                <div className="relative min-h-[400px]">
                    {/* Watermark Overlay */}
                    {watermarkText && <WatermarkOverlay text={watermarkText} />}
                    
                    <div className="prose prose-sm max-w-none text-gray-700 select-text relative z-10">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 border-b pb-4">
                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">{document.category}</span>
                            <span>更新时间: {document.updateTime}</span>
                            <span className="ml-auto text-orange-500 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> 仅供在线查阅，不可下载
                            </span>
                        </div>
                        
                        {/* 简单的 Markdown 模拟渲染 */}
                        <div className="space-y-4">
                            {document.content.split('\n').map((line, idx) => {
                                if (line.startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold text-gray-900 mt-6 mb-4">{line.replace('# ', '')}</h1>;
                                if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-semibold text-gray-800 mt-5 mb-3">{line.replace('## ', '')}</h2>;
                                if (line.startsWith('### ')) return <h3 key={idx} className="text-lg font-medium text-gray-800 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                                if (line.startsWith('- ')) return <li key={idx} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
                                if (line.match(/^\d+\. /)) return <div key={idx} className="font-medium mt-2">{line}</div>;
                                if (line.trim() === '') return <br key={idx} />;
                                return <p key={idx} className="leading-relaxed">{line}</p>;
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <FileText className="w-16 h-16 mb-4 opacity-20" />
                    <p>无法加载文档内容</p>
                </div>
            )}
        </GenericModal>
    );
};

// --- 报表明细弹窗 (Report Detail Modal) ---
export const ReportDetailModal = ({ isOpen, onClose, report }: { isOpen: boolean, onClose: () => void, report?: ReportData }) => {
    const [details, setDetails] = useState<ReportDetailItem[]>([]);

    useEffect(() => {
        if (isOpen && report) {
            // 根据报表类型生成模拟明细数据
            const mockDetails: ReportDetailItem[] = [];
            const count = 5; // 生成5条模拟数据
            
            for (let i = 0; i < count; i++) {
                let name = '';
                // 模拟名称生成逻辑
                if (report.type === 'station') {
                     // 服务站显示按日期
                    const d = new Date(report.date);
                    d.setDate(d.getDate() - i);
                    name = d.toISOString().split('T')[0]; 
                } else if (report.type === 'provider') {
                    name = MOCK_PARTNERS[i % MOCK_PARTNERS.length]?.name || `合伙人${i+1}`;
                } else if (report.type === 'partner') {
                    name = MOCK_STATIONS[i % MOCK_STATIONS.length]?.name || `服务站${i+1}`;
                } else if (report.type === 'property') {
                     name = MOCK_STATIONS[i % MOCK_STATIONS.length]?.name || `服务站${i+1}`;
                } else {
                    name = `分部${i+1}`;
                }
                
                mockDetails.push({
                    id: `rd_${i}`,
                    name: name,
                    province: report.province || '-',
                    city: report.city || '-',
                    district: report.district || '-',
                    community: report.community || '-',
                    contact: report.contact || '-',
                    inbound: Math.floor(report.totalInbound / count) + Math.floor(Math.random() * 10),
                    outbound: Math.floor(report.totalOutbound / count) + Math.floor(Math.random() * 10),
                    issueCount: Math.floor((report.issueCount || 0) / count)
                });
            }
            setDetails(mockDetails);
        }
    }, [isOpen, report]);

    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`${report?.name || ''} - 报表明细`} 
            size="lg"
            footer={<button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">关闭</button>}
        >
            <div className="overflow-x-auto rounded border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold">
                        <tr>
                            <th className="p-3">服务站名称</th>
                            <th className="p-3">省</th>
                            <th className="p-3">市</th>
                            <th className="p-3">区</th>
                            <th className="p-3">小区名称</th>
                            <th className="p-3">负责人</th>
                            <th className="p-3 text-right">入库条数</th>
                            <th className="p-3 text-right">出库条数</th>
                            <th className="p-3 text-right">问题件数</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {details.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-800">{item.name}</td>
                                <td className="p-3">{item.province}</td>
                                <td className="p-3">{item.city}</td>
                                <td className="p-3">{item.district}</td>
                                <td className="p-3">{item.community}</td>
                                <td className="p-3">{item.contact}</td>
                                <td className="p-3 text-right">{item.inbound}</td>
                                <td className="p-3 text-right">{item.outbound}</td>
                                <td className="p-3 text-right text-red-600 font-medium">{item.issueCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">* 仅展示部分明细数据</p>
        </GenericModal>
    );
};

// --- 表单组件 (Form Components) ---

const InputGroup = ({ label, required, children }: { label: string, required?: boolean, children?: React.ReactNode }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

// Helper for horizontal layout (used in ServiceProviderModal and PartnerModal)
const HorizontalInputGroup = ({ label, required, children, className = '' }: { label: string, required?: boolean, children?: React.ReactNode, className?: string }) => (
  <div className={`flex items-center mb-5 ${className}`}>
    <label className="w-[200px] text-right text-sm text-gray-600 pr-3 leading-[40px] shrink-0 font-medium">
      {required && <span className="text-red-500 mr-1">*</span>}
      {label}
    </label>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

// 资金钱包配置通用组件 (Internal Component)
const WalletConfigSection = ({ 
    title, 
    walletType, setWalletType, 
    walletName, setWalletName, 
    walletId, setWalletId,
    username, setUsername,
    password, setPassword,
    phone, setPhone,
    isUserCreation = false
}: any) => {
    return (
        <div className="bg-blue-50 p-4 rounded border border-blue-100 mb-2">
             <div className="flex items-center gap-2 mb-3">
                 <div className="p-1 bg-blue-100 rounded text-blue-600"><Wallet className="w-4 h-4" /></div>
                 <h4 className="text-sm font-bold text-gray-800">{title || "资金钱包配置 (必填)"}</h4>
             </div>
             
             {isUserCreation && (
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-blue-200 border-dashed">
                     <InputGroup label="登录账号" required>
                        <input 
                            type="text" 
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-200" 
                            placeholder="设置登录用户名" 
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                // 自动同步钱包名称
                                if(walletName === '' || walletName.endsWith('的钱包')) {
                                    setWalletName(e.target.value ? `${e.target.value}的钱包` : '');
                                }
                            }}
                        />
                    </InputGroup>
                    <InputGroup label="初始密码" required>
                        <input 
                            type="text" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-200" 
                        />
                    </InputGroup>
                    {phone !== undefined && (
                        <InputGroup label="联系手机" required>
                            <input 
                                type="text" 
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    // 自动同步钱包ID
                                    setWalletId(e.target.value);
                                }}
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-200" 
                                placeholder="输入手机号"
                            />
                        </InputGroup>
                    )}
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">账户类型</label>
                    <select 
                        className="w-full border rounded p-2 text-sm bg-white" 
                        value={walletType} 
                        onChange={(e) => setWalletType(e.target.value)}
                    >
                        <option value="personal">个人账户</option>
                        <option value="company">对公账户</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">账户名称 (自动)</label>
                    <input 
                        type="text" 
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        className="w-full border rounded p-2 text-sm" 
                        placeholder="用户名+的钱包" 
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">账户ID (自动)</label>
                    <input 
                        type="text" 
                        value={walletId}
                        onChange={(e) => setWalletId(e.target.value)}
                        className="w-full border rounded p-2 text-sm font-mono" 
                        placeholder="同手机号" 
                    />
                </div>
             </div>
             <p className="text-[10px] text-gray-500 mt-2">* 保存后将自动创建关联的登录账号和资金钱包。</p>
        </div>
    );
}

export const ChangePasswordModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="修改登录密码"
            size="sm"
            footer={
                <>
                  <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">取消</button>
                  <button onClick={() => { alert('密码修改成功，请重新登录'); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">确认修改</button>
                </>
            }
        >
            <div className="space-y-4">
                <InputGroup label="原密码" required><input type="password" className="w-full border rounded p-2" /></InputGroup>
                <InputGroup label="新密码" required><input type="password" className="w-full border rounded p-2" /></InputGroup>
                <InputGroup label="确认新密码" required><input type="password" className="w-full border rounded p-2" /></InputGroup>
            </div>
        </GenericModal>
    );
}

export const PropertyModal = ({ isOpen, onClose, initialData, onSubmit, isReadOnly }: { isOpen: boolean, onClose: () => void, initialData?: PropertyCompany, onSubmit: (data: any) => void, isReadOnly?: boolean }) => {
    // Basic Info State
    const [name, setName] = useState('');
    const [contact, setContact] = useState(''); // 用户名称
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState(''); // 公司地址
    const [account, setAccount] = useState(''); // 登录账号
    
    // Login & Wallet State (New)
    const [adminName, setAdminName] = useState('');
    const [adminPassword, setAdminPassword] = useState('123456a');
    const [walletType, setWalletType] = useState('company');
    const [walletName, setWalletName] = useState('');
    const [walletId, setWalletId] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(initialData?.name || '');
            setContact(initialData?.contact || '');
            setPhone(initialData?.phone || '');
            setAddress(initialData?.address || '');
            setAccount(initialData?.account || '');
            
            // Reset new user fields if adding new
            if (!initialData) {
                setAdminName('');
                setAdminPassword('123456a');
                setWalletName('');
                setWalletId('');
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = () => {
        onSubmit({
             name, contact, phone, address, account,
             newAdmin: !initialData ? { 
                 username: adminName, 
                 password: adminPassword,
                 walletType,
                 walletName,
                 walletId
             } : undefined
        });
    }

    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={initialData ? (isReadOnly ? "物业公司详情" : "编辑物业公司") : "添加物业公司"}
            size="lg"
            footer={
                isReadOnly ? (
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">关闭</button>
                ) : (
                    <>
                        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">取消</button>
                        <button onClick={() => { handleSubmit(); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">保存</button>
                    </>
                )
            }
        >
            <div className="grid grid-cols-1 gap-4 px-2">
                <HorizontalInputGroup label="公司名称" required>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="请输入公司名称" />
                </HorizontalInputGroup>
                
                <HorizontalInputGroup label="公司地址" required>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="请输入公司地址" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="用户名称" required>
                    <input type="text" value={contact} onChange={e => setContact(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="请输入用户名称" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="登录账号" required>
                    <input type="text" value={account} onChange={e => setAccount(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="请输入登录账号" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="手机号码" required>
                    <input 
                        type="text" 
                        value={phone} 
                        onChange={e => {
                            setPhone(e.target.value);
                            // Sync with admin name/wallet id if empty
                            if(!initialData && !adminName) setAdminName(e.target.value);
                            if(!initialData && !walletId) setWalletId(e.target.value);
                            if(!initialData && !account) setAccount(e.target.value);
                        }}
                        disabled={isReadOnly}
                        className="w-full border border-gray-300 rounded p-2 text-sm" 
                        placeholder="请输入手机号码"
                    />
                </HorizontalInputGroup>
                
                {!initialData && !isReadOnly && (
                    <div className="mt-4">
                        <WalletConfigSection 
                            title="管理员账号与钱包配置 (必填)"
                            isUserCreation={true}
                            username={adminName} setUsername={setAdminName}
                            password={adminPassword} setPassword={setAdminPassword}
                            walletType={walletType} setWalletType={setWalletType}
                            walletName={walletName} setWalletName={setWalletName}
                            walletId={walletId} setWalletId={setWalletId}
                        />
                    </div>
                )}
            </div>
        </GenericModal>
    )
}

export const ServiceProviderModal = ({ isOpen, onClose, initialData, onSubmit, isReadOnly }: { isOpen: boolean, onClose: () => void, initialData?: ServiceProvider, onSubmit: (data: any) => void, isReadOnly?: boolean }) => {
    // Basic Info State
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [phone, setPhone] = useState('');
    const [margin, setMargin] = useState<string>('');
    const [accountType, setAccountType] = useState('对公账户');
    const [accountName, setAccountName] = useState('');
    const [accountId, setAccountId] = useState('');
    const [creditCode, setCreditCode] = useState('');
    const [region, setRegion] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(initialData?.name || '');
            setAddress(initialData?.address || '');
            setContact(initialData?.contact || '');
            setPhone(initialData?.phone || '');
            setMargin(initialData?.margin ? String(initialData.margin) : '');
            setAccountName(initialData?.accountName || '');
            setAccountId(initialData?.accountId || '');
            setCreditCode(initialData?.creditCode || '');
            setRegion(initialData?.region || '');
        }
    }, [isOpen, initialData]);

    const handleSubmit = () => {
        onSubmit({
             name, address, contact, phone, margin, accountType, accountName, accountId, creditCode, region
        });
    }

    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={initialData ? (isReadOnly ? "服务商详情" : "编辑服务商") : "添加服务商"}
            size="lg" // Wide modal for horizontal layout
            footer={
                isReadOnly ? (
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">关闭</button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">取消</button>
                        <button onClick={() => { handleSubmit(); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">确定</button>
                    </div>
                )
            }
        >
            <div className="space-y-1 px-4">
                <HorizontalInputGroup label="服务商名称" required>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入服务商名称" />
                    {!name && !isReadOnly && <p className="text-red-500 text-xs mt-1">请输入服务商名称</p>}
                </HorizontalInputGroup>
                
                <HorizontalInputGroup label="服务商地址" required>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入服务商地址" />
                    {!address && !isReadOnly && <p className="text-red-500 text-xs mt-1">请输入服务商地址</p>}
                </HorizontalInputGroup>

                <HorizontalInputGroup label="负责人" required>
                    <input type="text" value={contact} onChange={e => setContact(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入负责人" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="负责人联系方式" required>
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入负责人联系方式" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="保证金">
                     <div className="relative">
                        <input type="text" value={margin} onChange={e => setMargin(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 pr-8 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入保证金" />
                        <span className="absolute right-3 top-2 text-gray-700 text-sm">元</span>
                     </div>
                </HorizontalInputGroup>

                 <HorizontalInputGroup label="账户类型">
                     <div className="relative">
                         <select value={accountType} onChange={e => setAccountType(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 appearance-none bg-white text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="对公账户">对公账户</option>
                            <option value="个人账户">个人账户</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                     </div>
                </HorizontalInputGroup>

                <HorizontalInputGroup label="账户名称" required>
                    <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入账户名称" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="账户ID" required>
                    <input type="text" value={accountId} onChange={e => setAccountId(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入账户ID" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="社会信用代码">
                    <input type="text" value={creditCode} onChange={e => setCreditCode(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入社会信用代码" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="管辖范围" required>
                     <div className="relative">
                        <select value={region} onChange={e => setRegion(e.target.value)} disabled={isReadOnly} className={`w-full border border-gray-300 rounded p-2 appearance-none bg-white text-sm focus:ring-blue-500 focus:border-blue-500 ${!region ? 'text-gray-400' : 'text-gray-700'}`}>
                            <option value="" disabled>省/市/区</option>
                            <option value="广东省深圳市福田区">广东省深圳市福田区</option>
                            <option value="浙江省杭州市西湖区">浙江省杭州市西湖区</option>
                            {Object.keys(CASCADER_REGIONS).map(prov => (
                                <option key={prov} value={prov}>{prov}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                     </div>
                </HorizontalInputGroup>

                <HorizontalInputGroup label="营业执照">
                     <div className="w-24 h-24 border border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors text-gray-400 hover:text-blue-500 bg-white">
                         <Plus className="w-8 h-8 font-light" />
                     </div>
                </HorizontalInputGroup>
            </div>
        </GenericModal>
    )
}

export const PartnerModal = ({ isOpen, onClose, initialData, onSubmit, isReadOnly }: { isOpen: boolean, onClose: () => void, initialData?: Partner, onSubmit: (data: any) => void, isReadOnly?: boolean }) => {
  // Basic Info
  const [name, setName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [addressDetail, setAddressDetail] = useState(''); // Partner Address
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [margin, setMargin] = useState<string>('');
  
  // Account Info
  const [accountType, setAccountType] = useState('对公账户');
  const [accountName, setAccountName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [creditCode, setCreditCode] = useState('');
  
  // Region
  const [address, setAddress] = useState(''); // Jurisdiction/Region

  useEffect(() => {
      if (isOpen) {
          setName(initialData?.name || '');
          setProviderName(initialData?.providerName || '');
          setAddressDetail(initialData?.addressDetail || '');
          setContactPerson(initialData?.contactPerson || '');
          setPhone(initialData?.phone || '');
          setMargin(initialData?.margin ? String(initialData.margin) : '');
          
          setAccountName(initialData?.accountName || '');
          setAccountId(initialData?.accountId || '');
          setCreditCode(initialData?.creditCode || '');
          setAddress(initialData?.address || ''); // Jurisdiction
      }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
      onSubmit({
          name, providerName, addressDetail, contactPerson, phone, margin,
          accountType, accountName, accountId, creditCode, address
      });
  }

  return (
    <GenericModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? (isReadOnly ? "合伙人详情" : "编辑合伙人") : "添加合伙人"}
      size="lg" // Wide layout
      footer={
        isReadOnly ? (
             <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">关闭</button>
        ) : (
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">取消</button>
              <button onClick={() => { handleSubmit(); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">确定</button>
            </div>
        )
      }
    >
      <div className="space-y-1 px-4">
        <HorizontalInputGroup label="合伙人名称" required>
            <input type="text" value={name} onChange={e => setName(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入合伙人名称" />
        </HorizontalInputGroup>

        <HorizontalInputGroup label="所属服务商" required>
            <div className="relative">
                <select value={providerName} onChange={e => setProviderName(e.target.value)} disabled={isReadOnly} className={`w-full border border-gray-300 rounded p-2 appearance-none bg-white text-sm focus:ring-blue-500 focus:border-blue-500 ${!providerName ? 'text-gray-400' : 'text-gray-700'}`}>
                    <option value="" disabled>请选择所属服务商</option>
                    {MOCK_PROVIDERS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
        </HorizontalInputGroup>

        <HorizontalInputGroup label="合伙人地址" required>
            <input type="text" value={addressDetail} onChange={e => setAddressDetail(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入合伙人地址" />
        </HorizontalInputGroup>

        <HorizontalInputGroup label="负责人" required>
            <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入负责人" />
        </HorizontalInputGroup>

        <HorizontalInputGroup label="负责人联系方式" required>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入负责人联系方式" />
        </HorizontalInputGroup>

        <HorizontalInputGroup label="保证金">
             <div className="relative">
                <input type="text" value={margin} onChange={e => setMargin(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 pr-8 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入保证金" />
                <span className="absolute right-3 top-2 text-gray-700 text-sm">元</span>
             </div>
        </HorizontalInputGroup>

        <HorizontalInputGroup label="账户类型">
             <div className="relative">
                 <select value={accountType} onChange={e => setAccountType(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 appearance-none bg-white text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="对公账户">对公账户</option>
                    <option value="个人账户">个人账户</option>
                 </select>
                 <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>
        </HorizontalInputGroup>

        <HorizontalInputGroup label="账户名称" required>
            <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入账户名称" />
        </HorizontalInputGroup>

        <HorizontalInputGroup label="账户ID" required>
            <input type="text" value={accountId} onChange={e => setAccountId(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入账户ID" />
        </HorizontalInputGroup>

        <HorizontalInputGroup label="社会信用代码">
            <input type="text" value={creditCode} onChange={e => setCreditCode(e.target.value)} disabled={isReadOnly} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400" placeholder="请输入社会信用代码" />
        </HorizontalInputGroup>

        <HorizontalInputGroup label="管辖范围" required>
             <div className="relative">
                <select value={address} onChange={e => setAddress(e.target.value)} disabled={isReadOnly} className={`w-full border border-gray-300 rounded p-2 appearance-none bg-white text-sm focus:ring-blue-500 focus:border-blue-500 ${!address ? 'text-gray-400' : 'text-gray-700'}`}>
                    <option value="" disabled>省/市/区</option>
                    <option value="浙江省-杭州市-上城区">浙江省-杭州市-上城区</option>
                    <option value="浙江省-杭州市-西湖区">浙江省-杭州市-西湖区</option>
                    {Object.keys(CASCADER_REGIONS).map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>
        </HorizontalInputGroup>

        <HorizontalInputGroup label="营业执照">
             <div className="w-24 h-24 border border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors text-gray-400 hover:text-blue-500 bg-white">
                 <Plus className="w-8 h-8 font-light" />
             </div>
        </HorizontalInputGroup>
      </div>
    </GenericModal>
  );
};

export const StationFormModal = ({ isOpen, onClose, initialData, onSubmit, isReadOnly }: { isOpen: boolean, onClose: () => void, initialData?: Station, onSubmit: (data: any) => void, isReadOnly?: boolean }) => {
    // Form State
    const [name, setName] = useState('');
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [contact, setContact] = useState('');
    const [businessHoursStart, setBusinessHoursStart] = useState('00:00');
    const [businessHoursEnd, setBusinessHoursEnd] = useState('23:59');
    const [partnerName, setPartnerName] = useState('');
    const [serviceProvider, setServiceProvider] = useState('');
    const [company, setCompany] = useState('');
    const [region, setRegion] = useState('');
    const [street, setStreet] = useState('');
    const [address, setAddress] = useState('');
    const [deliveryPayer, setDeliveryPayer] = useState('');
    const [smsPayer, setSmsPayer] = useState('');
    const [enableSend, setEnableSend] = useState(false);
    const [matchCustomer, setMatchCustomer] = useState(false);

    useEffect(() => {
        if(isOpen) {
            setName(initialData?.name || '');
            setAccount(initialData?.account || '');
            setPassword('123456'); // Default placeholder or initial
            setContact(initialData?.contact || '');
            setPartnerName(initialData?.partnerName || '');
            setServiceProvider('请选择'); // Default
            setCompany(initialData?.propertyName || '请选择');
            setRegion(initialData?.region || '');
            setAddress('');
            setStreet('');
            setDeliveryPayer('请选择');
            setSmsPayer('请选择');
            setEnableSend(false);
            setMatchCustomer(false);
        }
    }, [isOpen, initialData]);

    const handleSubmit = () => {
        onSubmit({ 
            name, account, contact, partnerName, propertyName: company, region,
            isDispatching: enableSend
        });
    };

    return (
      <GenericModal 
        isOpen={isOpen} 
        onClose={onClose} 
        title="" // Custom title inside content
        size="xl"
        footer={
          isReadOnly ? (
             <button onClick={onClose} className="px-6 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700">关闭</button>
          ) : (
             <>
                <button onClick={() => { handleSubmit(); onClose(); }} className="px-6 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm text-sm font-medium">保 存</button>
                <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm font-medium">取 消</button>
             </>
          )
        }
      >
        <div className="w-full">
            <h2 className="text-2xl font-normal text-gray-800 text-center mb-8">添加服务站</h2>
            
            <div className="max-w-[810px] mx-auto">
                <HorizontalInputGroup label="服务站名称" required>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} disabled={isReadOnly} className="w-full h-[40px] border border-gray-300 rounded px-3 text-sm outline-none focus:border-blue-400 transition-colors text-gray-700" placeholder="服务站名称" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="服务站账号" required>
                    <input type="text" value={account} onChange={e => setAccount(e.target.value)} disabled={isReadOnly} className="w-full h-[40px] border border-gray-300 rounded px-3 text-sm outline-none focus:border-blue-400 transition-colors text-gray-700" placeholder="请输入服务站账号（登录手机号）" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="服务站密码" required>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={isReadOnly} className="w-full h-[40px] border border-gray-300 rounded px-3 text-sm outline-none focus:border-blue-400 transition-colors text-gray-700" placeholder="请输入服务站密码" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="服务站联系电话" required>
                    <input type="text" value={contact} onChange={e => setContact(e.target.value)} disabled={isReadOnly} className="w-full h-[40px] border border-gray-300 rounded px-3 text-sm outline-none focus:border-blue-400 transition-colors text-gray-700" placeholder="请输入服务站联系电话" />
                </HorizontalInputGroup>

                <HorizontalInputGroup label="营业时间">
                    <div className="flex items-center w-full h-[40px] border border-gray-300 rounded px-3 bg-white hover:border-gray-400 transition-colors group">
                        <Clock className="w-4 h-4 text-gray-400 mr-2 group-hover:text-gray-500" />
                        <input 
                            type="text" 
                            value={businessHoursStart} 
                            onChange={e => setBusinessHoursStart(e.target.value)} 
                            disabled={isReadOnly} 
                            className="w-16 text-center text-sm outline-none text-gray-700" 
                            placeholder="00:00"
                        />
                        <span className="mx-2 text-gray-500">至</span>
                        <input 
                            type="text" 
                            value={businessHoursEnd} 
                            onChange={e => setBusinessHoursEnd(e.target.value)} 
                            disabled={isReadOnly} 
                            className="w-16 text-center text-sm outline-none text-gray-700" 
                            placeholder="23:59"
                        />
                        <X className="w-4 h-4 text-gray-400 ml-auto cursor-pointer hover:text-gray-600" />
                    </div>
                </HorizontalInputGroup>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <HorizontalInputGroup label="所属合伙人" required>
                            <div className="relative w-full">
                                <select value={partnerName} onChange={e => setPartnerName(e.target.value)} disabled={isReadOnly} className="w-full h-[40px] border border-gray-300 rounded px-3 text-sm outline-none focus:border-blue-400 appearance-none bg-white text-gray-700">
                                    <option value="">请选择所属合伙人</option>
                                    {MOCK_PARTNERS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </HorizontalInputGroup>
                    </div>
                    <div className="flex-1">
                        <HorizontalInputGroup label="服务商" required>
                            <div className="relative w-full">
                                <select value={serviceProvider} onChange={e => setServiceProvider(e.target.value)} disabled className="w-full h-[40px] border border-gray-300 rounded px-3 text-sm outline-none focus:border-blue-400 appearance-none bg-gray-100 text-gray-500 cursor-not-allowed">
                                    <option>请选择</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </HorizontalInputGroup>
                    </div>
                </div>

                <div className="w-full h-[500px] bg-gray-100 mb-6 relative border border-gray-200 rounded overflow-hidden flex items-center justify-center">
                    <img src="https://apis.map.qq.com/api/staticmap?size=810*500&center=39.916527,116.397128&zoom=10" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Map Placeholder" />
                    <div className="absolute z-10 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center">
                        <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">地图选点区域</p>
                    </div>
                    {/* Zoom Controls Mock */}
                    <div className="absolute bottom-8 right-8 flex flex-col bg-white rounded shadow border border-gray-300">
                        <button className="p-2 hover:bg-gray-100 border-b border-gray-300 text-gray-600 font-bold">+</button>
                        <button className="p-2 hover:bg-gray-100 text-gray-600 font-bold">-</button>
                    </div>
                    {/* Scale Mock */}
                    <div className="absolute bottom-2 left-2 bg-white/70 px-2 py-1 text-xs text-gray-600 rounded">
                        1 公里
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <HorizontalInputGroup label="公司" required>
                            <div className="relative w-full">
                                <select value={company} onChange={e => setCompany(e.target.value)} disabled={isReadOnly} className="w-full h-[40px] border border-gray-300 rounded px-3 text-sm outline-none focus:border-blue-400 appearance-none bg-white text-gray-700">
                                    <option value="请选择">请选择</option>
                                    {MOCK_PROPERTIES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </HorizontalInputGroup>
                    </div>
                    <div className="flex-1">
                        <HorizontalInputGroup label="所在区域" required>
                            <div className="relative w-full">
                                <div className="w-full h-[40px] border border-gray-300 rounded px-3 text-sm flex items-center justify-between cursor-pointer hover:border-blue-400 group">
                                    <span className={region ? "text-gray-700" : "text-gray-400"}>{region || "省/市/区"}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                                </div>
                            </div>
                        </HorizontalInputGroup>
                    </div>
                </div>

                <HorizontalInputGroup label="小区地址" required>
                    <div className="relative w-full">
                        <input type="text" value={street} onChange={e => setStreet(e.target.value)} disabled={isReadOnly} className="w-full h-[40px] border border-gray-300 rounded pl-10 pr-3 text-sm outline-none focus:border-blue-400 transition-colors text-gray-700" placeholder="请输入小区地址" />
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                </HorizontalInputGroup>

                <HorizontalInputGroup label="详细地址" required>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} disabled={isReadOnly} className="w-full h-[40px] border border-gray-300 rounded px-3 text-sm outline-none focus:border-blue-400 transition-colors text-gray-700" placeholder="请输入详细地址" />
                </HorizontalInputGroup>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <HorizontalInputGroup label="派费支付人类型" required>
                            <div className="relative w-full">
                                <select value={deliveryPayer} onChange={e => setDeliveryPayer(e.target.value)} disabled={isReadOnly} className="w-full h-[40px] border border-gray-300 rounded px-3 text-sm outline-none focus:border-blue-400 appearance-none bg-white text-gray-700">
                                    <option>请选择</option>
                                    {PAYER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </HorizontalInputGroup>
                    </div>
                    <div className="flex-1">
                        <HorizontalInputGroup label="短信支付人类型" required>
                            <div className="relative w-full">
                                <select value={smsPayer} onChange={e => setSmsPayer(e.target.value)} disabled={isReadOnly} className="w-full h-[40px] border border-gray-300 rounded px-3 text-sm outline-none focus:border-blue-400 appearance-none bg-white text-gray-700">
                                    <option>请选择</option>
                                    {PAYER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </HorizontalInputGroup>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="flex items-center mb-5">
                            <label className="w-[200px] text-right text-sm text-gray-600 pr-3 leading-[40px] shrink-0 font-medium">
                                启用寄件功能：
                            </label>
                            <div className="flex-1 flex items-center h-[40px]">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={enableSend} onChange={e => setEnableSend(e.target.checked)} className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center mb-5">
                            <label className="w-[200px] text-right text-sm text-gray-600 pr-3 leading-[40px] shrink-0 font-medium">
                                匹配客户手机：
                            </label>
                            <div className="flex-1 flex items-center h-[40px]">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={matchCustomer} onChange={e => setMatchCustomer(e.target.checked)} className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </GenericModal>
    );
};

// StationConfigModal
export const StationConfigModal = ({ isOpen, onClose, initialTab = 'brand' }: { isOpen: boolean, onClose: () => void, initialTab?: 'brand' | 'staff' }) => {
    const [activeTab, setActiveTab] = useState<'brand' | 'staff'>(initialTab);
    const [staffList, setStaffList] = useState(MOCK_STATION_STAFF);
    const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

    // New Staff State
    const [newStaffName, setNewStaffName] = useState('');
    const [newStaffPhone, setNewStaffPhone] = useState('');
    const [newStaffRole, setNewStaffRole] = useState<'operator' | 'courier'>('operator');
    const [newStaffPwd, setNewStaffPwd] = useState('123456a');
    
    // Wallet State for Courier
    const [walletType, setWalletType] = useState('personal');
    const [walletName, setWalletName] = useState('');
    const [walletId, setWalletId] = useState('');

    // Initial Brand Data based on the HTML provided
    const [brandConfigs, setBrandConfigs] = useState(() => {
        return [
            { name: '极兔速递（JTSD）', phone: '-', balance: '0.00', deliveryFee: '1', settlementPrice: '1', proxySign: true, platformSplit: '2' },
            { name: '圆通速递（YTO）', phone: '-', balance: '0.00', deliveryFee: '0.00', settlementPrice: '0.00', proxySign: true, platformSplit: '0.00' },
            { name: '申通快递（STO）', phone: '-', balance: '0.00', deliveryFee: '0.00', settlementPrice: '0.00', proxySign: true, platformSplit: '0.00' },
            { name: '中通（ZTO）', phone: '-', balance: '0.00', deliveryFee: '0.00', settlementPrice: '0.00', proxySign: true, platformSplit: '0.00' },
            { name: '德邦（DBL）', phone: '-', balance: '0.00', deliveryFee: '0.00', settlementPrice: '0.00', proxySign: false, platformSplit: '0.00' },
            { name: '韵达速递（YD）', phone: '-', balance: '0.00', deliveryFee: '0.00', settlementPrice: '0.00', proxySign: true, platformSplit: '0.00' },
            { name: '中国邮政（EMS）', phone: '-', balance: '0.00', deliveryFee: '0.00', settlementPrice: '0.00', proxySign: false, platformSplit: '0.00' },
            { name: '京东（JD）', phone: '-', balance: '0.00', deliveryFee: '0.00', settlementPrice: '0.00', proxySign: false, platformSplit: '0.00' },
            { name: '顺丰（SF）', phone: '-', balance: '0.00', deliveryFee: '0.00', settlementPrice: '0.00', proxySign: false, platformSplit: '0.00' },
        ];
    });

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    const handleAddStaff = () => {
        if (!newStaffName || !newStaffPhone) {
            alert("请完善员工信息");
            return;
        }

        const newStaff: StationStaff = {
            id: `st_${Date.now()}`,
            name: newStaffName,
            phone: newStaffPhone,
            role: newStaffRole,
            createTime: new Date().toISOString().split('T')[0]
        };
        setStaffList([...staffList, newStaff]);
        
        if (newStaffRole === 'courier') {
            const newSystemUser: SystemUser & { password?: string } = {
                id: newStaff.id,
                username: newStaffPhone,
                phone: newStaffPhone,
                roleName: '派送员',
                status: 'active',
                createTime: newStaff.createTime,
                organization: '驿站',
                walletId: walletId || newStaffPhone,
                walletName: walletName || `${newStaffName}的钱包`,
                walletType: walletType as any,
                walletBalance: 0,
                password: newStaffPwd
            };
            MOCK_SYSTEM_USERS.push(newSystemUser);
            alert(`员工添加成功！已自动创建派送员账号：${newStaffPhone}，密码：${newStaffPwd}，钱包ID：${newSystemUser.walletId}`);
        } else {
            alert('员工添加成功！');
        }
        
        setNewStaffName('');
        setNewStaffPhone('');
        setIsAddStaffOpen(false);
    }

    const toggleProxySign = (index: number) => {
        const newConfigs = [...brandConfigs];
        newConfigs[index].proxySign = !newConfigs[index].proxySign;
        setBrandConfigs(newConfigs);
    };

    return (
        <GenericModal isOpen={isOpen} onClose={onClose} title="服务站配置管理" size="xl">
            <div className="flex border-b mb-4">
                <button 
                    onClick={() => setActiveTab('brand')} 
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'brand' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                >
                    快递公司
                </button>
                <button 
                    onClick={() => setActiveTab('staff')} 
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'staff' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                >
                    人员管理
                </button>
            </div>

            <div className="h-96 overflow-y-auto custom-scrollbar">
                {activeTab === 'brand' && (
                    <div className="overflow-x-auto rounded border border-gray-200 animate-fade-in">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold text-xs sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 text-center whitespace-nowrap bg-gray-50 border-b border-gray-200">快递品牌</th>
                                    <th className="p-3 text-center whitespace-nowrap bg-gray-50 border-b border-gray-200">快递员手机号</th>
                                    <th className="p-3 text-center whitespace-nowrap bg-gray-50 border-b border-gray-200">快递员余额（元）</th>
                                    <th className="p-3 text-center whitespace-nowrap bg-gray-50 border-b border-gray-200">派费价格（元）</th>
                                    <th className="p-3 text-center whitespace-nowrap bg-gray-50 border-b border-gray-200">结算价格（元）</th>
                                    <th className="p-3 text-center whitespace-nowrap bg-gray-50 border-b border-gray-200">开启代签收</th>
                                    <th className="p-3 text-center whitespace-nowrap bg-gray-50 border-b border-gray-200">平台分账(元/票)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {brandConfigs.map((brand, index) => (
                                    <tr key={brand.name} className="hover:bg-gray-50 h-[60px]">
                                        <td className="p-3 text-center border-r border-gray-100 last:border-r-0">
                                            {brand.name}
                                        </td>
                                        <td className="p-3 text-center text-gray-500 border-r border-gray-100 last:border-r-0">
                                            {brand.phone}
                                        </td>
                                        <td className="p-3 text-center text-gray-500 border-r border-gray-100 last:border-r-0">
                                            {brand.balance}
                                        </td>
                                        <td className="p-3 text-center border-r border-gray-100 last:border-r-0">
                                            <span className="text-gray-900 cursor-pointer">{brand.deliveryFee}</span>
                                        </td>
                                        <td className="p-3 text-center border-r border-gray-100 last:border-r-0">
                                            <span className="text-gray-900 cursor-pointer">{brand.settlementPrice}</span>
                                        </td>
                                        <td className="p-3 text-center border-r border-gray-100 last:border-r-0">
                                            <div className="flex justify-center">
                                                <div 
                                                    onClick={() => toggleProxySign(index)}
                                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${brand.proxySign ? 'bg-blue-500' : 'bg-red-500'}`}
                                                >
                                                    <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${brand.proxySign ? 'translate-x-5' : ''}`}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center border-r border-gray-100 last:border-r-0">
                                            <span className="text-gray-900 cursor-pointer underline hover:text-blue-600">{brand.platformSplit}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'staff' && (
                    <div className="space-y-3 animate-fade-in">
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setIsAddStaffOpen(true)}
                                className="text-xs flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                            >
                                <Plus className="w-3 h-3" /> 添加员工
                            </button>
                        </div>
                        
                        {isAddStaffOpen && (
                            <div className="bg-gray-50 p-3 rounded border border-blue-100 mb-3 animate-fade-in-down">
                                <div className="space-y-2">
                                    <input type="text" placeholder="员工姓名" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} className="w-full border rounded p-1.5 text-sm" />
                                    <input type="text" placeholder="手机号码" value={newStaffPhone} onChange={e => {
                                        setNewStaffPhone(e.target.value);
                                        setWalletId(e.target.value); // Sync wallet id
                                        setWalletName(newStaffName ? `${newStaffName}的钱包` : '');
                                    }} className="w-full border rounded p-1.5 text-sm" />
                                    <select value={newStaffRole} onChange={e => setNewStaffRole(e.target.value as any)} className="w-full border rounded p-1.5 text-sm">
                                        <option value="operator">操作员</option>
                                        <option value="courier">派送员</option>
                                    </select>
                                    
                                    {newStaffRole === 'courier' && (
                                        <>
                                            <input type="text" placeholder="设置登录密码" value={newStaffPwd} onChange={e => setNewStaffPwd(e.target.value)} className="w-full border rounded p-1.5 text-sm" />
                                            <div className="mt-2">
                                                <WalletConfigSection 
                                                    title="派送员资金钱包配置 (必填)"
                                                    walletType={walletType} setWalletType={setWalletType}
                                                    walletName={walletName} setWalletName={setWalletName}
                                                    walletId={walletId} setWalletId={setWalletId}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={() => setIsAddStaffOpen(false)} className="text-xs text-gray-500">取消</button>
                                        <button onClick={handleAddStaff} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">确认添加</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {staffList.map(staff => (
                            <div key={staff.id} className="flex items-center justify-between p-3 border rounded bg-white">
                                <div>
                                    <p className="font-bold text-sm">{staff.name}</p>
                                    <p className="text-xs text-gray-500">{staff.phone} · {staff.role === 'operator' ? '操作员' : '派送员'}</p>
                                </div>
                                <button className="text-red-500 hover:bg-red-50 p-1 rounded">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </GenericModal>
    );
};

export const AuditModal = ({ isOpen, onClose, data, onApprove, onReject, isReadOnly: propIsReadOnly }: any) => {
    const isReadOnly = propIsReadOnly || data?.status === 'approved' || data?.status === 'rejected';

    return (
        <GenericModal 
          isOpen={isOpen} 
          onClose={onClose} 
          title={isReadOnly ? "审核详情" : "服务站注册审核"}
          size="lg"
          footer={
            isReadOnly ? (
                <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700">关闭</button>
            ) : (
                <>
                  <button onClick={() => onReject(data?.id)} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100">驳回</button>
                  <button onClick={() => onApprove(data?.id)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">审核通过</button>
                </>
            )
          }
        >
          {data && (
             <div className="space-y-6">
                 <div className="bg-gray-50 p-4 rounded-lg">
                     <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">基础申请信息</h4>
                     <div className="grid grid-cols-2 gap-y-2 text-sm">
                         <p><span className="text-gray-500">服务站名称:</span> {data.stationName}</p>
                         <p><span className="text-gray-500">服务站账号:</span> {data.account}</p>
                         <p><span className="text-gray-500">服务站密码:</span> {data.password || '******'}</p>
                         <p><span className="text-gray-500">联系电话:</span> {data.phone}</p>
                         <p><span className="text-gray-500">营业时间:</span> {data.businessHours || '09:00-18:00'}</p>
                         <p><span className="text-gray-500">所在区域:</span> {data.region}</p>
                         <p><span className="text-gray-500">小区地址:</span> {data.community || '-'}</p>
                         <p className="col-span-2"><span className="text-gray-500">详细地址:</span> {data.address}</p>
                         <p className="col-span-2"><span className="text-gray-500">申请时间:</span> {data.applyTime}</p>
                     </div>
                 </div>

                 <div>
                     <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">关联信息</h4>
                     <div className="grid grid-cols-2 gap-y-2 text-sm">
                         <p><span className="text-gray-500">所属合伙人:</span> {data.partnerName || '-'}</p>
                         <p><span className="text-gray-500">所属服务商:</span> {data.providerName || '-'}</p>
                         <p><span className="text-gray-500">物业公司:</span> {data.propertyName || '-'}</p>
                     </div>
                 </div>

                 <div>
                     <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">支付设置</h4>
                     <div className="grid grid-cols-2 gap-y-2 text-sm">
                         <p><span className="text-gray-500">派费支付人:</span> {data.deliveryPayer || '-'}</p>
                         <p><span className="text-gray-500">短信支付人:</span> {data.smsPayer || '-'}</p>
                     </div>
                 </div>
                 
                 {/* ID Photos Mock */}
                 <div>
                     <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">证件照片</h4>
                     <div className="flex gap-4">
                         <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                             身份证正面
                         </div>
                         <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                             身份证反面
                         </div>
                         <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                             营业执照
                         </div>
                     </div>
                 </div>
             </div>
          )}
        </GenericModal>
    );
};

export const PartnerAuditModal = ({ isOpen, onClose, data, onApprove, onReject, isReadOnly }: any) => {
    return (
        <GenericModal 
          isOpen={isOpen} 
          onClose={onClose} 
          title="合伙人入驻审核"
          size="md"
          footer={
            isReadOnly || data?.status !== 'pending' ? (
                <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">关闭</button>
            ) : (
                <>
                  <button onClick={() => onReject(data?.id)} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100">驳回</button>
                  <button onClick={() => onApprove(data?.id)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">通过</button>
                </>
            )
          }
        >
          {data && (
             <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4 text-sm">
                     <p><span className="text-gray-500 block mb-1">合伙人名称</span> {data.partnerName}</p>
                     <p><span className="text-gray-500 block mb-1">联系人</span> {data.contactPerson}</p>
                     <p><span className="text-gray-500 block mb-1">联系电话</span> {data.phone}</p>
                     <p><span className="text-gray-500 block mb-1">申请时间</span> {data.applyTime}</p>
                 </div>
                 <div className="bg-blue-50 p-3 rounded text-xs text-blue-700">
                     提示：请核对合伙人营业执照及资质文件（此处为模拟）。
                 </div>
             </div>
          )}
        </GenericModal>
    );
};

// Property Audit Modal (New)
export const PropertyAuditModal = ({ isOpen, onClose, data, onApprove, onReject, isReadOnly }: any) => {
    return (
        <GenericModal 
          isOpen={isOpen} 
          onClose={onClose} 
          title="物业公司入驻审核"
          size="md"
          footer={
            isReadOnly || data?.status !== 'pending' ? (
                <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">关闭</button>
            ) : (
                <>
                  <button onClick={() => onReject(data?.id)} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100">驳回</button>
                  <button onClick={() => onApprove(data?.id)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">通过</button>
                </>
            )
          }
        >
          {data && (
             <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4 text-sm">
                     <p className="col-span-2"><span className="text-gray-500 block mb-1">物业公司名称</span> {data.name}</p>
                     <p><span className="text-gray-500 block mb-1">联系人</span> {data.contact}</p>
                     <p><span className="text-gray-500 block mb-1">联系电话</span> {data.phone}</p>
                     <p className="col-span-2"><span className="text-gray-500 block mb-1">所在区域</span> {data.region}</p>
                     <p className="col-span-2"><span className="text-gray-500 block mb-1">提交服务商</span> {data.providerName}</p>
                     <p><span className="text-gray-500 block mb-1">申请时间</span> {data.applyTime}</p>
                 </div>
             </div>
          )}
        </GenericModal>
    );
};

export const TicketModal = ({ isOpen, onClose, initialData, onSubmit }: { isOpen: boolean, onClose: () => void, initialData?: Ticket, onSubmit: (data: any) => void }) => {
    const [type, setType] = useState('system');
    const [desc, setDesc] = useState('');
    const [station, setStation] = useState('');

    useEffect(() => {
        if(isOpen) {
            setType(initialData?.type || 'system');
            setDesc(initialData?.description || '');
            setStation(initialData?.stationName || '');
        }
    }, [isOpen, initialData]);

    const handleSubmit = () => {
        onSubmit({ type, description: desc, stationName: station, initiator: '当前用户' });
        onClose();
    }

    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={initialData ? "处理工单" : "发起工单"}
            footer={
                <>
                  <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">取消</button>
                  <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{initialData ? '标记为已解决' : '提交'}</button>
                </>
            }
        >
            <div className="space-y-4">
                {!initialData && (
                    <InputGroup label="工单类型" required>
                        <select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded p-2">
                            <option value="system">系统问题</option>
                            <option value="business">业务咨询</option>
                            <option value="complaint">投诉建议</option>
                        </select>
                    </InputGroup>
                )}
                <InputGroup label="关联服务站">
                    <input type="text" value={station} onChange={e => setStation(e.target.value)} className="w-full border rounded p-2" disabled={!!initialData} />
                </InputGroup>
                <InputGroup label="问题描述" required>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full border rounded p-2 h-24" disabled={!!initialData}></textarea>
                </InputGroup>
                {initialData && (
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                        <p>提交时间: {initialData.createTime}</p>
                        <p>提交人: {initialData.initiator}</p>
                    </div>
                )}
            </div>
        </GenericModal>
    )
}

export const TraceModal = ({ isOpen, onClose, trackingNo }: { isOpen: boolean, onClose: () => void, trackingNo: string }) => {
    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="包裹轨迹详情"
            size="md"
            footer={<button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">关闭</button>}
        >
            <div className="mb-4 font-mono text-sm bg-gray-100 p-2 rounded">
                运单号: <span className="font-bold text-gray-800">{trackingNo}</span>
            </div>
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-2">
                {MOCK_TRACES.map((trace, idx) => (
                    <div key={idx} className="ml-6 relative">
                        <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white ${idx === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                        <p className="text-xs text-gray-500 mb-1">{trace.time}</p>
                        <h4 className={`text-sm font-bold ${idx === 0 ? 'text-blue-600' : 'text-gray-700'}`}>{trace.status}</h4>
                        <p className="text-sm text-gray-600 mt-1">{trace.description}</p>
                    </div>
                ))}
            </div>
        </GenericModal>
    );
};

export const ManualTransactionModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="人工资金调节"
            footer={
                <>
                  <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">取消</button>
                  <button onClick={() => { alert('调节成功'); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">确认调节</button>
                </>
            }
        >
            <div className="space-y-4">
                <InputGroup label="调节对象" required>
                    <select className="w-full border rounded p-2">
                        <option>选择服务站/快递员</option>
                        {MOCK_STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </InputGroup>
                <InputGroup label="调节类型" required>
                    <select className="w-full border rounded p-2">
                        <option value="add">充值 (增加余额)</option>
                        <option value="sub">扣款 (减少余额)</option>
                    </select>
                </InputGroup>
                <InputGroup label="金额" required>
                    <input type="number" className="w-full border rounded p-2" placeholder="0.00" />
                </InputGroup>
                <InputGroup label="备注说明" required>
                    <textarea className="w-full border rounded p-2 h-20" placeholder="请输入调节原因"></textarea>
                </InputGroup>
            </div>
        </GenericModal>
    );
};

export const BillDetailModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const details = MOCK_BILL_DETAILS;
    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="账单明细"
            size="lg"
            footer={<button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">关闭</button>}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold">
                        <tr>
                            <th className="p-3">业务单号</th>
                            <th className="p-3">时间</th>
                            <th className="p-3">费用类型</th>
                            <th className="p-3 text-right">金额</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {details.map(d => (
                            <tr key={d.id}>
                                <td className="p-3 font-mono">{d.orderNo}</td>
                                <td className="p-3">{d.time}</td>
                                <td className="p-3">{d.type}</td>
                                <td className={`p-3 text-right font-bold ${d.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{d.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GenericModal>
    );
};

export const RoleModal = ({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: SystemRole }) => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    
    useEffect(() => {
        if(isOpen) {
            setName(initialData?.name || '');
            setDesc(initialData?.description || '');
        }
    }, [isOpen, initialData]);

    const renderTree = (nodes: PermissionNode[], level = 0) => {
        return nodes.map(node => (
            <div key={node.key} className="mb-2">
                <div className={`flex items-center gap-2 py-1 ${level === 0 ? 'font-bold text-gray-800 bg-gray-50 px-2 rounded' : 'ml-6'}`}>
                    <input type="checkbox" className="rounded text-blue-600" defaultChecked={true} />
                    <span>{node.label}</span>
                    {node.type === 'button' && <span className="text-xs bg-gray-200 text-gray-600 px-1.5 rounded">按钮</span>}
                </div>
                {node.children && renderTree(node.children, level + 1)}
            </div>
        ));
    };

    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={initialData ? "编辑角色权限" : "新增角色"}
            size="lg"
            footer={
                <>
                  <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">取消</button>
                  <button onClick={() => { alert('保存成功'); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">保存配置</button>
                </>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
                <div className="space-y-4">
                    <InputGroup label="角色名称" required>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-2" placeholder="请输入角色名称" />
                    </InputGroup>
                    <InputGroup label="角色描述">
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full border rounded p-2 h-32" placeholder="请输入角色描述"></textarea>
                    </InputGroup>
                </div>
                <div className="border rounded-lg p-4 overflow-y-auto bg-white h-full">
                    <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" /> 权限配置
                    </h4>
                    {renderTree(PERMISSION_TREE)}
                </div>
            </div>
        </GenericModal>
    );
};

export const UserModal = ({ isOpen, onClose, initialData, currentUserRole, currentUserOrg }: { isOpen: boolean, onClose: () => void, initialData?: SystemUser, currentUserRole?: Role, currentUserOrg?: string }) => {
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [org, setOrg] = useState('');
    
    // Wallet State (New)
    const [walletType, setWalletType] = useState('personal');
    const [walletName, setWalletName] = useState('');
    const [walletId, setWalletId] = useState('');
    const [password, setPassword] = useState('123456a');

    useEffect(() => {
        if(isOpen) {
            setUsername(initialData?.username || '');
            setPhone(initialData?.phone || '');
            setRole(initialData?.roleName || ROLES_OPTIONS[0]);
            
            // Logic: If creating new user and not admin, default to current org. Otherwise load existing.
            if (!initialData && currentUserOrg && currentUserRole !== Role.KUAIJIN) {
                setOrg(currentUserOrg);
            } else {
                setOrg(initialData?.organization || '');
            }

            // Load existing wallet info if available, else defaults
            setWalletName(initialData?.walletName || '');
            setWalletId(initialData?.walletId || '');
            setWalletType(initialData?.walletType || 'personal');
        }
    }, [isOpen, initialData, currentUserOrg, currentUserRole]);

    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={initialData ? "编辑用户" : "新增用户"}
            size="md"
            footer={
                <>
                  <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">取消</button>
                  <button onClick={() => { alert('保存成功'); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">保存</button>
                </>
            }
        >
            <div className="space-y-4">
                <InputGroup label="用户名" required>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border rounded p-2" disabled={!!initialData} />
                </InputGroup>
                <InputGroup label="手机号码" required>
                    <input 
                        type="text" 
                        value={phone} 
                        onChange={e => {
                            setPhone(e.target.value);
                            // Auto-sync wallet ID for new users
                            if(!initialData) setWalletId(e.target.value);
                        }} 
                        className="w-full border rounded p-2" 
                    />
                </InputGroup>
                <InputGroup label="归属组织">
                    <input 
                        type="text" 
                        value={org} 
                        onChange={e => setOrg(e.target.value)} 
                        className={`w-full border rounded p-2 ${currentUserRole !== Role.KUAIJIN && currentUserRole !== undefined ? 'bg-gray-100 text-gray-500' : ''}`} 
                        placeholder="如：杭州顺达服务商" 
                        disabled={currentUserRole !== Role.KUAIJIN && currentUserRole !== undefined && !initialData}
                    />
                </InputGroup>
                <InputGroup label="系统角色" required>
                    <select value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded p-2 bg-white">
                        {ROLES_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </InputGroup>
                
                {/* Wallet Configuration Section */}
                <div className="pt-2 border-t border-gray-100 mt-4">
                    <WalletConfigSection 
                        title="关联资金钱包"
                        walletType={walletType} setWalletType={setWalletType}
                        walletName={walletName} setWalletName={setWalletName}
                        walletId={walletId} setWalletId={setWalletId}
                        // Only for new user creation inside this modal (simplified, no recursion)
                    />
                </div>
            </div>
        </GenericModal>
    );
};

export const SplitConfigModal = ({ isOpen, onClose, config, onUpdate }: { isOpen: boolean, onClose: () => void, config: SplitConfig | null, onUpdate: (c: SplitConfig) => void }) => {
    const [ratio, setRatio] = useState(0);
    const [providerRatio, setProviderRatio] = useState(0); // New State

    useEffect(() => {
        if(config) {
            setRatio(config.ratio);
            setProviderRatio(config.providerRatio || 0); // Init
        }
    }, [config]);

    const handleSave = () => {
        if (config) {
            onUpdate({ ...config, ratio, providerRatio });
            onClose();
        }
    };

    return (
        <GenericModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="调整分账比例" 
            size="sm"
            footer={
                <>
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">取消</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">保存</button>
                </>
            }
        >
            {config && (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded text-sm mb-4">
                        <p><span className="text-gray-500">分账主体:</span> <span className="font-bold">{config.entityName}</span></p>
                        <p><span className="text-gray-500">钱包账户:</span> <span className="font-mono">{config.walletAccount}</span></p>
                        {config.entityType === 'property' && (
                             <p className="mt-1 text-xs text-orange-600 flex items-center gap-1">
                                 <AlertTriangle className="w-3 h-3" />
                                 物业公司分润 + 服务商分润 ≤ 总分润上限
                             </p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {config.entityType === 'property' ? '物业公司分润比例 (%)' : '分账比例 (%)'}
                        </label>
                        <input 
                            type="number" 
                            value={ratio} 
                            onChange={e => setRatio(Number(e.target.value))} 
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600"
                            min="0"
                            max="100"
                            step="0.1"
                        />
                    </div>

                    {config.entityType === 'property' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                服务商分润比例 (%)
                            </label>
                            <input 
                                type="number" 
                                value={providerRatio} 
                                onChange={e => setProviderRatio(Number(e.target.value))} 
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-orange-600"
                                min="0"
                                max="100"
                                step="0.1"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                * 此比例归属于该物业的上级服务商
                            </p>
                        </div>
                    )}
                </div>
            )}
        </GenericModal>
    );
};