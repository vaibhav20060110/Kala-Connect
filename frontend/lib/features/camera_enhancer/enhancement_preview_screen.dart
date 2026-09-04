import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/localization.dart';
import '../../core/theme.dart';
import '../voice_cataloger/voice_record_screen.dart';

class EnhancementPreviewScreen extends StatefulWidget {
  final String rawImageUrl;
  final String enhancedImageUrl;

  const EnhancementPreviewScreen({
    Key? key,
    required this.rawImageUrl,
    required this.enhancedImageUrl,
  }) : super(key: key);

  @override
  State<EnhancementPreviewScreen> createState() => _EnhancementPreviewScreenState();
}

class _EnhancementPreviewScreenState extends State<EnhancementPreviewScreen> {
  double _splitRatio = 0.5; // 0.0 (all raw) to 1.0 (all enhanced)
  bool _showEnhanced = true;

  @override
  Widget build(BuildContext context) {
    final loc = Provider.of<KalaLocalization>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.text('before_after_title')),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Interactive Image Comparison Container
              Container(
                height: 340,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: KalaTheme.borderSubtle, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 16,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      // Background layer (Raw image or simulated)
                      Container(
                        color: const Color(0xFFCBD5E0),
                        child: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text('📷', style: TextStyle(fontSize: 64)),
                              const SizedBox(height: 8),
                              Text(
                                loc.text('before_label'),
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF4A5568)),
                              ),
                              const Text('Uneven lighting & clutter', style: TextStyle(fontSize: 12, color: Color(0xFF718096))),
                            ],
                          ),
                        ),
                      ),

                      // Foreground layer (AI Studio Enhanced)
                      if (_showEnhanced)
                        Container(
                          color: Colors.white,
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Text('✨', style: TextStyle(fontSize: 72)),
                                const SizedBox(height: 8),
                                Text(
                                  loc.text('after_label'),
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: KalaTheme.forestGreen),
                                ),
                                const SizedBox(height: 4),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: KalaTheme.forestGreen.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: const Text(
                                    '1:1 E-Commerce Studio Ready',
                                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: KalaTheme.forestGreen),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                      // Before / After Floating Badge Toggle
                      Positioned(
                        top: 14,
                        left: 14,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: _showEnhanced ? KalaTheme.forestGreen : const Color(0xFF4A5568),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            _showEnhanced ? '✨ ${loc.text('after_label')}' : '📷 ${loc.text('before_label')}',
                            style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),

                      // Tap to Compare Toggle
                      Positioned(
                        bottom: 14,
                        right: 14,
                        child: InkWell(
                          onTap: () => setState(() => _showEnhanced = !_showEnhanced),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.75),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.compare_arrows_rounded, color: Colors.white, size: 18),
                                const SizedBox(width: 6),
                                Text(
                                  loc.isHindi ? 'तुलना बदलें' : 'Toggle Compare',
                                  style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // AI Enhancements Summary Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: KalaTheme.borderSubtle),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.auto_awesome_rounded, color: KalaTheme.turmericGold, size: 22),
                        const SizedBox(width: 8),
                        Text(
                          loc.isHindi ? 'जेमिनी AI स्टूडियो सुधार' : 'Gemini AI Studio Improvements',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: KalaTheme.deepIndigo),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _ImprovementRow(
                      icon: Icons.check_circle_rounded,
                      title: loc.isHindi ? 'पृष्ठभूमि साफ की गई' : 'Background Removed & Cleaned',
                      desc: loc.isHindi ? 'कार्यशाला की वस्तुएं हटाकर शुद्ध सफेद रंग' : 'Neutral studio white pedestal applied',
                    ),
                    const SizedBox(height: 8),
                    _ImprovementRow(
                      icon: Icons.check_circle_rounded,
                      title: loc.isHindi ? 'रोशनी व चमक संतुलित' : 'Lighting & Contrast Balanced',
                      desc: loc.isHindi ? 'कपड़े व कलाकृति की प्राकृतिक चमक सुरक्षित' : 'Reflections evened, gold highlights preserved',
                    ),
                    const SizedBox(height: 8),
                    _ImprovementRow(
                      icon: Icons.check_circle_rounded,
                      title: loc.isHindi ? '1:1 ई-कॉमर्स आकार' : '1:1 Standard Product Framing',
                      desc: loc.isHindi ? 'ऑनलाइन स्टोर व कैटलॉग के अनुकूल' : 'Centered for Amazon, Etsy & GeM listings',
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Action Buttons
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => VoiceRecordScreen(
                        rawImageUrl: widget.rawImageUrl,
                        enhancedImageUrl: widget.enhancedImageUrl,
                      ),
                    ),
                  );
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(loc.text('accept_photo')),
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward_rounded, size: 22),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () => Navigator.pop(context),
                child: Text(loc.text('retake_photo')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ImprovementRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String desc;

  const _ImprovementRow({required this.icon, required this.title, required this.desc});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: KalaTheme.forestGreen, size: 20),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: KalaTheme.deepIndigo)),
              Text(desc, style: TextStyle(fontSize: 12, color: KalaTheme.deepIndigo.withOpacity(0.7))),
            ],
          ),
        ),
      ],
    );
  }
}
