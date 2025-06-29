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
      final List<dynamic> postsJson = data['posts'];

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

  Future<void> deletePost(int postId) async {
    print('Dropping post with ID: $postId');
    final response = await api.delete('/posts/$postId');

    print('Delete response status: ${response.statusCode}');

    if (response.statusCode != 200) {
      throw Exception('Failed to delete post');
    }
  }

  // Future<bool> isMine(int postId) async {
  //   final response = await api.get('/posts/is-mine/$postId');
  //   if (response.statusCode == 200) {
  //     final data = json.decode(response.body);
  //     return data['isMine'] ?? false;
  //   } else {
  //     throw Exception('Failed to check ownership of post');
  //   }
  // }


}
