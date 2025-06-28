import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Friend {
  id: number;
  email: string;
  created_at: string;
}

interface User {
  id: number;
  email: string;
  created_at: string;
}

interface FriendsProps {
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
}

export default function Friends({ onNavigateHome, onNavigateProfile }: FriendsProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'search'>('friends');
  const { logout } = useAuth();

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await api.get('/friends/list');
      setFriends(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch friends');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await api.get(`/friends/search?query=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
    } catch (error: any) {
      console.error('Search error:', error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await api.get('/friends/all-users');
      setSearchResults(response.data);
    } catch (error: any) {
      console.error('Get all users error:', error);
    }
  };

  const addFriend = async (friendEmail: string) => {
    try {
      await api.post('/friends/add', { friendEmail });
      // Refresh friends list
      fetchFriends();
      // Refresh search results to remove the added friend from the list
      if (searchQuery) {
        searchUsers(searchQuery);
      } else {
        getAllUsers();
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to add friend');
    }
  };

  const removeFriend = async (friendId: number) => {
    try {
      await api.post('/friends/remove', { friendId });
      fetchFriends(); // Refresh friends list
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to remove friend');
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">👥</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Friends
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onNavigateHome}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
              >
                <span>🏠</span>
                <span>Home</span>
              </button>
              <button
                onClick={onNavigateProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 shadow-sm"
              >
                <span>👤</span>
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 text-red-700">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'friends'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>👥</span>
                <span>My Friends ({friends.length})</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'search'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>🔍</span>
                <span>Find Friends</span>
              </span>
            </button>
          </div>
        </div>

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-gray-500 text-lg">Loading friends...</div>
              </div>
            ) : friends.length > 0 ? (
              <div className="grid gap-4">
                {friends.map((friend) => (
                  <div key={friend.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">👤</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{friend.email}</div>
                          <div className="text-sm text-gray-500">
                            Friend since {formatDate(friend.created_at)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFriend(friend.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-3xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No friends yet</h3>
                <p className="text-gray-500 mb-4">Start connecting with other users!</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Find Friends
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm">🔍</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Search Users</h2>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="flex space-x-2">
                  <button
                    onClick={getAllUsers}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 text-sm"
                  >
                    Show All Users
                  </button>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'All Users'}
                  <span className="text-sm text-gray-500 ml-2">({searchResults.length} found)</span>
                </h3>
                {searchResults.map((user) => (
                  <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">👤</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{user.email}</div>
                          <div className="text-sm text-gray-500">
                            Joined {formatDate(user.created_at)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => addFriend(user.email)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                      >
                        Add Friend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">🔍</span>
                </div>
                <p className="text-gray-500">No users found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 