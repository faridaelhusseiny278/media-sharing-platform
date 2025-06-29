class Post {
  final int id;
  final int userId;
  final String filepath;
  final DateTime createdAt;
  final String userEmail; // Optional field, can be null
  final int likeCount; // Optional field, can be null
  final int userLiked; // Optional field, can be null

  Post({
    required this.id,
    required this.userId,
    required this.filepath,
    required this.createdAt,
    required this.userEmail,  // Default to empty string if not provided
    required this.likeCount,  // Default to 0 if not provided
    required this.userLiked // Default to false if not provided
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'],
      userId: json['user_id'],
      filepath: json['filepath'],
      createdAt: DateTime.parse(json['created_at']),
      userEmail: json['user_email'], // Optional field
      likeCount: json['likeCount'], // Optional field
      userLiked: json['userLiked'] // Optional field
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'filepath': filepath,
      'created_at': createdAt.toIso8601String(),
      'user_email': userEmail, // Optional field
      'likeCount': likeCount, // Optional field
      'userLiked': userLiked, // Optional field
    };
  }
}
