import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuItem } from '../types/menu';
import { menuService } from '../services/menuService';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await menuService.getMenuItems();
        setMenuItems(items);
      } catch (err) {
        setError('메뉴를 불러오는 중 오류가 발생했습니다.');
        console.error('Failed to load menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  // 현재 경로에 해당하는 메뉴의 부모들을 자동으로 확장
  useEffect(() => {
    const currentPath = location.pathname;
    const newExpandedItems = new Set<string>();

    const findAndExpandParents = (items: MenuItem[], path: string): boolean => {
      for (const item of items) {
        if (item.path === path) {
          return true;
        }
        
        if (item.children && findAndExpandParents(item.children, path)) {
          newExpandedItems.add(item.id);
          return true;
        }
      }
      return false;
    };

    findAndExpandParents(menuItems, currentPath);
    setExpandedItems(newExpandedItems);
  }, [location.pathname, menuItems]);

  // 메뉴 항목이 활성화되어 있는지 확인
  const isMenuActive = (item: MenuItem): boolean => {
    if (item.path === location.pathname) {
      return true;
    }
    
    // 자식 메뉴 중 활성화된 것이 있는지 확인
    if (item.children) {
      return item.children.some(child => isMenuActive(child));
    }
    
    return false;
  };

  // 메뉴 아이템 토글
  const toggleMenuItem = (itemId: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemId)) {
      newExpandedItems.delete(itemId);
    } else {
      newExpandedItems.add(itemId);
    }
    setExpandedItems(newExpandedItems);
  };

  // 메뉴 클릭 처리
  const handleMenuClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      // 자식 메뉴가 있는 경우 토글
      toggleMenuItem(item.id);
    } else {
      // 자식 메뉴가 없는 경우 네비게이션
      if (item.path === '/dashboard') {
        navigate(item.path);
      } else {
        alert(`${item.label} 페이지는 준비 중입니다.`);
      }
    }
  };

  // 메뉴 아이템 렌더링
  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isActive = isMenuActive(item);
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleMenuClick(item)}
          style={{
            width: '100%',
            padding: `12px ${16 + (depth * 20)}px`,
            margin: '2px 8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: isActive ? '#f0f4ff' : 'transparent',
            color: isActive ? '#6366f1' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            fontWeight: isActive ? '600' : '500',
            textAlign: 'left',
            position: 'relative'
          }}
          onMouseOver={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }
          }}
          onMouseOut={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span style={{ 
            fontSize: '16px', 
            width: '20px', 
            textAlign: 'center',
            opacity: depth > 0 ? 0.7 : 1
          }}>
            {item.icon}
          </span>
          
          {!isCollapsed && (
            <>
              <span style={{ flex: 1 }}>{item.label}</span>
              {hasChildren && (
                <span style={{ 
                  fontSize: '12px',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}>
                  ▼
                </span>
              )}
            </>
          )}
          
          {isActive && (
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '3px',
              backgroundColor: '#6366f1',
              borderRadius: '0 3px 3px 0'
            }} />
          )}
        </button>

        {/* 자식 메뉴 렌더링 */}
        {hasChildren && !isCollapsed && isExpanded && (
          <div style={{
            marginLeft: '8px',
            borderLeft: '1px solid #e5e9f2',
            marginBottom: '4px'
          }}>
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: isCollapsed ? '72px' : '280px',
      backgroundColor: '#fff',
      borderRight: '1px solid #e5e9f2',
      zIndex: 1000,
      transition: 'width 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '20px 16px',
        borderBottom: '1px solid #e5e9f2',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '64px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: '#6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          📊
        </div>
        {!isCollapsed && (
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#364a63' }}>
              StockDash
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#8094ae' }}>
              Investment Platform
            </p>
          </div>
        )}
      </div>

      {/* 메뉴 */}
      <nav style={{ flex: 1, padding: '24px 0', overflowY: 'auto' }}>
        {!isCollapsed && (
          <h3 style={{
            margin: '0 16px 16px 16px',
            fontSize: '11px',
            fontWeight: '600',
            color: '#8094ae',
            textTransform: 'uppercase'
          }}>
            MAIN MENU
          </h3>
        )}

        {loading && (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#8094ae',
            fontSize: '14px'
          }}>
            메뉴 로딩 중...
          </div>
        )}

        {error && (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#e74c3c',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* 하단 컨트롤 */}
      <div style={{ padding: '16px', borderTop: '1px solid #e5e9f2' }}>
        <button
          onClick={onToggle}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #e5e9f2',
            backgroundColor: '#f8fafc',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '12px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e9f2';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }}
        >
          <span>{isCollapsed ? '→' : '←'}</span>
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
