import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:media_sharing_app/models/post.dart';
import 'package:media_sharing_app/widgets/video_player.dart';
import 'package:media_sharing_app/widgets/full_screen_viewer.dart';

class PostCard extends StatefulWidget {
  final Post post;
  final VoidCallback onLikeToggle;
  final VoidCallback? onDelete;
  final bool showDelete;
  final String userEmail;

  const PostCard({
    super.key,
    required this.post,
    required this.onLikeToggle,
    this.onDelete,
    required this.showDelete,
    required this.userEmail,
  });

  @override
  State<PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<PostCard> {
  File? _videoFile;
  bool _isLoadingVideo = false;
  final String baseUrl = 'http://192.168.100.6:5000/uploads/';

  @override
  void initState() {
    super.initState();
    if (widget.post.filepath.endsWith('.mp4') ||
        widget.post.filepath.endsWith('.mov') ||
        widget.post.filepath.endsWith('.avi'))
    {
      _downloadVideo();
    }
  }
  Future<void> _downloadVideo() async {
    if (!mounted) return; // safety before starting

    setState(() => _isLoadingVideo = true);
    final url = Uri.parse('$baseUrl${widget.post.filepath}');
    final response = await http.get(url);

    if (!mounted) return; // check again after async operation

    if (response.statusCode == 200) {
      final dir = await getTemporaryDirectory();
      final filePath = '${dir.path}/${widget.post.filepath}';
      final file = File(filePath);
      await file.writeAsBytes(response.bodyBytes);

      if (!mounted) return;

      setState(() {
        _videoFile = file;
        _isLoadingVideo = false;
      });
    } else {
      if (!mounted) return;
      print('Failed to fetch video. Status code: ${response.statusCode}');
      print('URL tried: $url');
      setState(() => _isLoadingVideo = false);
    }
    }

  @override
  void didUpdateWidget(PostCard oldWidget) {
    super.didUpdateWidget(oldWidget);

    // Only re-download if it's a different video post
    if (widget.post.filepath != oldWidget.post.filepath &&
        widget.post.filepath.endsWith('.mp4') || widget.post.filepath.endsWith('.mov') || widget.post.filepath.endsWith('.avi')) {
      _downloadVideo();
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool isVideo = widget.post.filepath.endsWith('.mp4') || widget.post.filepath.endsWith('.mov')  || widget.post.filepath.endsWith('.avi');

    return Card(
      elevation: 3,
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// 👤 User info
          ListTile(
            leading: const CircleAvatar(child: Icon(Icons.person)),
            title: Text(widget.userEmail),
            subtitle: Text(
              widget.post.createdAt.toLocal().toString().substring(0, 16),
              style: const TextStyle(fontSize: 12),
            ),
            trailing: widget.showDelete
                ? IconButton(
              icon: const Icon(Icons.delete, color: Colors.red),
              onPressed: () async {
                final shouldDelete = await showDialog<bool>(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Are you sure?'),
                    content: const Text('This post will be permanently deleted.'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                      TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete', style: TextStyle(color: Colors.red))),
                    ],
                  ),
                );
                if (shouldDelete == true && widget.onDelete != null) {
                  widget.onDelete!();
                }
              },
            )
                : null,
          ),

          /// 📸 or 📹 Media preview
          GestureDetector(
            onTap: () {
              if (isVideo && _videoFile != null) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => FullScreenViewer(
                      mediaFile: _videoFile!,
                      isVideo: true,
                    ),
                  ),
                );
              } else {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => FullScreenViewer(
                      isVideo: false,
                      imageUrl: '$baseUrl${widget.post.filepath}',
                    ),
                  ),
                );
              }
            },
            child: isVideo
                ? (_isLoadingVideo
                ? const SizedBox(height: 200, child: Center(child: CircularProgressIndicator()))
                : (_videoFile != null
                ? SizedBox(
              height: 200,
              width: double.infinity,
              child: VideoPlayerWidget(file: _videoFile!),
            )
                : const SizedBox(
              height: 200,
              child: Center(child: Text('Failed to load video')),
            )))
                : Image.network(
              '$baseUrl${widget.post.filepath}',
              width: double.infinity,
              height: 200,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                color: Colors.grey[300],
                height: 200,
                alignment: Alignment.center,
                child: const Text("Failed to load image"),
              ),
            ),
          ),

          /// ❤️ Likes
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(
                    widget.post.userLiked == 1 ? Icons.favorite : Icons.favorite_border,
                    color: widget.post.userLiked == 1 ? Colors.red : Colors.grey,
                  ),
                  onPressed: widget.onLikeToggle,
                ),
                const SizedBox(width: 4),
                Text('${widget.post.likeCount} likes'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
