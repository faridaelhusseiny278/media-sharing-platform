import 'package:flutter/material.dart';
import 'package:media_sharing_app/screens/home.dart';
import 'package:media_sharing_app/screens/login_page.dart';
import 'package:media_sharing_app/screens/friends_screen.dart';
import 'package:media_sharing_app/screens/profile_screen.dart';
import 'package:media_sharing_app/screens/register_page.dart';
final RouteObserver<ModalRoute<void>> routeObserver = RouteObserver<ModalRoute<void>>();



void main() {
  runApp(MediaApp());
}

class MediaApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Media Sharing App',
      theme: ThemeData(
        primarySwatch: Colors.deepPurple,
        scaffoldBackgroundColor: Colors.white,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      debugShowCheckedModeBanner: false,
      navigatorObservers: [routeObserver],
      // ✅ Start with login screen
      initialRoute: '/login',

      routes: {
        '/': (context) => HomePage(
          onNavigateFriends: () async {
            await Navigator.pushNamed(context, '/friends');
          },
          onNavigateProfile: () async {
            await Navigator.pushNamed(context, '/profile');
          },
          onLogout: () => Navigator.pushReplacementNamed(context, '/login'),
        ),

        '/login': (context) => LoginPage(
          onLogin: () {
            // After login, navigate to home
            Navigator.pushReplacementNamed(context, '/');

          },
          onSwitchToRegister: () {
            // Handle switch to register logic here
            // For now, just navigate to home
            Navigator.pushReplacementNamed(context, '/register');
          },
        ),
        '/friends': (context) => FriendsScreen(
          onNavigateHome: () => Navigator.pushNamed(context, '/'),
          onNavigateProfile: () => Navigator.pushNamed(context, '/profile'),
          onLogout: () => Navigator.pushReplacementNamed(context, '/login'),
        ),
        '/profile': (context) => ProfileScreen(
          onNavigateHome: () => Navigator.pushNamed(context, '/'),
          onNavigateFriends: () => Navigator.pushNamed(context, '/friends'),
          onLogout: () => Navigator.pushReplacementNamed(context, '/login'),
        ),
        '/register': (context) {
          // Placeholder for registration screen
          return RegisterPage(
            onRegister: () {
              // After registration, navigate to login
              Navigator.pushReplacementNamed(context, '/login');
            },
            onSwitchToLogin: () {
              // Handle switch to login logic here
              Navigator.pushReplacementNamed(context, '/login');
            },
          );
        },

      },
    );
  }
}
