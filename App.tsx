
import React, { useState, useEffect, useRef } from 'react';
import { 
  MENU_ITEMS, MOCK_USER, MOCK_NOTIFICATIONS,
  MOCK_PARTNERS, MOCK_STATIONS, MOCK_PARCELS 
} from './constants';
import { Role, User, Notification } from './types';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { ChangePasswordModal } from './components/ActionModals';
import { NotificationCenter } from './components/NotificationCenter';
import { 
  PartnerManager, 
  StationManager, 
  AuditManager, 
  ParcelManager,
  ArchiveManager,
  FinanceTransactionManager,
  FinanceBillManager,
  ReportManager,
  TicketManager,
  PaymentManager,
  SystemRoleManager,
  SystemUserManager,
  PropertyManager,
  HelpCenterManager,
  ServiceProviderManager,
  SplitBillManager
} from './components/ModuleViews';
import { 
  Menu, 
  ChevronDown, 
  Search, 
  LogOut, 
  User as UserIcon,
  ChevronRight,
  Layout,
  Lock,
  Command,
  Box,
  Store,
  Users,
  FileText,
  MapPin,
  X,
  BookOpen
} from 'lucide-react';

// 搜索结果类型定义
interface SearchResult {
  id: string;
  type: 'menu' | 'parcel' | 'station' | 'partner';
  title: string;
  subtitle: string;
  link: string; // 路由Hash
  icon: any;
}

const App = () => {
  // 全局登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 状态管理：当前激活菜单、当前用户信息、侧边栏展开状态、展开的子菜单ID列表
  const [activeMenuId, setActiveMenuId] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['provider', 'data', 'audit', 'express', 'finance', 'system', 'help']);
  
  // 顶部导航栏状态
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  
  // 全局搜索状态
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 通知中心状态
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // 使用 URL Hash 路由机制实现简单的单页导航
  // 监听 'hashchange' 事件来切换 activeMenuId
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'dashboard';
      setActiveMenuId(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 初始加载时执行一次
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 点击外部关闭搜索下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 切换子菜单展开/收起状态
  const toggleMenu = (menuId: string) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter(id => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };

  // 实时执行搜索逻辑
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const term = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // 1. 搜索菜单 (Menus)
    MENU_ITEMS.forEach(item => {
      if (item.roles.includes(currentUser.role)) {
        if (item.label.toLowerCase().includes(term)) {
           results.push({ id: item.id, type: 'menu', title: item.label, subtitle: '功能菜单', link: item.id, icon: Layout });
        }
        if (item.children) {
          item.children.forEach(child => {
            if (child.label.toLowerCase().includes(term) && child.roles.includes(currentUser.role)) {
               results.push({ id: child.id, type: 'menu', title: child.label, subtitle: `功能菜单 > ${item.label}`, link: child.id, icon: Layout });
            }
          });
        }
      }
    });

    // 2. 搜索包裹 (Parcels) - 匹配运单号或取件码
    MOCK_PARCELS.forEach(p => {
      if (p.id.toLowerCase().includes(term) || p.pickupCode.toLowerCase().includes(term)) {
        results.push({ 
          id: p.id, 
          type: 'parcel', 
          title: `运单号: ${p.id}`, 
          subtitle: `取件码: ${p.pickupCode} | 状态: ${p.status}`, 
          link: 'express-package', 
          icon: Box 
        });
      }
    });

    // 4. 搜索服务站 (Stations)
    MOCK_STATIONS.forEach(s => {
      if (s.name.toLowerCase().includes(term) || s.account.toLowerCase().includes(term)) {
        results.push({
          id: s.id,
          type: 'station',
          title: s.name,
          subtitle: `账号: ${s.account} | 区域: ${s.region}`,
          link: 'station',
          icon: Store
        });
      }
    });

    // 5. 搜索合伙人 (Partners) - 仅服务商和快金可见
    if (currentUser.role === Role.PROVIDER || currentUser.role === Role.KUAIJIN) {
      MOCK_PARTNERS.forEach(p => {
        if (p.name.toLowerCase().includes(term) || p.contactPerson.toLowerCase().includes(term)) {
          results.push({
            id: p.id,
            type: 'partner',
            title: p.name,
            subtitle: `负责人: ${p.contactPerson} | 电话: ${p.phone}`,
            link: 'partner-list',
            icon: Users
          });
        }
      });
    }

    setSearchResults(results);
    setIsSearchOpen(true);
  }, [searchQuery, currentUser.role]);

  // 处理搜索结果点击
  const handleResultClick = (result: SearchResult) => {
    window.location.hash = result.link;
    setIsSearchOpen(false);
    setSearchQuery(''); // 可选：清空搜索框
    // 这里可以添加逻辑：如果跳转到列表页，自动将 search term 填入过滤框 (需结合 Context 实现，此处仅跳转)
  };

  // 通知处理函数
  const handleMarkAsRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearNotifications = () => {
      setNotifications([]);
  };

  const handleRemoveNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // 添加新通知
  const handleAddNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      const newNotification: Notification = {
          id: `n_${Date.now()}`,
          title,
          message,
          type,
          isRead: false,
          createTime: '刚刚'
      };
      setNotifications(prev => [newNotification, ...prev]);
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setIsUserDropdownOpen(false);
      window.location.hash = '';
  };

  // 路由分发器：根据 activeMenuId 渲染对应的业务组件
  const renderContent = () => {
    const roleProps = { 
        userRole: currentUser.role,
        userName: currentUser.name,
        userOrg: currentUser.organization,
        onNotify: handleAddNotification 
    }; 

    switch (activeMenuId) {
        // 首页
        case 'dashboard': return <Dashboard userRole={currentUser.role} />;
        
        // 数据管理 - 报表
        case 'data-reports': return <ReportManager {...roleProps} />;
        
        // 服务商管理 (仅快金)
        case 'provider-list': return <ServiceProviderManager {...roleProps} />;

        // 合伙人管理
        case 'partner-list': return <PartnerManager {...roleProps} />;
        
        // 物业公司管理
        case 'property': return <PropertyManager {...roleProps} />;

        // 审核管理
        case 'audit-station-action': return <AuditManager {...roleProps} subModule="station" mode="action" />;
        case 'audit-station-query': return <AuditManager {...roleProps} subModule="station" mode="query" />;
        
        case 'audit-partner-action': return <AuditManager {...roleProps} subModule="partner" mode="action" />;
        case 'audit-partner-query': return <AuditManager {...roleProps} subModule="partner" mode="query" />;
        
        case 'audit-property-action': return <AuditManager {...roleProps} subModule="property" mode="action" />;
        case 'audit-property-query': return <AuditManager {...roleProps} subModule="property" mode="query" />;
        
        // 服务站管理
        case 'station': return <StationManager {...roleProps} />;
        
        // 工单管理
        case 'ticket': return <TicketManager {...roleProps} />;
        
        // 快递管理 (包裹/归档)
        case 'express-package': return <ParcelManager {...roleProps} />;
        case 'express-archive': return <ArchiveManager {...roleProps} />;
        
        // 财务管理
        case 'finance-trans': return <FinanceTransactionManager {...roleProps} />;
        case 'finance-bill': return <FinanceBillManager {...roleProps} />;
        case 'split-settings': return <SplitBillManager {...roleProps} />; // New Route
        
        // 支付管理
        case 'payment': return <PaymentManager {...roleProps} />;
        
        // 帮助中心
        case 'help-docs': return <HelpCenterManager {...roleProps} />;

        // 系统管理
        case 'system-role': return <SystemRoleManager {...roleProps} />;
        case 'system-user': return <SystemUserManager {...roleProps} />;

        default:
             // 默认或父级菜单点击后的兜底逻辑
             if (activeMenuId === 'provider') return <ServiceProviderManager {...roleProps} />;
             if (activeMenuId === 'partner') return <PartnerManager {...roleProps} />;
             if (activeMenuId === 'express') return <ParcelManager {...roleProps} />;
             if (activeMenuId === 'finance') return <FinanceTransactionManager {...roleProps} />;
             if (activeMenuId === 'system') return <SystemRoleManager {...roleProps} />;
             if (activeMenuId === 'audit') return <AuditManager {...roleProps} subModule="station" mode="query" />;
             if (activeMenuId === 'help') return <HelpCenterManager {...roleProps} />;

            return (
                <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-500">
                    <Layout className="w-16 h-16 mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium">功能模块开发中</h3>
                    <p className="text-sm">该模块 "{activeMenuId}" 暂未开放</p>
                </div>
            );
    }
  };

  // 权限检查辅助函数
  const hasPermission = (allowedRoles: Role[]) => {
    return allowedRoles.includes(currentUser.role);
  };

  // 如果未登录，显示登录页
  if (!isLoggedIn) {
      return (
          <Login 
            onLogin={(user) => {
                setCurrentUser(user);
                setIsLoggedIn(true);
            }} 
          />
      );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 侧边栏 (Sidebar) */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-gray-300 flex flex-col transition-all duration-300 shadow-xl z-20`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-700/50">
           {isSidebarOpen ? (
             <div className="flex items-center gap-2 font-bold text-white text-xl tracking-tight">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">M</div>
                <span>社区协同管理平台</span>
             </div>
           ) : (
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">M</div>
           )}
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1 px-3">
            {MENU_ITEMS.map((item) => {
              // 过滤无权限的菜单项
              if (!hasPermission(item.roles)) return null;
              
              const Icon = item.icon;
              const isActive = activeMenuId === item.id || (item.children && item.children.some(c => c.id === activeMenuId));
              const isExpanded = expandedMenus.includes(item.id);

              return (
                <li key={item.id}>
                  {/* 一级菜单项 */}
                  <div 
                    onClick={() => {
                        if (item.children) {
                            toggleMenu(item.id);
                        } else {
                            window.location.hash = item.id;
                        }
                    }}
                    className={`
                      flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                      ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-gray-800 hover:text-white'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                       <Icon className="w-5 h-5 min-w-[20px]" />
                       {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                    </div>
                    {isSidebarOpen && item.children && (
                        <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    )}
                  </div>

                  {/* 二级菜单 (Submenu) */}
                  {isSidebarOpen && item.children && isExpanded && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-gray-700 pl-2">
                        {item.children.map(child => {
                             if (!hasPermission(child.roles)) return null;
                             return (
                                <li key={child.id}>
                                    <div 
                                        onClick={() => window.location.hash = child.id}
                                        className={`
                                            px-3 py-2 text-sm rounded-md cursor-pointer transition-colors block
                                            ${activeMenuId === child.id ? 'text-blue-400 bg-gray-800/50 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}
                                        `}
                                    >
                                        {child.label}
                                    </div>
                                </li>
                             )
                        })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* 主内容区域 (Main Content) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* 顶部 Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-mono">v3.7</span>
            
            {/* 全局功能搜索框 (增强版) */}
            <div className="hidden md:block relative w-full max-w-lg" ref={searchRef}>
               <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => { if(searchQuery) setIsSearchOpen(true); }}
                    placeholder="全站搜索：菜单、运单号、服务站、合伙人..." 
                    className="pl-9 pr-10 py-2.5 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-full"
                  />
                  {searchQuery && (
                      <button 
                        onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                        className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
                      >
                          <X className="w-3 h-3" />
                      </button>
                  )}
               </div>

               {/* 搜索结果下拉面板 */}
               {isSearchOpen && (
                   <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[70vh] flex flex-col animate-fade-in-up">
                       {searchResults.length > 0 ? (
                           <>
                             <div className="px-4 py-2 bg-gray-50 border-b text-xs font-semibold text-gray-500">
                                找到 {searchResults.length} 个结果
                             </div>
                             <div className="overflow-y-auto flex-1 custom-scrollbar">
                                {searchResults.map((result) => (
                                    <div 
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => handleResultClick(result)}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors group"
                                    >
                                        <div className={`p-2 rounded-lg shrink-0 ${
                                            result.type === 'menu' ? 'bg-indigo-100 text-indigo-600' :
                                            result.type === 'parcel' ? 'bg-orange-100 text-orange-600' :
                                            result.type === 'station' ? 'bg-green-100 text-green-600' :
                                            result.type === 'partner' ? 'bg-purple-100 text-purple-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                            <result.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-700 truncate">
                                                    {result.title}
                                                </h4>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase">
                                                    {result.type === 'menu' ? '菜单' : 
                                                     result.type === 'parcel' ? '包裹' : 
                                                     result.type === 'station' ? '服务站' : 
                                                     '合伙人'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400" />
                                    </div>
                                ))}
                             </div>
                           </>
                       ) : (
                           <div className="p-8 text-center text-gray-400">
                               <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                               <p className="text-sm">未找到相关内容</p>
                           </div>
                       )}
                   </div>
               )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* 通知中心 */}
            <NotificationCenter 
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClear={handleClearNotifications}
                onRemove={handleRemoveNotification}
            />

            {/* 用户头像下拉菜单 */}
            <div className="relative">
                <div 
                    className="flex items-center gap-3 pl-4 cursor-pointer select-none"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{
                            currentUser.role === Role.KUAIJIN ? '快金平台' :
                            currentUser.role === Role.PROVIDER ? '服务商' :
                            currentUser.role === Role.PARTNER ? '合伙人' :
                            currentUser.role === Role.STATION ? '驿站负责人' : '物业公司'
                        }</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm overflow-hidden hover:ring-2 ring-blue-100 transition-all">
                        <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isUserDropdownOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsUserDropdownOpen(false)}></div>
                        <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 animate-fade-in-down">
                            <button 
                                onClick={() => { setIsChangePwdOpen(true); setIsUserDropdownOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Lock className="w-4 h-4" /> 修改密码
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> 退出登录
                            </button>
                        </div>
                    </>
                )}
            </div>
          </div>
        </header>

        {/* 动态内容渲染区域 */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50 max-w-[1920px] mx-auto w-full">
           <div className="space-y-6 animate-fade-in">
                {renderContent()}
           </div>
        </main>
      </div>

      {/* 全局模态框 */}
      <ChangePasswordModal isOpen={isChangePwdOpen} onClose={() => setIsChangePwdOpen(false)} />
    </div>
  );
};

export default App;
