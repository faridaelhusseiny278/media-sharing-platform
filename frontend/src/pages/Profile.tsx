import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  id: number;
  user_id: number;
  filepath: string;
  created_at: string;
  likes_count: number;
  is_liked: boolean;
  user_email: string;
}

interface ProfileStats {
  totalPosts: number;
  totalLikes: number;
  totalLikedPosts: number;
}

interface ProfileProps {
  onNavigateHome: () => void;
  onNavigateFriends: () => void;
}

export default function Profile({ onNavigateHome, onNavigateFriends }: ProfileProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<ProfileStats>({ totalPosts: 0, totalLikes: 0, totalLikedPosts: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'liked'>('posts');
  const { logout } = useAuth();

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts/my-posts');
      setPosts(response.data.posts);
      setStats(response.data.stats);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts/liked-posts');
      setPosts(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch liked posts');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: number) => {
    try {
      await api.post('/likes/toggle', { postId });
      // Refresh the current view
      if (activeTab === 'posts') {
        fetchUserPosts();
      } else {
        fetchLikedPosts();
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to toggle like');
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleTabChange = (tab: 'posts' | 'liked') => {
    setActiveTab(tab);
    if (tab === 'posts') {
      fetchUserPosts();
    } else {
      fetchLikedPosts();
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">👤</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Profile
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
                onClick={onNavigateFriends}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm"
              >
                <span>👥</span>
                <span>Friends</span>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 text-red-700">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📝</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalPosts}</div>
                <div className="text-sm text-gray-500">Total Posts</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">❤️</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalLikes}</div>
                <div className="text-sm text-gray-500">Likes Received</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">👍</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalLikedPosts}</div>
                <div className="text-sm text-gray-500">Posts You Liked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => handleTabChange('posts')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'posts'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>📝</span>
                <span>My Posts ({stats.totalPosts})</span>
              </span>
            </button>
            <button
              onClick={() => handleTabChange('liked')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'liked'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>❤️</span>
                <span>Liked Posts ({stats.totalLikedPosts})</span>
              </span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-500 text-lg">Loading posts...</div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Media */}
                {post.filepath && (
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {post.filepath.endsWith('.mp4') ? (
                      <video 
                        src={`http://localhost:5000/uploads/${post.filepath}`} 
                        controls 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={`http://localhost:5000/uploads/${post.filepath}`} 
                        alt="Post media" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  {/* Post Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{formatDate(post.created_at)}</span>
                    {activeTab === 'posts' && (
                      <span>by You</span>
                    )}
                    {activeTab === 'liked' && (
                      <span>by {post.user_email}</span>
                    )}
                  </div>

                  {/* Like Button */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors duration-200 ${
                        post.is_liked
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{post.is_liked ? '❤️' : '🤍'}</span>
                      <span>{post.likes_count}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-3xl">
                {activeTab === 'posts' ? '📝' : '❤️'}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {activeTab === 'posts' ? 'No posts yet' : 'No liked posts yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'posts' 
                ? 'Start sharing your moments with the world!' 
                : 'Like some posts to see them here!'
              }
            </p>
            {activeTab === 'posts' && (
              <button
                onClick={onNavigateHome}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
              >
                Create Post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 