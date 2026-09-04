import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme.dart';
import 'core/localization.dart';
import 'core/offline_queue.dart';
import 'features/onboarding_auth/language_select_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => KalaLocalization()),
        ChangeNotifierProvider(create: (_) => OfflineUploadQueue()),
      ],
      child: const KalaConnectApp(),
    ),
  );
}

class KalaConnectApp extends StatelessWidget {
  const KalaConnectApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KalaConnect (हस्तशिल्प व्यापार साथी)',
      debugShowCheckedModeBanner: false,
      theme: KalaTheme.lightTheme,
      // Language picker shown first, before anything else
      home: const LanguageSelectScreen(),
    );
  }
}
