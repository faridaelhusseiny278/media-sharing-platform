import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:media_sharing_app/services/auth_http_client.dart';

class LikeService {
  final ApiClient _apiClient = ApiClient();

  Future<void> likePost(int postId) async {
    final response = await _apiClient.post('/likes/like', {'postId': postId});

    if (response.statusCode != 200) {
      throw Exception('Failed to like post: ${response.body}');
    }
  }

  Future<void> unlikePost(int postId) async {
    final response = await _apiClient.post('/likes/unlike', {'postId': postId});

    if (response.statusCode != 200) {
      throw Exception('Failed to unlike post: ${response.body}');
    }
  }
}

