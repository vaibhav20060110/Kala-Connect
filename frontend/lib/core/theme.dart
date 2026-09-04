import 'package:flutter/material.dart';

class KalaTheme {
  // Traditional Indian Craft Color Palette
  static const Color terracotta = Color(0xFFC05621); // Rich baked clay
  static const Color terracottaDark = Color(0xFF9C4215);
  static const Color turmericGold = Color(0xFFD69E2E); // Auspicious warm gold
  static const Color deepIndigo = Color(0xFF1A202C); // Night indigo
  static const Color warmCream = Color(0xFFFBF9F5); // Khadi handmade paper
  static const Color cardSurface = Color(0xFFFFFFFF);
  static const Color borderSubtle = Color(0xFFE2E8F0);
  static const Color forestGreen = Color(0xFF276749); // Success / Fair price
  static const Color amberOrange = Color(0xFFDD6B20);

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
