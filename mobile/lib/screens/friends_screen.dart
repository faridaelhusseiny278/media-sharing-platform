import 'package:flutter/material.dart';
import 'package:media_sharing_app/services/friend_service.dart';
import 'package:media_sharing_app/models/user.dart';


class FriendsScreen extends StatefulWidget {
  final VoidCallback onNavigateHome;
  final VoidCallback onNavigateProfile;
  final VoidCallback onLogout;

  const FriendsScreen({super.key,
    required this.onNavigateHome,
    required this.onNavigateProfile,
    required this.onLogout});

  @override
  State<FriendsScreen> createState() => _FriendsScreenState();
}

class _FriendsScreenState extends State<FriendsScreen> {
  List<User> friends = [];
  List<User> searchResults = [];
  String searchQuery = '';
  bool loading = false;
  String error = '';
  String activeTab = 'friends';

  final TextEditingController searchController = TextEditingController();
  final friendService = FriendService();

  @override
  void initState() {
    super.initState();
    fetchFriends();
  }

  Future<void> fetchFriends() async {
    setState(() {
      loading = true;
      error = '';
    });
    try {
      final result = await friendService.getFriends();
      setState(() => friends = result);
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> searchUsers(String query) async {
    if (query.trim().isEmpty) {
      setState(() => searchResults = []);
      return;
    }
    try {
      final results = await friendService.searchUsers(query);
      setState(() => searchResults = results);
    } catch (e) {
      setState(() => error = 'Search failed: $e');
    }
  }


  Future<void> getAllUsers() async {
    try {
      final results = await friendService.getAllUsers();
      setState(() => searchResults = results);
    } catch (e) {
      setState(() => error = 'Failed to load users: $e');
    }
  }

  Future<void> addFriend(String email) async {
    try {
      await friendService.addFriend(email);
      await fetchFriends();
      if (searchQuery.isNotEmpty) {
        await searchUsers(searchQuery);
      } else {
        await getAllUsers();
      }
    } catch (e) {
      setState(() => error = 'Add friend failed: $e');
    }
  }

  Future<void> removeFriend(int friendId) async {
    try {
      await friendService.removeFriend( friendId);
      await fetchFriends();
    } catch (e) {
      setState(() => error = 'Remove friend failed: $e');
    }
  }

  Widget buildFriendCard(User friend) {
    return Card(
      child: ListTile(
        leading: const CircleAvatar(child: Icon(Icons.person)),
        title: Text(friend.email),
        // subtitle: Text('Friend since ${friend.createdAtFormatted}'),
        trailing: IconButton(
          icon: const Icon(Icons.person_remove),
          onPressed: () => removeFriend(friend.id),
        ),
      ),
    );
  }

  Widget buildUserCard(User user) {
    return Card(
      child: ListTile(
        leading: const CircleAvatar(child: Icon(Icons.person_add)),
        title: Text(user.email),
        // subtitle: Text('Joined ${user.createdAtFormatted}'),
        trailing: IconButton(
          icon: const Icon(Icons.person_add_alt),
          onPressed: () => addFriend(user.email),
        ),
      ),
    );
  }

  Widget buildFriendsList() {
    if (loading) return const Center(child: CircularProgressIndicator());
    if (friends.isEmpty) return const Center(child: Text('You have no friends yet.'));
    return ListView.builder(
      itemCount: friends.length,
      itemBuilder: (context, index) => buildFriendCard(friends[index]),
    );
  }

  Widget buildSearchTab() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(12),
          child: TextField(
            controller: searchController,
            onChanged: (val) {
              setState(() => searchQuery = val);
              searchUsers(val);
            },
            decoration: InputDecoration(
              hintText: 'Search by email',
              suffixIcon: IconButton(
                icon: const Icon(Icons.clear),
                onPressed: () {
                  searchController.clear();
                  setState(() {
                    searchQuery = '';
                    getAllUsers(); // Refresh all users on clear
                  });
                },
              ),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
        ),
        Expanded(
          child: searchResults.isEmpty
              ? const Center(child: Text('No users found.'))
              : ListView.builder(
            itemCount: searchResults.length,
            itemBuilder: (context, index) => buildUserCard(searchResults[index]),
          ),
        ),
      ],
    );
  }


  @override
  Widget build(BuildContext context) {
    final isFriendsTab = activeTab == 'friends';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Friends'),
        actions: [
          IconButton(
            icon: const Icon(Icons.home),
            onPressed: widget.onNavigateHome,
          ),
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: widget.onNavigateProfile,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: widget.onLogout,
          ),
        ],
      ),

      body: Column(
        children: [
          ToggleButtons(
            isSelected: [isFriendsTab, !isFriendsTab],
            onPressed: (index) {
            setState(() {
            activeTab = index == 0 ? 'friends' : 'search';
            });
            if (index == 1 && searchQuery.isEmpty && searchResults.isEmpty) {
              getAllUsers();
            }
            },
            children: const [
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Text('My Friends'),
              ),
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Text('Find Friends'),
              ),
            ],
          ),
          if (error.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(error, style: const TextStyle(color: Colors.red)),
            ),
          Expanded(
            child: isFriendsTab ? buildFriendsList() : buildSearchTab(),
          ),
        ],
      ),
    );
  }
}
