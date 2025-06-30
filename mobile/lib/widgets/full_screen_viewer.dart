import 'dart:io';
import 'package:flutter/material.dart';
import 'package:media_sharing_app/widgets/video_player.dart';

class FullScreenViewer extends StatelessWidget {
  final File? mediaFile;
  final String? imageUrl;
  final bool isVideo;

  const FullScreenViewer({
    super.key,
    this.mediaFile,
    this.imageUrl,
    required this.isVideo,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Center(
        child: isVideo
            ? VideoPlayerWidget(file: mediaFile!)
            : InteractiveViewer(
          child: Image.network(
            imageUrl!,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) =>
            const Text("Failed to load media", style: TextStyle(color: Colors.white)),
          ),
        ),
      ),
    );
  }
}

