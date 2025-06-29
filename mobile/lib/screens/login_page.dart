import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class LoginPage extends StatefulWidget {
  final Function() onLogin;
  final VoidCallback onSwitchToRegister;

  const LoginPage({
    super.key,
    required this.onLogin,
    required this.onSwitchToRegister,
  });

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final AuthService _authService = AuthService();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool loading = false;
  String? error;

  Future<void> handleLogin() async {
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final user = await _authService.login(
        emailController.text.trim(),
        passwordController.text.trim(),
      );

      if (user != null) {
        widget.onLogin();
      } else {
        setState(() {
          error = user == null
              ? 'Invalid email or password'
              : 'Login failed';
        });
      }
    } catch (e) {
      setState(() {
        error = 'Login failed: ${e.toString()}';
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                "Sign in to your account",
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 24),
              TextField(
                controller: emailController,
                decoration: const InputDecoration(
                  labelText: "Email address",
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: "Password",
                  border: OutlineInputBorder(),
                ),
              ),
              if (error != null) ...[
                const SizedBox(height: 16),
                Text(
                  error!,
                  style: const TextStyle(color: Colors.red),
                ),
              ],
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: loading ? null : handleLogin,
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                  backgroundColor: Colors.indigo,
                ),
                child: loading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Sign in"),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: widget.onSwitchToRegister,
                child: const Text(
                  "Don't have an account? Sign up",
                  style: TextStyle(color: Colors.indigo),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
