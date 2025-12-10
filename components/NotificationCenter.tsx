import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Info, CheckCircle, AlertTriangle, XCircle, BellOff, X } from 'lucide-react';
import { Notification } from '../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClear: () => void;
  onRemove: (id: string) => void;
}

export const NotificationCenter = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClear, onRemove }: NotificationCenterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`relative p-2 rounded-lg transition-colors ${isOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-fade-in-up origin-top-right overflow-hidden flex flex-col max-h-[80vh]">
           {/* Header */}
           <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
             <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">通知中心</h3>
                {unreadCount > 0 && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">{unreadCount} 未读</span>}
             </div>
             <div className="flex gap-1">
                <button 
                    onClick={onMarkAllAsRead} 
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="全部标为已读"
                    disabled={unreadCount === 0}
                >
                    <Check className="w-4 h-4" />
                </button>
                <button 
                    onClick={onClear} 
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="清空所有通知"
                    disabled={notifications.length === 0}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
             </div>
           </div>
           
           {/* List */}
           <div className="overflow-y-auto custom-scrollbar flex-1 p-2 space-y-2">
             {notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
                    <div className="p-3 bg-gray-50 rounded-full">
                        <BellOff className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm">暂无通知</p>
                </div>
             ) : (
                notifications.map(n => (
                   <div 
                      key={n.id} 
                      className={`group p-3 rounded-lg border transition-all relative flex gap-3 ${n.isRead ? 'bg-white border-transparent hover:border-gray-100 hover:bg-gray-50' : 'bg-blue-50/40 border-blue-100/50 hover:bg-blue-50/80'}`}
                   >
                      <div className="mt-0.5 shrink-0">
                         {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0" onClick={() => onMarkAsRead(n.id)}>
                          <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-sm font-semibold truncate pr-6 ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</h4>
                              <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap ml-2">{n.createTime}</span>
                          </div>
                          <p className={`text-xs leading-relaxed line-clamp-2 ${n.isRead ? 'text-gray-500' : 'text-gray-600'}`}>{n.message}</p>
                      </div>
                      
                      {/* Actions overlay on hover */}
                      <div className="absolute top-2 right-2 hidden group-hover:flex bg-white shadow-sm rounded border border-gray-100">
                         {!n.isRead && (
                             <button onClick={(e) => { e.stopPropagation(); onMarkAsRead(n.id); }} className="p-1 text-gray-400 hover:text-blue-600 border-r border-gray-100" title="标为已读">
                                <Check className="w-3 h-3" />
                             </button>
                         )}
                         <button onClick={(e) => { e.stopPropagation(); onRemove(n.id); }} className="p-1 text-gray-400 hover:text-red-600" title="删除">
                            <X className="w-3 h-3" />
                         </button>
                      </div>
                      
                      {!n.isRead && <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-500 rounded-full group-hover:hidden"></span>}
                   </div>
                ))
             )}
           </div>
           
           {/* Footer */}
           {notifications.length > 0 && (
             <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
                <button className="text-xs text-gray-500 hover:text-blue-600 transition-colors w-full py-1">查看历史通知</button>
             </div>
           )}
        </div>
      )}
    </div>
  )
}