import 'dart:io';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';

class VideoPlayerWidget extends StatefulWidget {
  final File? file;
  final String? url; // Now supports both File and Network

  const VideoPlayerWidget({Key? key, this.file, this.url})
      : assert(file != null || url != null, 'Either file or url must be provided.'),
        super(key: key);

  @override
  _VideoPlayerWidgetState createState() => _VideoPlayerWidgetState();
}

class _VideoPlayerWidgetState extends State<VideoPlayerWidget> {
  VideoPlayerController? _videoPlayerController;
  ChewieController? _chewieController;

  @override
  void initState() {
    super.initState();
    _initializePlayer();
  }

  Future<void> _initializePlayer() async {
    try {
      if (widget.file != null) {
        _videoPlayerController = VideoPlayerController.file(widget.file!);
      } else if (widget.url != null) {
        _videoPlayerController = VideoPlayerController.network(widget.url!);
      }

      await _videoPlayerController!.initialize();
      _chewieController = ChewieController(
        videoPlayerController: _videoPlayerController!,
        autoPlay: false,
        looping: true,
      );
      if (mounted) setState(() {});
    } catch (e) {
      debugPrint('Video initialization error: $e');
    }
  }

  @override
  void dispose() {
    _videoPlayerController?.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_chewieController != null &&
        _videoPlayerController != null &&
        _videoPlayerController!.value.isInitialized) {
      return Chewie(controller: _chewieController!);
    } else {
      return const SizedBox(
        height: 200,
        child: Center(child: CircularProgressIndicator()),
      );
    }
  }
}
