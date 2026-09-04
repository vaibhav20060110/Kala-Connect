import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/localization.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import 'catalog_review_screen.dart';

class VoiceRecordScreen extends StatefulWidget {
  final String rawImageUrl;
  final String enhancedImageUrl;

  const VoiceRecordScreen({
    Key? key,
    required this.rawImageUrl,
    required this.enhancedImageUrl,
  }) : super(key: key);

  @override
  State<VoiceRecordScreen> createState() => _VoiceRecordScreenState();
}

class _VoiceRecordScreenState extends State<VoiceRecordScreen> with SingleTickerProviderStateMixin {
  bool _isRecording = false;
  bool _isProcessing = false;
  int _seconds = 0;
  Timer? _timer;
  late AnimationController _animController;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _animController.dispose();
    super.dispose();
  }

  void _toggleRecording() async {
    if (!_isRecording) {
      // Start Recording
      setState(() {
        _isRecording = true;
        _seconds = 0;
      });
      _timer = Timer.periodic(const Duration(seconds: 1), (t) {
        setState(() => _seconds++);
      });
    } else {
      // Stop Recording & Process with Gemini AI
      _timer?.cancel();
      setState(() {
        _isRecording = false;
        _isProcessing = true;
      });

      final loc = Provider.of<KalaLocalization>(context, listen: false);
      final catalogData = await ApiService.catalogVoice(
        language: loc.currentLanguage,
      );

      setState(() => _isProcessing = false);

      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => CatalogReviewScreen(
              rawImageUrl: widget.rawImageUrl,
              enhancedImageUrl: widget.enhancedImageUrl,
              catalogData: catalogData,
            ),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = Provider.of<KalaLocalization>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.text('voice_title')),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                loc.text('voice_title'),
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: KalaTheme.deepIndigo,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                loc.text('voice_prompt'),
                style: TextStyle(
                  fontSize: 16,
                  color: KalaTheme.deepIndigo.withOpacity(0.7),
                  height: 1.4,
                ),
              ),
              const Spacer(),

              // Processing State Indicator
              if (_isProcessing) ...[
                Center(
                  child: Column(
                    children: [
                      const CircularProgressIndicator(color: KalaTheme.terracotta, strokeWidth: 4),
                      const SizedBox(height: 24),
                      Text(
                        loc.text('processing_voice'),
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: KalaTheme.terracottaDark),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        loc.text('processing_voice_sub'),
                        style: TextStyle(fontSize: 14, color: KalaTheme.deepIndigo.withOpacity(0.7)),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ] else ...[
                // Microphone Big Touch Target
                Center(
                  child: Column(
                    children: [
                      // Timer display
                      if (_isRecording)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                          margin: const EdgeInsets.only(bottom: 24),
                          decoration: BoxDecoration(
                            color: Colors.red.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: Colors.red, width: 1.5),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(width: 10, height: 10, decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle)),
                              const SizedBox(width: 8),
                              Text(
                                '00:${_seconds.toString().padLeft(2, '0')}',
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.red),
                              ),
                            ],
                          ),
                        ),

                      // Animated Mic Button
                      GestureDetector(
                        onTap: _toggleRecording,
                        child: AnimatedBuilder(
                          animation: _animController,
                          builder: (context, child) {
                            final scale = _isRecording ? (1.0 + _animController.value * 0.12) : 1.0;
                            return Transform.scale(
                              scale: scale,
                              child: Container(
                                width: 140,
                                height: 140,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: _isRecording ? Colors.red : KalaTheme.terracotta,
                                  boxShadow: [
                                    BoxShadow(
                                      color: (_isRecording ? Colors.red : KalaTheme.terracotta).withOpacity(0.4),
                                      blurRadius: 28,
                                      spreadRadius: 4,
                                    ),
                                  ],
                                ),
                                child: Icon(
                                  _isRecording ? Icons.stop_rounded : Icons.mic_rounded,
                                  size: 64,
                                  color: Colors.white,
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        _isRecording ? loc.text('recording') : loc.text('tap_to_speak'),
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: _isRecording ? Colors.red : KalaTheme.deepIndigo,
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const Spacer(),

              // Quick skip / manual demo trigger
              if (!_isProcessing)
                OutlinedButton.icon(
                  onPressed: () async {
                    setState(() => _isProcessing = true);
                    final loc = Provider.of<KalaLocalization>(context, listen: false);
                    final catalogData = await ApiService.catalogVoice(language: loc.currentLanguage);
                    setState(() => _isProcessing = false);
                    if (mounted) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => CatalogReviewScreen(
                            rawImageUrl: widget.rawImageUrl,
                            enhancedImageUrl: widget.enhancedImageUrl,
                            catalogData: catalogData,
                          ),
                        ),
                      );
                    }
                  },
                  icon: const Icon(Icons.auto_stories_rounded),
                  label: Text(loc.isHindi ? 'नमूना विवरण लोड करें (Demo)' : 'Load Demo Description'),
                ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
