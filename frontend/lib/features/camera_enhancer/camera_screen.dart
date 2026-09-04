import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/localization.dart';
import '../../core/theme.dart';
import 'enhancement_preview_screen.dart';

class CameraScreen extends StatefulWidget {
  const CameraScreen({Key? key}) : super(key: key);

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  bool _isFlashOn = false;

  void _onCapture() {
    // Navigate to enhancement preview with captured image
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => const EnhancementPreviewScreen(
          rawImageUrl: '/uploads/sample_raw_1.jpg',
          enhancedImageUrl: '/uploads/sample_enhanced_1.jpg',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = Provider.of<KalaLocalization>(context);

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: Text(
          loc.text('camera_title'),
          style: const TextStyle(color: Colors.white, fontSize: 18),
        ),
        actions: [
          IconButton(
            icon: Icon(_isFlashOn ? Icons.flash_on_rounded : Icons.flash_off_rounded, color: Colors.white),
            onPressed: () => setState(() => _isFlashOn = !_isFlashOn),
          ),
        ],
      ),
      body: Stack(
        children: [
          // Viewfinder Background Simulator
          Positioned.fill(
            child: Container(
              color: const Color(0xFF1A1A1A),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Centering Guide Overlay
                    Container(
                      width: 280,
                      height: 280,
                      decoration: BoxDecoration(
                        border: Border.all(color: KalaTheme.turmericGold, width: 2.5),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Stack(
                        children: [
                          // Corner brackets
                          Positioned(
                            top: 8,
                            left: 8,
                            child: Container(width: 20, height: 20, decoration: const BoxDecoration(border: Border(top: BorderSide(color: Colors.white, width: 3), left: BorderSide(color: Colors.white, width: 3)))),
                          ),
                          Positioned(
                            top: 8,
                            right: 8,
                            child: Container(width: 20, height: 20, decoration: const BoxDecoration(border: Border(top: BorderSide(color: Colors.white, width: 3), right: BorderSide(color: Colors.white, width: 3)))),
                          ),
                          Positioned(
                            bottom: 8,
                            left: 8,
                            child: Container(width: 20, height: 20, decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Colors.white, width: 3), left: BorderSide(color: Colors.white, width: 3)))),
                          ),
                          Positioned(
                            bottom: 8,
                            right: 8,
                            child: Container(width: 20, height: 20, decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Colors.white, width: 3), right: BorderSide(color: Colors.white, width: 3)))),
                          ),
                          Center(
                            child: Text(
                              '🧵',
                              style: TextStyle(fontSize: 80, color: Colors.white.withOpacity(0.85)),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Centering Hint
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 32),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white.withOpacity(0.2)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.center_focus_strong_rounded, color: KalaTheme.turmericGold, size: 22),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              loc.text('camera_guide_hint'),
                              style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.3),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Bottom Shutter Controls
          Positioned(
            bottom: 30,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                // Gallery Picker
                IconButton(
                  icon: const Icon(Icons.photo_library_rounded, color: Colors.white, size: 32),
                  onPressed: _onCapture,
                ),
                // Shutter Button
                GestureDetector(
                  onTap: _onCapture,
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 4),
                      color: KalaTheme.terracotta,
                      boxShadow: [
                        BoxShadow(
                          color: KalaTheme.terracotta.withOpacity(0.5),
                          blurRadius: 16,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Icon(Icons.camera_alt_rounded, color: Colors.white, size: 38),
                    ),
                  ),
                ),
                // Camera Flip
                IconButton(
                  icon: const Icon(Icons.flip_camera_ios_rounded, color: Colors.white, size: 32),
                  onPressed: () {},
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
