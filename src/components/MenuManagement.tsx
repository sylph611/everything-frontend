import React, { useState, useEffect } from 'react';
import { MenuItem, CreateMenuItemRequest, UpdateMenuItemRequest } from '../types/menu';
import { menuService } from '../services/menuService';

export const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<CreateMenuItemRequest>({
    label: '',
    icon: '',
    path: '',
    order: 0,
    permissions: []
  });

  // 메뉴 목록 로드
  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const items = await menuService.getMenuItems(true); // 강제 새로고침
      setMenuItems(items);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  // 폼 리셋
  const resetForm = () => {
    setFormData({
      label: '',
      icon: '',
      path: '',
      order: 0,
      permissions: []
    });
    setEditingItem(null);
    setShowForm(false);
  };

  // 편집 모드로 전환
  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      icon: item.icon,
      path: item.path,
      parentId: item.parentId,
      order: item.order,
      permissions: item.permissions || []
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        const updateData: UpdateMenuItemRequest = {
          label: formData.label,
          icon: formData.icon,
          path: formData.path,
          parentId: formData.parentId,
          order: formData.order,
          permissions: formData.permissions
        };
        await menuService.updateMenu(editingItem.id, updateData);
      } else {
        await menuService.createMenu(formData);
      }
      resetForm();
      loadMenuItems();  // reload after update/create
    } catch (error) {
      console.error('메뉴 저장 실패:', error);
    }
  };

  // 삭제
  const handleDelete = async (id: string) => {
    if (!window.confirm('이 메뉴 항목을 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      await menuService.deleteMenu(id);
      await loadMenuItems();
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      alert('메뉴 항목 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 메뉴 항목 렌더링
  const renderMenuItem = (item: MenuItem, depth = 0) => (
    <div key={item.id} style={{ marginLeft: `${depth * 20}px` }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        border: '1px solid #e5e9f2',
        borderRadius: '8px',
        backgroundColor: '#fff',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '20px' }}>{item.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', color: '#364a63' }}>{item.label}</div>
          <div style={{ fontSize: '12px', color: '#8094ae' }}>{item.path}</div>
        </div>
        <div style={{ fontSize: '12px', color: '#8094ae' }}>
          Order: {item.order}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleEdit(item)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            편집
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            삭제
          </button>
        </div>
      </div>
      
      {/* 자식 메뉴 렌더링 */}
      {item.children && item.children.map(child => renderMenuItem(child, depth + 1))}
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e9f2',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#364a63' }}>
            메뉴 관리
          </h2>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            새 메뉴 추가
          </button>
        </div>

        {/* 메뉴 폼 */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '24px',
              width: '500px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>
                {editingItem ? '메뉴 편집' : '새 메뉴 추가'}
              </h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    메뉴명
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e9f2',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    아이콘 (이모지)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    required
                    placeholder="📊"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e9f2',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    경로
                  </label>
                  <input
                    type="text"
                    value={formData.path}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    required
                    placeholder="/dashboard"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e9f2',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    부모 메뉴
                  </label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value || undefined })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e9f2',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">없음 (최상위 메뉴)</option>
                    {menuItems
                      .filter(item => !item.parentId) // 최상위 메뉴만
                      .map(item => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    순서
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e9f2',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      opacity: loading ? 0.5 : 1
                    }}
                  >
                    {loading ? '저장 중...' : '저장'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 메뉴 목록 */}
        <div>
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#8094ae'
            }}>
              로딩 중...
            </div>
          )}

          {!loading && menuItems.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#8094ae'
            }}>
              등록된 메뉴가 없습니다.
            </div>
          )}

          {!loading && menuItems.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#364a63' }}>
                메뉴 목록
              </h3>
              {menuItems.map(item => renderMenuItem(item))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
