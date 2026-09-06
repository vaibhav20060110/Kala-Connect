import 'package:flutter/material.dart';

class KalaTheme {
  // Traditional Indian Craft Authentic Heritage Color Palette
  static const Color terracotta = Color(0xFFB84218); // Authentic natural fired clay
  static const Color terracottaDark = Color(0xFF8C3010);
  static const Color turmericGold = Color(0xFFD97706); // Warm saffron/turmeric
  static const Color deepIndigo = Color(0xFF1E293B); // Deep slate indigo
  static const Color warmCream = Color(0xFFFAF7F2); // Sand canvas
  static const Color cardSurface = Color(0xFFFFFFFF);
  static const Color borderSubtle = Color(0xFFE2E8F0);
  static const Color forestGreen = Color(0xFF15803D); // Fair-trade livelihood
  static const Color amberOrange = Color(0xFFF59E0B);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: warmCream,
      colorScheme: const ColorScheme.light(
        primary: terracotta,
        secondary: turmericGold,
        surface: cardSurface,
        onPrimary: Colors.white,
        onSecondary: deepIndigo,
        onSurface: deepIndigo,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: deepIndigo,
        elevation: 1,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: deepIndigo,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: terracotta,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 56), // 56px touch target
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
          elevation: 2,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: terracotta,
          minimumSize: const Size(double.infinity, 54),
          side: const BorderSide(color: terracotta, width: 2),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: const TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      cardTheme: CardTheme(
        color: cardSurface,
        elevation: 2,
        shadowColor: Colors.black.withOpacity(0.08),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: borderSubtle, width: 1),
        ),
      ),
    );
  }
}
