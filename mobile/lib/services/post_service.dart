import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/post.dart';
import 'auth_http_client.dart';

class PostService {
  final ApiClient api = ApiClient();

  Future<List<Post>> fetchPosts() async {
    final response = await api.get('/posts');

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      // print the data for debugging
      print('Fetched posts: $data');
      return data.map((json) => Post.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load posts');
    }
  }

  Future<List<Post>> getMyPosts() async {
    final response = await api.get('/posts/my-posts');

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      final List<dynamic> postsJson = data['posts']; // ✅ extract list from map

      print('Fetched my posts: $postsJson');
      return postsJson.map((json) => Post.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load my posts');
    }
  }

  Future<List<Post>> getLikedPosts() async {
    final response = await api.get('/posts/liked-posts');

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      print('Fetched liked posts: $data');
      return data.map((json) => Post.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load liked posts');
    }
  }

  Future<void> createPost(File file) async {
    final response = await api.uploadFile(
      '/posts',
      {}, // no need to send user_id
      file,
      'media', // backend expects `media` field name
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to upload post');
    }
  }
}
