import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../models/user.dart'; // if User model exists

class RegisterPage extends StatefulWidget {
  final VoidCallback onRegister;
  final VoidCallback onSwitchToLogin;

  const RegisterPage({
    super.key,
    required this.onRegister,
    required this.onSwitchToLogin,
  });

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();

  String? error;
  bool loading = false;

  final AuthService _userService = AuthService();

  Future<void> handleRegister() async {
    setState(() {
      error = null;
    });

    if (passwordController.text != confirmPasswordController.text) {
      setState(() => error = "Passwords do not match");
      return;
    }

    if (passwordController.text.length < 6) {
      setState(() => error = "Password must be at least 6 characters");
      return;
    }

    setState(() => loading = true);

    try {
      final user = await _userService.register(
        emailController.text.trim(),
        passwordController.text,
      );

      if (user != null) {
        widget.onRegister(); // Go to login or home screen
      } else {
        setState(() => error = "Registration failed. Please try again.");
      }
    } catch (e) {
      setState(() => error = 'Error: ${e.toString()}');
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const Text(
                "Create your account",
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 24),
              TextField(
                controller: emailController,
                decoration: const InputDecoration(labelText: "Email address", border: OutlineInputBorder()),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: passwordController,
                obscureText: true,
                decoration: const InputDecoration(labelText: "Password", border: OutlineInputBorder()),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: confirmPasswordController,
                obscureText: true,
                decoration: const InputDecoration(labelText: "Confirm Password", border: OutlineInputBorder()),
              ),
              if (error != null) ...[
                const SizedBox(height: 16),
                Text(error!, style: const TextStyle(color: Colors.red)),
              ],
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: loading ? null : handleRegister,
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                  backgroundColor: Colors.indigo,
                ),
                child: loading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Create Account"),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: widget.onSwitchToLogin,
                child: const Text("Already have an account? Sign in"),
              )
            ],
          ),
        ),
      ),
    );
  }
}
