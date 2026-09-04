import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/localization.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import 'profile_setup_screen.dart';

class PhoneOtpScreen extends StatefulWidget {
  const PhoneOtpScreen({Key? key}) : super(key: key);

  @override
  State<PhoneOtpScreen> createState() => _PhoneOtpScreenState();
}

class _PhoneOtpScreenState extends State<PhoneOtpScreen> {
  final TextEditingController _phoneController = TextEditingController(text: '9876543210');
  final TextEditingController _otpController = TextEditingController();
  bool _otpSent = false;
  bool _isLoading = false;
  String? _statusMessage;

  Future<void> _handleRequestOtp() async {
    final phone = _phoneController.text.trim();
    if (phone.length < 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid 10-digit phone number')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _statusMessage = null;
    });

    final res = await ApiService.requestOtp('+91$phone');
    setState(() {
      _isLoading = false;
      _otpSent = true;
      _statusMessage = 'OTP Sent! Demo code: ${res['demoOtp'] ?? '123456'}';
      _otpController.text = res['demoOtp'] ?? '123456';
    });
  }

  Future<void> _handleVerifyOtp() async {
    final otp = _otpController.text.trim();
    if (otp.isEmpty) return;

    setState(() => _isLoading = true);
    final res = await ApiService.verifyOtp(
      phone: '+91${_phoneController.text.trim()}',
      otp: otp,
    );
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const ProfileSetupScreen()),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(res['error'] ?? 'Invalid OTP')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = Provider.of<KalaLocalization>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.text('app_title')),
        actions: [
          TextButton.icon(
            onPressed: () => loc.toggleLanguage(),
            icon: const Icon(Icons.language_rounded, color: KalaTheme.terracotta),
            label: Text(
              loc.isHindi ? 'English' : 'हिंदी',
              style: const TextStyle(fontWeight: FontWeight.bold, color: KalaTheme.terracotta),
            ),
          )
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 10),
              Text(
                _otpSent ? loc.text('enter_otp') : loc.text('phone_number'),
                style: const TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: KalaTheme.deepIndigo,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _otpSent ? loc.text('otp_sub') : loc.text('welcome_sub'),
                style: TextStyle(
                  fontSize: 16,
                  color: KalaTheme.deepIndigo.withOpacity(0.7),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 32),

              if (!_otpSent) ...[
                // Phone Number Field
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: KalaTheme.borderSubtle, width: 2),
                  ),
                  child: Row(
                    children: [
                      const Text(
                        '🇮🇳 +91 ',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: KalaTheme.deepIndigo),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextField(
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                          decoration: InputDecoration(
                            hintText: loc.text('phone_hint'),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _isLoading ? null : _handleRequestOtp,
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(loc.text('send_otp')),
                ),
              ] else ...[
                // OTP Field
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: KalaTheme.terracotta, width: 2),
                  ),
                  child: TextField(
                    controller: _otpController,
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 28, letterSpacing: 10, fontWeight: FontWeight.bold),
                    decoration: InputDecoration(
                      hintText: '123456',
                      border: InputBorder.none,
                      hintStyle: TextStyle(letterSpacing: 8, color: Colors.grey.shade400),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: KalaTheme.turmericGold.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.info_outline_rounded, color: KalaTheme.terracottaDark),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _statusMessage ?? loc.text('demo_otp_hint'),
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: KalaTheme.terracottaDark,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _isLoading ? null : _handleVerifyOtp,
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(loc.text('verify_and_login')),
                ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () => setState(() => _otpSent = false),
                  child: Text(
                    loc.isHindi ? 'नंबर बदलें' : 'Change Phone Number',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: KalaTheme.terracotta),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
