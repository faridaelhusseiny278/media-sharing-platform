import 'package:flutter/material.dart';
import 'package:media_sharing_app/models/post.dart';
import 'package:media_sharing_app/widgets/video_player.dart';

class PostCard extends StatelessWidget {
  final Post post;
  final VoidCallback onLikeToggle;
  final VoidCallback? onDelete;

  const PostCard({
    super.key,
    required this.post,
    required this.onLikeToggle,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final bool isVideo = post.filepath.endsWith('.mp4'); // basic detection

    return Card(
      elevation: 3,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Column(

        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Display image or placeholder for video
          isVideo
              ? VideoPlayerWidget(url: 'http://192.168.100.6:5000/uploads/${post.filepath}')
              : Image.network(
            'http://192.168.100.6:5000/uploads/${post.filepath}',
            width: double.infinity,
            height: 200,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) => Container(
              color: Colors.grey[300],
              height: 200,
              alignment: Alignment.center,
              child: const Text("Failed to load media"),
            ),
          ),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(
                    post.userLiked==1 ? Icons.favorite : Icons.favorite_border,
                    color: post.userLiked==1 ? Colors.red : Colors.grey,
                  ),
                  onPressed: onLikeToggle,
                ),
                const SizedBox(width: 4),
                Text('${post.likeCount} likes'),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(
              'Posted at ${post.createdAt.toLocal().toString().substring(0, 16)}',
              style: const TextStyle(color: Colors.grey, fontSize: 12),
            ),
          ),
          const SizedBox(height: 8),
          if (onDelete != null)
            Padding(
              padding: const EdgeInsets.only(left: 12, bottom: 8),
              child: TextButton.icon(
                onPressed: () async {
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
                    onDelete!();
                  }
                },
                icon: const Icon(Icons.delete, color: Colors.red),
                label: const Text("Delete", style: TextStyle(color: Colors.red)),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildVideoPlaceholder() {
    return Container(
      width: double.infinity,
      height: 200,
      color: Colors.black87,
      alignment: Alignment.center,
      child: const Icon(Icons.videocam, color: Colors.white, size: 60),
    );
  }
}
