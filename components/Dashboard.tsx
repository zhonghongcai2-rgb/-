
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, CartesianGrid, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis, BarChart, Bar
} from 'recharts';
import { 
  Package, Truck, Wallet, FileText, CheckCircle, 
  XCircle, TrendingUp, TrendingDown, ShieldAlert, 
  Users, UserPlus, MousePointer, Box, RotateCcw,
  CreditCard, Filter, Building, Search, Loader2
} from 'lucide-react';
import { MOCK_STATIONS, EXPRESS_BRANDS, MOCK_PROPERTIES, CASCADER_REGIONS, MOCK_PARTNERS } from '../constants';
import { Role } from '../types';

// 指标卡片组件
const StatCard = ({ title, value, subValue, icon: Icon, colorClass, type = 'neutral', onClick }: any) => {
  return (
    <div 
        onClick={onClick}
        className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full transition-all hover:shadow-md ${onClick ? 'cursor-pointer hover:ring-2 ring-blue-50 group' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        {subValue && (
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${subValue.includes('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {subValue}
            </span>
        )}
      </div>
      <div>
        <h4 className="text-2xl font-bold text-gray-800 tracking-tight">{value}</h4>
        <p className="text-xs text-gray-500 font-medium mt-1">{title}</p>
      </div>
    </div>
  );
};

const SectionTitle = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-4 mt-8">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
            {title}
        </h3>
        {children}
    </div>
)

const Dashboard = ({ userRole }: { userRole: Role }) => {
  const [viewMode, setViewMode] = useState<'property' | 'partner' | 'station' | 'company'>(() => {
    if (userRole === Role.PARTNER) return 'station';
    if (userRole === Role.PROPERTY) return 'station';
    if (userRole === Role.STATION) return 'station';
    return 'property';
  });

  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');
  const [activeTimeRange, setActiveTimeRange] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [metrics, setMetrics] = useState({
      inbound: 12543,
      outbound: 8234,
      stock: 4309,
      tickets: 5,
      income: 4520.50,
      damageCost: 200.00
  });

  const [trendData, setTrendData] = useState([
      { time: '08:00', inbound: 120, outbound: 80 },
      { time: '10:00', inbound: 300, outbound: 240 },
      { time: '12:00', inbound: 200, outbound: 450 },
      { time: '14:00', inbound: 278, outbound: 200 },
      { time: '16:00', inbound: 489, outbound: 380 },
      { time: '18:00', inbound: 340, outbound: 430 },
      { time: '20:00', inbound: 150, outbound: 210 },
  ]);

  const filterOptions = {
      property: ['所有物业公司', ...MOCK_PROPERTIES.map(p => p.name)],
      partner: ['所有合伙人', ...MOCK_PARTNERS.map(p => p.name)],
      station: ['所有服务站', ...MOCK_STATIONS.map(s => s.name)],
      company: ['所有快递公司', ...EXPRESS_BRANDS]
  };

  const getFilterLabel = () => {
      switch(viewMode) {
          case 'property': return '选择物业公司';
          case 'partner': return '选择合伙人';
          case 'station': return '选择服务站';
          case 'company': return '选择快递公司';
          default: return '选择';
      }
  };

  const handleViewModeChange = (mode: any) => {
      setViewMode(mode);
      setSelectedEntity('');
      setSelectedProvince('');
      setSelectedCity('');
      setSelectedDistrict('');
      setTimeRange('today');
      setActiveTimeRange('today');
      
      setTrendData([
          { time: '08:00', inbound: 120, outbound: 80 },
          { time: '10:00', inbound: 300, outbound: 240 },
          { time: '12:00', inbound: 200, outbound: 450 },
          { time: '14:00', inbound: 278, outbound: 200 },
          { time: '16:00', inbound: 489, outbound: 380 },
          { time: '18:00', inbound: 340, outbound: 430 },
          { time: '20:00', inbound: 150, outbound: 210 },
      ]);
  };

  const handleSearch = () => {
      setIsLoading(true);
      setTimeout(() => {
          setMetrics(prev => ({
              ...prev,
              inbound: Math.floor(Math.random() * 5000) + 10000,
              outbound: Math.floor(Math.random() * 4000) + 5000,
              stock: Math.floor(Math.random() * 2000) + 2000,
              tickets: Math.floor(Math.random() * 10),
              income: Math.floor(Math.random() * 1000) + 4000
          }));
          
          let newTrendData: any[] = [];
          if (timeRange === 'today' || timeRange === 'yesterday') {
              newTrendData = [
                  { time: '08:00', inbound: Math.floor(Math.random() * 500), outbound: Math.floor(Math.random() * 500) },
                  { time: '10:00', inbound: Math.floor(Math.random() * 500), outbound: Math.floor(Math.random() * 500) },
                  { time: '12:00', inbound: Math.floor(Math.random() * 500), outbound: Math.floor(Math.random() * 500) },
                  { time: '14:00', inbound: Math.floor(Math.random() * 500), outbound: Math.floor(Math.random() * 500) },
                  { time: '16:00', inbound: Math.floor(Math.random() * 500), outbound: Math.floor(Math.random() * 500) },
                  { time: '18:00', inbound: Math.floor(Math.random() * 500), outbound: Math.floor(Math.random() * 500) },
                  { time: '20:00', inbound: Math.floor(Math.random() * 500), outbound: Math.floor(Math.random() * 500) },
              ];
          } else {
               newTrendData = [
                  { time: '周一', inbound: Math.floor(Math.random() * 2000), outbound: Math.floor(Math.random() * 2000) },
                  { time: '周二', inbound: Math.floor(Math.random() * 2000), outbound: Math.floor(Math.random() * 2000) },
                  { time: '周三', inbound: Math.floor(Math.random() * 2000), outbound: Math.floor(Math.random() * 2000) },
                  { time: '周四', inbound: Math.floor(Math.random() * 2000), outbound: Math.floor(Math.random() * 2000) },
                  { time: '周五', inbound: Math.floor(Math.random() * 2000), outbound: Math.floor(Math.random() * 2000) },
                  { time: '周六', inbound: Math.floor(Math.random() * 2000), outbound: Math.floor(Math.random() * 2000) },
                  { time: '周日', inbound: Math.floor(Math.random() * 2000), outbound: Math.floor(Math.random() * 2000) },
              ];
          }
          setTrendData(newTrendData);
          setActiveTimeRange(timeRange);
          setIsLoading(false);
      }, 800);
  };

  return (
    <div className="p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">总览看板</h2>
            <div className="flex gap-2">
                 <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1 text-gray-600">
                     <RotateCcw className="w-3.5 h-3.5" /> 刷新数据
                 </button>
                 <span className="text-xs text-gray-400 self-center">最后更新: 刚刚</span>
            </div>
        </div>

        {/* 筛选区域 */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 animate-fade-in">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-bold text-gray-700">筛选维度:</span>
                </div>
                
                {/* 视角切换 */}
                {(userRole === Role.KUAIJIN || userRole === Role.PROVIDER) && (
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => handleViewModeChange('property')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'property' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>物业公司</button>
                        <button onClick={() => handleViewModeChange('partner')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'partner' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>合伙人</button>
                        <button onClick={() => handleViewModeChange('station')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'station' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>服务站</button>
                        <button onClick={() => handleViewModeChange('company')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'company' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>快递品牌</button>
                    </div>
                )}

                <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>

                {/* 实体选择 (物业公司不可选) */}
                {userRole !== Role.PROPERTY && (
                    <select 
                        value={selectedEntity} 
                        onChange={(e) => setSelectedEntity(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-[150px] focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                        <option value="">{getFilterLabel()}</option>
                        {(filterOptions as any)[viewMode]?.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                )}

                {/* 区域级联 (简单模拟) */}
                <div className="flex gap-2">
                     <select className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none" value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
                         <option value="">省份</option>
                         {Object.keys(CASCADER_REGIONS).map(p => <option key={p} value={p}>{p}</option>)}
                     </select>
                     {selectedProvince && (
                         <select className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                             <option value="">城市</option>
                             {Object.keys(CASCADER_REGIONS[selectedProvince]).map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                     )}
                     {selectedCity && (
                         <select className="border border-gray-300 rounded px-2 py-1.5 text-sm outline-none" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                             <option value="">区域</option>
                             {CASCADER_REGIONS[selectedProvince][selectedCity].map((d: string) => <option key={d} value={d}>{d}</option>)}
                         </select>
                     )}
                </div>

                <div className="ml-auto flex gap-2">
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button onClick={() => setTimeRange('today')} className={`px-3 py-1.5 text-xs font-medium ${timeRange === 'today' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>今日</button>
                        <button onClick={() => setTimeRange('yesterday')} className={`px-3 py-1.5 text-xs font-medium border-l border-gray-300 ${timeRange === 'yesterday' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>昨日</button>
                        <button onClick={() => setTimeRange('week')} className={`px-3 py-1.5 text-xs font-medium border-l border-gray-300 ${timeRange === 'week' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>本周</button>
                        <button onClick={() => setTimeRange('month')} className={`px-3 py-1.5 text-xs font-medium border-l border-gray-300 ${timeRange === 'month' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>本月</button>
                    </div>
                    
                    <button 
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2 transition-all shadow-sm active:transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        查询
                    </button>
                </div>
            </div>
        </div>

        {/* 核心指标卡 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="入库包裹总量" 
                value={metrics.inbound.toLocaleString()} 
                subValue="+12% 较昨日" 
                icon={Package} 
                colorClass="bg-blue-500" 
            />
            <StatCard 
                title="出库包裹总量" 
                value={metrics.outbound.toLocaleString()} 
                subValue="+8% 较昨日" 
                icon={Truck} 
                colorClass="bg-green-500" 
            />
            <StatCard 
                title="滞留库存" 
                value={metrics.stock.toLocaleString()} 
                subValue="-2% 较昨日" 
                icon={Box} 
                colorClass="bg-orange-500" 
            />
            <StatCard 
                title="预估今日收益 (元)" 
                value={`¥${metrics.income.toFixed(2)}`} 
                subValue="+5% 较昨日" 
                icon={Wallet} 
                colorClass="bg-purple-500" 
            />
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <SectionTitle title="包裹流量趋势">
                </SectionTitle>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                            <Legend iconType="circle" />
                            <Area type="monotone" dataKey="inbound" name="入库量" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" />
                            <Area type="monotone" dataKey="outbound" name="出库量" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <SectionTitle title="品牌入库占比">
                    <span className="text-xs text-gray-400">TOP 5</span>
                </SectionTitle>
                <div className="space-y-4">
                     {[
                         { name: '中通快递', value: 35, color: 'bg-blue-500' },
                         { name: '圆通速递', value: 25, color: 'bg-purple-500' },
                         { name: '韵达快递', value: 20, color: 'bg-yellow-500' },
                         { name: '极兔速递', value: 15, color: 'bg-red-500' },
                         { name: '顺丰速运', value: 5, color: 'bg-green-500' },
                     ].map(brand => (
                         <div key={brand.name}>
                             <div className="flex justify-between text-sm mb-1">
                                 <span className="text-gray-600">{brand.name}</span>
                                 <span className="font-bold text-gray-800">{brand.value}%</span>
                             </div>
                             <div className="w-full bg-gray-100 rounded-full h-2">
                                 <div className={`h-2 rounded-full ${brand.color}`} style={{ width: `${brand.value}%` }}></div>
                             </div>
                         </div>
                     ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
