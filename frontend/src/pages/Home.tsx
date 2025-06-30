import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  id: number;
  user_id: number;
  user_email: string;
  filepath: string;
  created_at: string;
  likeCount: number;
  userLiked: number;
}

interface HomeProps {
  onNavigateFriends: () => void;
  onNavigateProfile: () => void;
}

export default function Home({ onNavigateFriends, onNavigateProfile }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout, currentUser } = useAuth();
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
  
      const sortedPosts = response.data.sort(
        (a: Post, b: Post) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  
      setPosts(sortedPosts);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('media', file);

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFile(null);
      fetchPosts();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to upload file');
    } finally {
      setLoading(false);
      setPreviewUrl(null);

    }
  };

  const handleLike = async (postId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, userLiked: 1, likeCount: post.likeCount + 1 }
          : post
      )
    );
  
    try {
      await api.post('/likes/like', { postId });
    } catch (error: any) {
      // Revert UI if failed
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, userLiked: 0, likeCount: post.likeCount - 1 }
            : post
        )
      );
      setError(error.response?.data?.error || 'Failed to like post');
    }
  };
  

  const handleUnlike = async (postId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, userLiked: 0, likeCount: post.likeCount - 1 }
          : post
      )
    );
  
    try {
      await api.post('/likes/unlike', { postId });
    } catch (error: any) {
      // Revert UI if failed
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, userLiked: 1, likeCount: post.likeCount + 1 }
            : post
        )
      );
      setError(error.response?.data?.error || 'Failed to unlike post');
    }
  };
  
  const handleDeletePost = async (postId: number) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
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
                <span className="text-white text-lg">📷</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MediaShare
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onNavigateFriends}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm"
              >
                <span>👥</span>
                <span>Friends</span>
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

        {/* Upload Section */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-sm">📤</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Share Your Moment</h2>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] || null;
                setFile(selectedFile);
                if (selectedFile) {
                  setPreviewUrl(URL.createObjectURL(selectedFile));
                } else {
                  setPreviewUrl(null);
                }
              }}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors duration-200 cursor-pointer"
            />
            {previewUrl && (
            <div className="mt-4">
              {file?.type.startsWith('video') ? (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-64 object-cover rounded-xl border"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl border"
                />
              )}
            </div>
          )}

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-gray-400 text-2xl mb-2 block">📷</span>
                  <p className="text-gray-500 text-sm">
                    {file ? file.name : 'Click to select an image or video'}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm font-medium"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>📤</span>
                  <span>Share Post</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Posts Section */}
        {loading && posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-500 text-lg">Loading your feed...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{post.user_email}</div>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <span>📅</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Content */}
                <div className="relative">
                  {post.filepath.endsWith('.mp4') ? (
                    <video
                      src={`http://localhost:5000/uploads/${post.filepath}`}
                      controls
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    <img
                        src={`http://localhost:5000/uploads/${post.filepath}`}
                        alt="media"
                        className="w-full h-80 object-cover cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setFullscreenImage(`http://localhost:5000/uploads/${post.filepath}`)}
                      />
                  )}
                  <div className="absolute top-3 right-3">
                    {post.filepath.endsWith('.mp4') ? (
                      <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-xs flex items-center space-x-1">
                        <span>🎥</span>
                        <span>Video</span>
                      </div>
                    ) : (
                      <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-xs flex items-center space-x-1">
                        <span>📷</span>
                        <span>Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => post.userLiked > 0 ? handleUnlike(post.id) : handleLike(post.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                          post.userLiked > 0 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span>{post.userLiked > 0 ? '❤️' : '🤍'}</span>
                        <span>{post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}</span>
                      </button>
                    </div>
                    {currentUser?.id === post.user_id && (
                    <button
                    onClick={() => {
                      const confirmed = window.confirm('Are you sure you want to delete this post?');
                      if (confirmed) {
                        handleDeletePost(post.id);
                      }
                    }}
                    className="text-sm text-red-500 hover:text-red-700 px-3 py-1 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200"
                  >
                    🗑 Delete
                  </button>
                  )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-3xl">📷</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-gray-500">Be the first to share something amazing!</p>
          </div>
        )}
        </div>
          {fullscreenImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
              onClick={() => setFullscreenImage(null)}
            >
              <img
                src={fullscreenImage}
                alt="fullscreen"
                className="max-w-full max-h-full object-contain"
              />
              <button
                className="absolute top-4 right-4 text-white text-3xl"
                onClick={() => setFullscreenImage(null)}
              >
                ✖
              </button>
            </div>
          )}

      </div>
    
  );
  
}
