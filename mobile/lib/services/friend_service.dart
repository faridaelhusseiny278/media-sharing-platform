import 'dart:convert';
import '../models/user.dart';
import 'package:media_sharing_app/services/auth_http_client.dart';

class FriendService {
  final ApiClient _api = ApiClient();

  Future<List<User>> getFriends() async {
    final response = await _api.get('/friends/list');
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => User.fromJson(e)).toList();
    }
    throw Exception('Failed to load friends');
  }

  Future<void> addFriend(String email) async {
    final response = await _api.post('/friends/add', {
      'friendEmail': email,
    });
    if (response.statusCode != 200) {
      throw Exception('Add friend failed: ${response.body}');
    }
  }

  Future<void> removeFriend(int friendId) async {
    final response = await _api.post('/friends/remove', {
      'friendId': friendId,
    });
    if (response.statusCode != 200) {
      throw Exception('Remove friend failed: ${response.body}');
    }
  }

  Future<List<User>> searchUsers(String query) async {
    final response = await _api.get('/friends/search?query=$query');
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => User.fromJson(e)).toList();
    }
    throw Exception('Search failed');
  }

  Future<List<User>> getAllUsers() async {
    final response = await _api.get('/friends/all-users');
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => User.fromJson(e)).toList();
    }
    throw Exception('Failed to fetch users');
  }
}
