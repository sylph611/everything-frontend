import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
        <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div style={{
          marginLeft: sidebarCollapsed ? '72px' : '280px',
          flex: 1,
          transition: 'margin-left 0.3s ease'
        }}>
          <header style={{
            backgroundColor: '#fff',
            borderBottom: '1px solid #e5e9f2',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  style={{
                    padding: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    color: '#64748b'
                  }}
              >
                <span style={{ fontSize: '18px' }}>☰</span>
              </button>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#364a63' }}>
                Dashboard
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#364a63' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8094ae' }}>
                    {user?.email}
                  </div>
                </div>
              </div>

              <button
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
              >
                Logout
              </button>
            </div>
          </header>

          <div style={{ padding: '24px' }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '40px',
              border: '1px solid #e5e9f2',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '28px',
                fontWeight: '700',
                color: '#364a63'
              }}>
                🎉 API 기반 메뉴 시스템 완료!
              </h2>
              <p style={{
                margin: '0 0 30px 0',
                fontSize: '16px',
                color: '#8094ae',
                lineHeight: '1.6'
              }}>
                메뉴가 API 호출을 통해 동적으로 로드됩니다. <br />
                왼쪽 사이드바에서 다양한 메뉴를 확인하고, 햄버거 버튼으로 접을 수 있습니다.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginTop: '30px'
              }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e5e9f2'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#364a63' }}>Dashboard</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#8094ae' }}>현재 페이지</p>
                </div>

                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e5e9f2'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔗</div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#364a63' }}>API 메뉴</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#8094ae' }}>동적 로드</p>
                </div>

                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e5e9f2'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎨</div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#364a63' }}>Dashlite 스타일</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#8094ae' }}>모던 디자인</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};