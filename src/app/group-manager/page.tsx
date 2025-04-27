"use client"

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import {
  GameGroup,
  GameGroupMember,
  createGameGroup,
  getUserCreatedGroups,
  getGameGroupMembers,
  addMemberToGroup,
  removeMemberFromGroup,
  deleteGameGroup
} from '@/lib/gameGroupApi'

export default function GroupManagerPage() {
  const { t } = useTranslation()
  const [userGroups, setUserGroups] = useState<GameGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id?: string } | null>(null)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<GameGroup | null>(null)
  const [groupMembers, setGroupMembers] = useState<GameGroupMember[]>([])
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // 获取用户信息
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null))
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  // 加载用户创建的组
  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const loadGroups = async () => {
      setLoading(true)
      try {
        const { data, error } = await getUserCreatedGroups()
        if (error) {
          console.error('获取游戏组失败:', error)
          return
        }
        
        setUserGroups(data || [])
      } catch (error) {
        console.error('获取游戏组异常:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGroups()
  }, [user?.id])

  // 加载组成员
  useEffect(() => {
    if (!selectedGroup) {
      setGroupMembers([])
      return
    }

    const loadMembers = async () => {
      try {
        const { data, error } = await getGameGroupMembers(selectedGroup.id)
        if (error) {
          console.error('获取组成员失败:', error)
          return
        }
        
        setGroupMembers(data || [])
      } catch (error) {
        console.error('获取组成员异常:', error)
      }
    }

    loadMembers()
  }, [selectedGroup])

  // 创建新组
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim()) return
    
    setIsCreatingGroup(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { data, error } = await createGameGroup(newGroupName, newGroupDescription)
      if (error) {
        setError(`创建组失败: ${error.message}`)
        return
      }
      
      setUserGroups([...(data ? [data] : []), ...userGroups])
      setNewGroupName('')
      setNewGroupDescription('')
      setSuccess('游戏组创建成功！')
    } catch (error: any) {
      setError(`创建组异常: ${error.message}`)
    } finally {
      setIsCreatingGroup(false)
    }
  }

  // 添加成员
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberEmail.trim() || !selectedGroup) return
    
    setIsAddingMember(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { error } = await addMemberToGroup(selectedGroup.id, newMemberEmail)
      if (error) {
        setError(`添加成员失败: ${error.message}`)
        return
      }
      
      // 重新加载成员
      const { data } = await getGameGroupMembers(selectedGroup.id)
      setGroupMembers(data || [])
      setNewMemberEmail('')
      setSuccess('成员添加成功！')
    } catch (error: any) {
      setError(`添加成员异常: ${error.message}`)
    } finally {
      setIsAddingMember(false)
    }
  }

  // 移除成员
  const handleRemoveMember = async (memberId: string) => {
    if (!selectedGroup) return
    
    try {
      const { error } = await removeMemberFromGroup(memberId)
      if (error) {
        setError(`移除成员失败: ${error.message}`)
        return
      }
      
      // 从列表中移除
      setGroupMembers(groupMembers.filter(member => member.id !== memberId))
      setSuccess('成员已移除')
    } catch (error: any) {
      setError(`移除成员异常: ${error.message}`)
    }
  }

  // 删除组
  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm(t('confirm_delete_group', '确定要删除这个游戏组吗？组内所有待玩游戏也将被删除。'))) {
      return
    }
    
    try {
      const { error } = await deleteGameGroup(groupId)
      if (error) {
        setError(`删除组失败: ${error.message}`)
        return
      }
      
      // 从列表中移除
      setUserGroups(userGroups.filter(group => group.id !== groupId))
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null)
      }
      setSuccess('游戏组已删除')
    } catch (error: any) {
      setError(`删除组异常: ${error.message}`)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">{t('group_login_required', '请登录后管理您的游戏组')}</p>
          <Button asChild>
            <a href="/signin">{t('signin', '登录')}</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">{t('group_manager', '游戏组管理')}</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左侧：组列表 */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4">{t('your_groups', '您创建的游戏组')}</h2>
          
          {/* 创建新组表单 */}
          <form onSubmit={handleCreateGroup} className="mb-6">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('group_name', '组名称')}
              </label>
              <Input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder={t('group_name_placeholder', '输入组名称...')}
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('group_description', '组描述')}
              </label>
              <textarea
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder={t('group_description_placeholder', '输入组描述...')}
                className="w-full h-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Button type="submit" disabled={isCreatingGroup || !newGroupName.trim()}>
              {isCreatingGroup ? t('creating', '创建中...') : t('create_group', '创建游戏组')}
            </Button>
          </form>
          
          {/* 组列表 */}
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : userGroups.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {t('no_groups', '您还没有创建任何游戏组')}
            </div>
          ) : (
            <ul className="space-y-2">
              {userGroups.map((group) => (
                <li 
                  key={group.id} 
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedGroup?.id === group.id 
                      ? 'bg-blue-100 border-blue-300 border' 
                      : 'hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                      {group.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{group.description}</p>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* 右侧：成员管理 */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          {selectedGroup ? (
            <>
              <h2 className="text-lg font-bold mb-4">
                {t('group_members', '《{{groupName}}》成员管理', { groupName: selectedGroup.name })}
              </h2>
              
              {/* 添加成员表单 */}
              <form onSubmit={handleAddMember} className="mb-6">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder={t('member_email_placeholder', '输入成员邮箱...')}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isAddingMember || !newMemberEmail.trim()}>
                    {isAddingMember ? t('adding', '添加中...') : t('add_member', '添加成员')}
                  </Button>
                </div>
              </form>
              
              {/* 成员列表 */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-3">{t('members', '成员列表')}</h3>
                
                {groupMembers.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    {t('no_members', '此组还没有成员，尝试添加一些成员吧')}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {groupMembers.map((member) => (
                      <li key={member.id} className="flex justify-between items-center p-2 border-b">
                        <div>
                          <span className="font-medium">{member.user?.email}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {member.user_id === selectedGroup.leader_id 
                              ? t('group_leader', '组长') 
                              : t('member', '成员')}
                          </span>
                        </div>
                        
                        {member.user_id !== selectedGroup.leader_id && (
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" 
                              />
                            </svg>
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t('select_group_prompt', '请从左侧选择一个游戏组进行管理，或创建一个新的游戏组')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 