import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/localization.dart';
import '../../core/theme.dart';
import '../marketplace/marketplace_screen.dart';
import 'phone_otp_screen.dart';

class LanguageSelectScreen extends StatelessWidget {
  const LanguageSelectScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final loc = Provider.of<KalaLocalization>(context);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              // App Brand Header
              Center(
                child: Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    color: KalaTheme.terracotta,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: KalaTheme.terracotta.withOpacity(0.3),
                        blurRadius: 16,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      '🎨',
                      style: TextStyle(fontSize: 44),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              const Center(
                child: Text(
                  'kalaSetu',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    color: KalaTheme.deepIndigo,
                    letterSpacing: -0.5,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Center(
                child: Text(
                  'हस्तशिल्पियों का डिजिटल व्यापार साथी',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: KalaTheme.deepIndigo.withOpacity(0.7),
                  ),
                ),
              ),
              const SizedBox(height: 48),

              // Language Prompt Header
              Text(
                'अपनी भाषा चुनें / Select Language',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: KalaTheme.deepIndigo,
                ),
              ),
              const SizedBox(height: 20),

              // Hindi Option Card
              _LanguageCard(
                languageName: 'हिंदी (Hindi)',
                subtext: 'अपनी मातृभाषा में बोलकर उत्पाद दर्ज करें',
                isSelected: loc.isHindi,
                iconText: '🇮🇳',
                onTap: () => loc.setLanguage('hi'),
              ),
              const SizedBox(height: 16),

              // English Option Card
              _LanguageCard(
                languageName: 'English',
                subtext: 'Describe products with voice in English',
                isSelected: !loc.isHindi,
                iconText: '🌐',
                onTap: () => loc.setLanguage('en'),
              ),

              const Spacer(),

              // Primary Artisan Studio Entry
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: KalaTheme.terracotta,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const PhoneOtpScreen()),
                  );
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('🎨 ', style: TextStyle(fontSize: 20)),
                    Text(
                      loc.isHindi ? 'कारीगर स्टूडियो (Artisan Studio)' : 'Artisan Studio',
                      style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward_rounded, size: 20),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Buyer Marketplace Entry
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  foregroundColor: KalaTheme.deepIndigo,
                  side: const BorderSide(color: KalaTheme.terracotta, width: 1.5),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const MarketplaceScreen()),
                  );
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('🛍️ ', style: TextStyle(fontSize: 20)),
                    Text(
                      loc.isHindi ? 'कला बाज़ार देखें (Browse Marketplace)' : 'Browse Marketplace',
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
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

class _LanguageCard extends StatelessWidget {
  final String languageName;
  final String subtext;
  final bool isSelected;
  final String iconText;
  final VoidCallback onTap;

  const _LanguageCard({
    required this.languageName,
    required this.subtext,
    required this.isSelected,
    required this.iconText,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isSelected ? KalaTheme.terracotta.withOpacity(0.08) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? KalaTheme.terracotta : KalaTheme.borderSubtle,
            width: isSelected ? 2.5 : 1.5,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: KalaTheme.terracotta.withOpacity(0.12),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  )
                ]
              : [],
        ),
        child: Row(
          children: [
            Text(iconText, style: const TextStyle(fontSize: 32)),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    languageName,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? KalaTheme.terracottaDark : KalaTheme.deepIndigo,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtext,
                    style: TextStyle(
                      fontSize: 14,
                      color: KalaTheme.deepIndigo.withOpacity(0.65),
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              isSelected ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
              color: isSelected ? KalaTheme.terracotta : Colors.grey,
              size: 28,
            ),
          ],
        ),
      ),
    );
  }
}
