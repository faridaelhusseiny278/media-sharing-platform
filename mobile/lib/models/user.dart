class User {
  final int id;
  final String email;
  final String? password; // Optional if not returned from API
  final String token; // Optional, if you want to store auth token
  User({required this.id, required this.email, this.password, this.token = ''});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      password: json['password'], // Might be null or omitted
      token: json['token'] ?? '', // Optional token, default to empty string
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      if (password != null) 'password': password,
      if (token.isNotEmpty) 'token': token, // Include token only if it's not empty
    };
  }
}
