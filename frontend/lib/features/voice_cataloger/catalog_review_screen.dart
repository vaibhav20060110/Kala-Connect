import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/localization.dart';
import '../../core/theme.dart';
import '../pricing_assistant/pricing_screen.dart';

class CatalogReviewScreen extends StatefulWidget {
  final String rawImageUrl;
  final String enhancedImageUrl;
  final Map<String, dynamic> catalogData;

  const CatalogReviewScreen({
    Key? key,
    required this.rawImageUrl,
    required this.enhancedImageUrl,
    required this.catalogData,
  }) : super(key: key);

  @override
  State<CatalogReviewScreen> createState() => _CatalogReviewScreenState();
}

class _CatalogReviewScreenState extends State<CatalogReviewScreen> {
  late TextEditingController _titleEnController;
  late TextEditingController _titleHiController;
  late TextEditingController _descEnController;
  late TextEditingController _descHiController;
  bool _isPlayingTts = false;

  @override
  void initState() {
    super.initState();
    _titleEnController = TextEditingController(text: widget.catalogData['title_en'] ?? '');
    _titleHiController = TextEditingController(text: widget.catalogData['title_hi'] ?? '');
    _descEnController = TextEditingController(text: widget.catalogData['description_en'] ?? '');
    _descHiController = TextEditingController(text: widget.catalogData['description_hi'] ?? '');
  }

  void _simulateTtsAudio(BuildContext context) {
    final loc = Provider.of<KalaLocalization>(context, listen: false);
    setState(() => _isPlayingTts = true);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.volume_up_rounded, color: Colors.white),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                loc.isHindi
                    ? 'विवरण सुनाया जा रहा है: "${_titleHiController.text}"'
                    : 'Reading aloud: "${_titleEnController.text}"',
              ),
            ),
          ],
        ),
        backgroundColor: KalaTheme.terracotta,
        duration: const Duration(seconds: 4),
      ),
    );

    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) setState(() => _isPlayingTts = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final loc = Provider.of<KalaLocalization>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.text('catalog_review_title')),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Listen Out Loud Banner (Literacy-friendly TTS)
              InkWell(
                onTap: () => _simulateTtsAudio(context),
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: KalaTheme.turmericGold.withOpacity(0.18),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: KalaTheme.turmericGold, width: 2),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: const BoxDecoration(
                          color: KalaTheme.terracotta,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          _isPlayingTts ? Icons.graphic_eq_rounded : Icons.volume_up_rounded,
                          color: Colors.white,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              loc.text('listen_tts'),
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: KalaTheme.deepIndigo),
                            ),
                            Text(
                              loc.isHindi
                                  ? 'सुनने के लिए यहाँ टैप करें (बोलकर सुनाएं)'
                                  : 'Tap here to listen to description read aloud',
                              style: TextStyle(fontSize: 12, color: KalaTheme.deepIndigo.withOpacity(0.7)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Hindi Title Field
              Text(loc.text('title_hi_label'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              const SizedBox(height: 8),
              TextField(
                controller: _titleHiController,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: KalaTheme.borderSubtle)),
                ),
              ),
              const SizedBox(height: 16),

              // English Title Field
              Text(loc.text('title_en_label'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              const SizedBox(height: 8),
              TextField(
                controller: _titleEnController,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: KalaTheme.borderSubtle)),
                ),
              ),
              const SizedBox(height: 16),

              // Hindi Description Field
              Text(loc.text('desc_hi_label'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              const SizedBox(height: 8),
              TextField(
                controller: _descHiController,
                maxLines: 3,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: KalaTheme.borderSubtle)),
                ),
              ),
              const SizedBox(height: 16),

              // English Description Field
              Text(loc.text('desc_en_label'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              const SizedBox(height: 8),
              TextField(
                controller: _descEnController,
                maxLines: 3,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: KalaTheme.borderSubtle)),
                ),
              ),
              const SizedBox(height: 28),

              // Continue to Pricing Button
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => PricingScreen(
                        rawImageUrl: widget.rawImageUrl,
                        enhancedImageUrl: widget.enhancedImageUrl,
                        titleEn: _titleEnController.text,
                        titleHi: _titleHiController.text,
                        descEn: _descEnController.text,
                        descHi: _descHiController.text,
                        category: widget.catalogData['category'] ?? 'Textiles',
                      ),
                    ),
                  );
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(loc.text('continue_to_pricing')),
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward_rounded, size: 22),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
