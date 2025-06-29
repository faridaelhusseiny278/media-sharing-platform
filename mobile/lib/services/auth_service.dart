import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';
import 'auth_http_client.dart';
import '../models/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final ApiClient api = ApiClient();

  Future<User?> login(String email, String password) async {
    final response = await api.post('/users/login', {
      'email': email,
      'password': password,
    });

    if (response.statusCode != 200) return null;

    final data = json.decode(response.body);
    final token = data['token'];
    if (token == null) return null;

    // Save token
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);

    // Get user data
    final userResponse = await api.get('/users/email');
    if (userResponse.statusCode != 200) return null;

    final userData = json.decode(userResponse.body);
    return User.fromJson({
      'id': userData['id'],
      'email': userData['email'],
      'token': token,
    });
  }

  Future<User?> register(String email, String password) async {
    final response = await api.post('/users/register', {
      'email': email,
      'password': password,
    });

    if (response.statusCode == 201) {
      return await login(email, password); // Reuse login
    }
    return null;
  }

  Future<User> getUserProfile() async {
    final response = await api.get('/users/profile');

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return User.fromJson(data);
    } else {
      throw Exception('Failed to load user profile');
    }
  }
}

