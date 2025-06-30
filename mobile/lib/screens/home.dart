import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../models/post.dart';
import '../services/post_service.dart';
import '../services/like_service.dart';
import 'package:video_player/video_player.dart';
import '../widgets/video_player.dart';
import 'package:file_picker/file_picker.dart';
import 'package:image/image.dart' as img;
import 'package:path/path.dart' as path;
import 'package:permission_handler/permission_handler.dart';
import 'package:path_provider/path_provider.dart';
import 'package:media_sharing_app/widgets/post_card.dart';
import 'package:media_sharing_app/main.dart';

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
  State<HomePage> createState() => HomePageState();
}

class HomePageState extends State<HomePage> with RouteAware {

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

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    routeObserver.subscribe(this, ModalRoute.of(context)!);
  }

  @override
  void dispose() {
    routeObserver.unsubscribe(this);
    super.dispose();
  }
  @override
  void didPopNext() {
    // Called when returning to this page (e.g., via back button)
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

      data.sort((a, b) => b.createdAt.compareTo(a.createdAt));

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
    try {
      await postService.deletePost(post.id);
      fetchPosts();
    } catch (e) {
      setState(() => error = e.toString());
    }
  }


  Future<File> compressImage(File file) async {
    final bytes = await file.readAsBytes();
    final image = img.decodeImage(bytes);
    final resized = img.copyResize(image!, width: 800);

    final dir = await getTemporaryDirectory();
    final newPath = path.join(dir.path, 'compressed_${DateTime.now().millisecondsSinceEpoch}.jpg');
    final compressed = File(newPath)..writeAsBytesSync(img.encodeJpg(resized, quality: 85));
    return compressed;
  }



  Future<void> pickFile() async {
    final status = Platform.isAndroid
        ? await Permission.storage.request()
        : await Permission.photos.request();

    if (!status.isGranted) {
      setState(() => error = 'Permission denied.');
      return;
    }

    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'avi', 'webm'],
    );

    if (result != null && result.files.isNotEmpty) {
      final picked = result.files.single;
      final file = File(picked.path!);
      final extension = picked.extension?.toLowerCase();

      File fileToUpload;
      if (extension == 'jpg' || extension == 'jpeg' || extension == 'png') {
        final compressed = await compressImage(file);
        fileToUpload = compressed;
      } else if (['mp4', 'mov', 'avi', 'webm'].contains(extension)) {
        fileToUpload = file;
      } else {
        setState(() => error = 'Unsupported file type: $extension');
        return;
      }

      setState(() {
        selectedFile = fileToUpload;
      });

      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('Preview File'),
          content: (extension == 'jpg' || extension == 'jpeg' || extension == 'png')
              ? Image.file(fileToUpload)
              : VideoPlayerWidget(file: fileToUpload),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.of(context).pop();
                handleUpload(); // Make sure it handles video uploads
              },
              icon: const Icon(Icons.upload),
              label: const Text('Upload'),
            ),
          ],
        ),
      );
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
          IconButton(icon: const Icon(Icons.group), onPressed: () async {
             widget.onNavigateFriends();
             fetchPosts();

          }),
          IconButton(icon: const Icon(Icons.person), onPressed: () {
            widget.onNavigateProfile();
            fetchPosts();
          }),
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

            ...posts.map((post) => PostCard(
              key: ValueKey(post.id),
              post: post,
              onLikeToggle: () => toggleLike(post),
              onDelete: myPostIds.contains(post.id) ? () => handleDelete(post) : null,
              showDelete: myPostIds.contains(post.id),
              userEmail: post.userEmail,
            )),


          ],
        ),
      ),
    );
  }
}