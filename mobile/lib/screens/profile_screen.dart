import 'package:flutter/material.dart';
import 'package:media_sharing_app/models/post.dart';
import 'package:media_sharing_app/services/post_service.dart';
import 'package:media_sharing_app/widgets/post_card.dart';
import 'package:media_sharing_app/services/like_service.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback onNavigateHome;
  final VoidCallback onNavigateFriends;
  final VoidCallback onLogout;


  const ProfileScreen({
    super.key,
    required this.onNavigateHome,
    required this.onNavigateFriends,
    required this.onLogout,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final PostService postService = PostService();
  final LikeService likeService = LikeService();

  List<Post> posts = [];
  bool isLoading = false;
  String error = '';
  String activeTab = 'posts'; // 'posts' or 'liked'

  int totalPosts = 0;
  int totalLikes = 0;
  int totalLikedPosts = 0;

  @override
  void initState() {
    super.initState();
    fetchUserPosts();
    fetchLikedPosts();
  }

  Future<void> fetchUserPosts() async {
    setState(() {
      isLoading = true;
      error = '';
    });

    try {
      final data = await postService.getMyPosts();
      // Assuming stats are not available from getMyPosts() anymore.
      setState(() {
        posts = data;
        totalPosts = data.length;
        totalLikes = data.fold(0, (sum, post) => sum + post.likeCount);
      });
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> fetchLikedPosts({bool updateList = false}) async {
    try {
      final data = await postService.getLikedPosts();
      setState(() {
        totalLikedPosts = data.length;
        if (updateList) {
          posts = data;
        }
      });
    } catch (e) {
      setState(() => error = e.toString());
    }
  }


  void toggleTab(String tab) {
    if (tab == activeTab) return;

    setState(() {
      activeTab = tab;
    });

    if (tab == 'posts') {
      fetchUserPosts();
    } else {
      fetchLikedPosts(updateList: true);
    }
  }

  void logout() {
    widget.onLogout(); // ← this triggers the actual logout logic from parent
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("My Profile"),
        actions: [
          IconButton(onPressed: widget.onNavigateHome, icon: const Icon(Icons.home)),
          IconButton(onPressed: widget.onNavigateFriends, icon: const Icon(Icons.people)),
          IconButton(onPressed: logout, icon: const Icon(Icons.logout)),
        ],
      ),
      body: Column(
        children: [
          if (error.isNotEmpty)
            Container(
              color: Colors.red[50],
              padding: const EdgeInsets.all(8),
              child: Text(error, style: const TextStyle(color: Colors.red)),
            ),
          _buildStats(),
          _buildTabBar(),
          Expanded(child: _buildPostList()),
        ],
      ),
    );
  }

  Widget _buildStats() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _statCard("📝", "Posts", totalPosts),
          _statCard("❤️", "Likes", totalLikes),
          _statCard("👍", "Liked", totalLikedPosts),
        ],
      ),
    );
  }

  Widget _statCard(String emoji, String label, int value) {
    return Column(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 28)),
        const SizedBox(height: 4),
        Text(value.toString(), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }

  Widget _buildTabBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Row(
        children: [
          _tabButton('posts', "📝 My Posts ($totalPosts)"),
          const SizedBox(width: 8),
          _tabButton('liked', "❤️ Liked Posts ($totalLikedPosts)"),
        ],
      ),
    );
  }

  Widget _tabButton(String tab, String label) {
    final isSelected = tab == activeTab;
    return Expanded(
      child: TextButton(
        onPressed: () => toggleTab(tab),
        style: TextButton.styleFrom(
          backgroundColor: isSelected ? Colors.purple[100] : Colors.grey[200],
          foregroundColor: isSelected ? Colors.purple : Colors.black,
        ),
        child: Text(label, textAlign: TextAlign.center),
      ),
    );
  }

  Widget _buildPostList() {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (posts.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(activeTab == 'posts' ? "📝 No posts yet" : "❤️ No liked posts"),
            const SizedBox(height: 8),
            if (activeTab == 'posts')
              ElevatedButton(
                onPressed: widget.onNavigateHome,
                child: const Text("Create Post"),
              ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: posts.length,
      itemBuilder: (context, index) => PostCard(
        post: posts[index],
        onLikeToggle: () async {
          try {
            await likeService.likePost(posts[index].id);
            if (activeTab == 'posts') {
              fetchUserPosts();
            } else {
              fetchLikedPosts();
            }
          } catch (e) {
            setState(() => error = "Failed to toggle like");
          }
        },
        onDelete: activeTab == 'posts'
            ? () async {
          try {
            await postService.deletePost(posts[index].id);
            fetchUserPosts(); // refresh
          } catch (e) {
            setState(() => error = "Failed to delete post");
          }
        }
            : null, // disable delete button in liked tab
      ),
    );
  }
}
