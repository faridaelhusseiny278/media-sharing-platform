import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../models/post.dart';
import '../services/post_service.dart';
import '../services/like_service.dart';
import 'package:video_player/video_player.dart';
import '../widgets/video_player.dart';

class HomePage extends StatefulWidget {
  final VoidCallback onNavigateFriends;
  final VoidCallback onNavigateProfile;
  final VoidCallback onLogout;

  const HomePage({
    super.key,
    required this.onNavigateFriends,
    required this.onNavigateProfile,
    required this.onLogout,
  });

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final postService = PostService();
  final likeService = LikeService();


  List<Post> posts = [];
  List<int> myPostIds = [];
  File? selectedFile;
  bool loading = false;
  String error = '';
  bool isMine = false;


  @override
  void initState() {
    super.initState();
    fetchPosts();
  }


  Future<void> fetchPosts() async {
    setState(() {
      loading = true;
      error = '';
    });
    try {
      final data = await postService.fetchPosts();
      final myPosts = await postService.getMyPosts();
      setState(() {
        posts = data;
        myPostIds = myPosts.map((post) => post.id).toList();
        print('My post IDs: $myPostIds');
      });
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => loading = false);
    }
  }


  Future<void> handleDelete(Post post) async {
    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Are you sure?'),
        content: const Text('This post will be permanently deleted.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (shouldDelete == true) {
      try {
        await postService.deletePost(post.id);
        fetchPosts();
      } catch (e) {
        setState(() => error = e.toString());
      }
    }
  }


  Future<void> pickFile() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      setState(() => selectedFile = File(picked.path));
    }
  }

  Future<void> handleUpload() async {
    if (selectedFile == null) return;
    setState(() => loading = true);
    try {
      await postService.createPost(selectedFile!);
      selectedFile = null;
      fetchPosts();
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> toggleLike(Post post) async {
    try {
      // print post.userLiked
      print('post.userLiked: ${post.userLiked}');
      // print the type of post.userLiked
      print('post.userLiked type: ${post.userLiked.runtimeType}');
      // first convert userliked to int
      if (post.userLiked == 1)
      {
        await likeService.unlikePost(post.id);
      } else {
        await likeService.likePost(post.id);
      }
      fetchPosts();
    } catch (e) {
      setState(() => error = e.toString());
    }
  }

  String formatDate(String dateStr) {
    final date = DateTime.parse(dateStr);
    final now = DateTime.now();
    final diff = now.difference(date).inHours;
    if (diff < 1) return 'Just now';
    if (diff < 24) return '${diff}h ago';
    if (diff < 48) return 'Yesterday';
    return '${date.month}/${date.day}/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('MediaShare'),
        actions: [
          IconButton(icon: const Icon(Icons.group), onPressed: widget.onNavigateFriends),
          IconButton(icon: const Icon(Icons.person), onPressed: widget.onNavigateProfile),
          IconButton(icon: const Icon(Icons.logout), onPressed: widget.onLogout),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            if (error.isNotEmpty)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(error, style: const TextStyle(color: Colors.red)),
              ),

            const SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: pickFile,
              icon: const Icon(Icons.attach_file),
              label: Text(selectedFile != null ? 'Change File' : 'Pick File'),
            ),
            const SizedBox(height: 8),
            if (selectedFile != null)
              ElevatedButton.icon(
                onPressed: loading ? null : handleUpload,
                icon: loading
                    ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
                    : const Icon(Icons.upload),
                label: const Text('Upload'),
              ),

            const SizedBox(height: 24),
            if (loading && posts.isEmpty)
              const Center(child: CircularProgressIndicator()),

            ...posts.map((post) => Card(
              margin: const EdgeInsets.only(bottom: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ListTile(
                    leading: const CircleAvatar(child: Icon(Icons.person)),
                    title: Text(post.userEmail),
                    subtitle: Text(formatDate(post.createdAt.toString())),
                    trailing: myPostIds.contains(post.id)
                        ? IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: () => handleDelete(post),
                    )
                        : null,
                  ),
                  post.filepath.endsWith('.mp4')
                      ? VideoPlayerWidget(url: 'http://192.168.100.6:5000/uploads/${post.filepath}')
                      : Image.network(
                    'http://192.168.100.6:5000/uploads/${post.filepath}',
                    height: 200,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton.icon(
                        onPressed: () => toggleLike(post),
                        icon: Icon(
                          post.userLiked == 1 ? Icons.favorite : Icons.favorite_border,
                          color: post.userLiked == 1 ? Colors.red : null,
                        ),
                        label: Text('${post.likeCount} likes'),
                      ),
                    ],
                  ),
                ],
              ),
            )),

          ],
        ),
      ),
    );
  }
}
