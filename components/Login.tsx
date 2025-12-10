
import React, { useState } from 'react';
import { Truck, Lock, User, ShieldCheck } from 'lucide-react';
import { Role, User as UserType } from '../types';
import { MOCK_SYSTEM_USERS } from '../constants';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('provider_01');
  const [password, setPassword] = useState('123456a');
  const [selectedRole, setSelectedRole] = useState<Role>(Role.PROVIDER); // Default to Provider
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoRoleSelect = (role: Role) => {
      setSelectedRole(role);
      // 自动设置为 admin 账号以触发演示逻辑
      setUsername('admin');
      setPassword('123456a');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 模拟登录请求
    setTimeout(() => {
        // 1. 优先在动态系统用户列表中查找
        const foundUser = MOCK_SYSTEM_USERS.find(u => u.username === username);
        
        // 特殊逻辑修复：如果用户名为 'admin' 且选择了非平台角色，视为演示模式，跳过数据库查找
        // 这样可以确保演示按钮的选择生效，而不是被 admin 的默认权限覆盖
        const isDemoOverride = username === 'admin' && selectedRole !== Role.KUAIJIN;

        if (foundUser && !isDemoOverride) {
            // 简单模拟密码校验 (实际应加密对比)
            if (foundUser.password && foundUser.password !== password) {
                setError('用户名或密码错误');
                setIsLoading(false);
                return;
            } else if (!foundUser.password && password !== '123456a') {
                 // 默认密码校验
                 setError('用户名或密码错误');
                 setIsLoading(false);
                 return;
            }

            // 映射 Role based on roleName
            let mappedRole = Role.KUAIJIN;
            if (foundUser.roleName.includes('服务商')) mappedRole = Role.PROVIDER;
            else if (foundUser.roleName.includes('合伙人')) mappedRole = Role.PARTNER;
            else if (foundUser.roleName.includes('物业')) mappedRole = Role.PROPERTY;
            else if (foundUser.roleName.includes('驿站') || foundUser.roleName.includes('站长')) mappedRole = Role.STATION;
            else if (foundUser.roleName.includes('派送员') || foundUser.roleName.includes('快递员')) mappedRole = Role.COURIER;

            const userObj: UserType = {
                id: foundUser.id,
                name: foundUser.username,
                role: mappedRole,
                avatar: `https://ui-avatars.com/api/?name=${foundUser.username}&background=0D8ABC&color=fff`,
                organization: foundUser.organization // 关键：传递组织名称用于数据过滤
            };
            onLogin(userObj);
            return;
        }

        // 2. 如果未找到，尝试演示逻辑 (Fallback for demo accounts not in mock DB yet)
        if (password === '123456a') {
            let roleName = '快金管理员';
            let orgName = '平台总部';

            // 根据演示选择的角色设置默认组织名，以便测试数据隔离
            if (selectedRole === Role.PROVIDER) {
                roleName = '服务商管理员';
                orgName = '深圳市快金数据'; // 匹配 Mock 数据中的服务商名 (sp001)
            }
            else if (selectedRole === Role.PARTNER) {
                roleName = '合伙人';
                orgName = '快递鸟'; // 匹配 Mock 数据中的合伙人名 (p001)
            }
            else if (selectedRole === Role.PROPERTY) {
                roleName = '物业管理员';
                orgName = '深圳市澎柏物业管理有限公司‌'; // 匹配 Mock 数据中的物业名 (prop001)
            }
            else if (selectedRole === Role.STATION) {
                roleName = '驿站站长';
                orgName = '厚德品园上门服务';
            }

            const mockUser: UserType = {
                id: 'u_' + Date.now(),
                name: username === 'admin' ? roleName : username,
                role: selectedRole,
                avatar: `https://ui-avatars.com/api/?name=${username}&background=0D8ABC&color=fff`,
                organization: orgName
            };
            onLogin(mockUser);
        } else {
            setError('用户名或密码错误');
            setIsLoading(false);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px] opacity-20"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[150px] opacity-20"></div>
        </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden z-10 animate-fade-in">
        
        {/* 左侧品牌区 */}
        <div className="w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex-col justify-between hidden md:flex relative">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                  <Truck className="w-8 h-8 text-white" />
               </div>
               <span className="text-2xl font-bold tracking-wider">LOGISTICS</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">社区协同<br/>管理平台</h2>
            <p className="text-blue-100 opacity-90">
              全链路物流解决方案，连接快金、服务商、合伙人、驿站与物业，实现高效协同。
            </p>
          </div>
          <div className="flex gap-4 text-sm opacity-60">
             <span>© 2023 Logistics Inc.</span>
             <span>隐私政策</span>
             <span>服务条款</span>
          </div>
          
          {/* 装饰圆环 */}
          <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 border-[20px] border-white/10 rounded-full"></div>
        </div>

        {/* 右侧登录表单 */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800">欢迎登录</h3>
            <p className="text-gray-500 mt-2">请输入您的账号密码以访问后台系统</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* 演示用角色选择器 */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4">
                <label className="text-xs font-bold text-blue-600 uppercase mb-2 block tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 演示模式：点击切换视角 (自动填号)
                </label>
                <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => handleDemoRoleSelect(Role.PROVIDER)} className={`px-2 py-1.5 text-xs rounded border transition-colors ${selectedRole === Role.PROVIDER ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>服务商</button>
                    <button type="button" onClick={() => handleDemoRoleSelect(Role.PARTNER)} className={`px-2 py-1.5 text-xs rounded border transition-colors ${selectedRole === Role.PARTNER ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>合伙人</button>
                    <button type="button" onClick={() => handleDemoRoleSelect(Role.PROPERTY)} className={`px-2 py-1.5 text-xs rounded border transition-colors ${selectedRole === Role.PROPERTY ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>物业公司</button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">账号</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="请输入用户名"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="请输入密码"
                        required
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        登录中...
                    </span>
                ) : '登 录'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center flex flex-col gap-1">
             <p className="text-xs text-gray-400">系统默认密码: 123456a</p>
             <p className="text-[10px] text-gray-300">v3.7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
