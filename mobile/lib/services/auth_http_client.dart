// services/api_client.dart
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'dart:io';
import 'package:media_sharing_app/config.dart';


class ApiClient {
final String baseUrl = globalBaseUrl + '/api';

  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<http.Response> get(String path) async {
    final headers = await _getHeaders();
    return http.get(Uri.parse('$baseUrl$path'), headers: headers);
  }

  Future<http.Response> post(String path, dynamic body) async {
    final headers = await _getHeaders();
    return http.post(
      Uri.parse('$baseUrl$path'),
      headers: headers,
      body: body != null ? jsonEncode(body) : null,
    );
  }

  Future<http.Response> delete(String path) async {
    final headers = await _getHeaders();
    return http.delete(Uri.parse('$baseUrl$path'), headers: headers);
  }

  Future<http.StreamedResponse> uploadFile(
      String endpoint,
      Map<String, String> fields,
      File file,
      String fieldName,
      ) async
  {
    final uri = Uri.parse('$baseUrl$endpoint');
    final request = http.MultipartRequest('POST', uri);

    // add the token in the headers
    final headers = await _getHeaders();
    request.headers.addAll(headers);
    request.fields.addAll(fields);
    request.files.add(await http.MultipartFile.fromPath(fieldName, file.path));
    return await request.send();
  }

}
