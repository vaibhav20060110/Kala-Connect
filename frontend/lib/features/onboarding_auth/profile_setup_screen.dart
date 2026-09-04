import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/localization.dart';
import '../../core/theme.dart';
import '../dashboard/catalog_home_screen.dart';

class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({Key? key}) : super(key: key);

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final TextEditingController _nameController = TextEditingController(text: 'Radha Devi (राधा देवी)');
  final TextEditingController _locationController = TextEditingController(text: 'Varanasi, Uttar Pradesh');
  String _selectedCraft = 'Textiles';

  final List<Map<String, String>> _crafts = [
    {'id': 'Textiles', 'en': 'Weaving & Handloom', 'hi': 'हथकरघा व बुनाई', 'icon': '🧵'},
    {'id': 'Pottery', 'en': 'Pottery & Ceramics', 'hi': 'मिट्टी के बर्तन व कला', 'icon': '🏺'},
    {'id': 'Woodcraft', 'en': 'Woodcraft & Carving', 'hi': 'काष्ठ व नक्काशी', 'icon': '🪵'},
    {'id': 'Metal', 'en': 'Metal & Dhokra Art', 'hi': 'ढोकरा व पीतल शिल्प', 'icon': '🔔'},
    {'id': 'Paintings', 'en': 'Folk Art & Paintings', 'hi': 'लोक चित्रकला', 'icon': '🎨'},
    {'id': 'Leather', 'en': 'Handmade Leather', 'hi': 'हस्तनिर्मित चमड़ा', 'icon': '👡'},
  ];

  @override
  Widget build(BuildContext context) {
    final loc = Provider.of<KalaLocalization>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.text('profile_setup')),
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                loc.text('profile_setup'),
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: KalaTheme.deepIndigo,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                loc.isHindi
                    ? 'कृपया अपने शिल्प और कार्यस्थल की जानकारी दें'
                    : 'Tell us about your craft and workshop location',
                style: TextStyle(
                  fontSize: 15,
                  color: KalaTheme.deepIndigo.withOpacity(0.7),
                ),
              ),
              const SizedBox(height: 24),

              // Name Field
              Text(
                loc.text('artisan_name'),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _nameController,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: KalaTheme.borderSubtle),
                  ),
                  prefixIcon: const Icon(Icons.person_rounded, color: KalaTheme.terracotta),
                ),
              ),
              const SizedBox(height: 20),

              // Craft Type Grid
              Text(
                loc.text('craft_type'),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 12),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _crafts.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 2.2,
                ),
                itemBuilder: (context, index) {
                  final craft = _crafts[index];
                  final isSelected = _selectedCraft == craft['id'];
                  return InkWell(
                    onTap: () => setState(() => _selectedCraft = craft['id']!),
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? KalaTheme.terracotta.withOpacity(0.1) : Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isSelected ? KalaTheme.terracotta : KalaTheme.borderSubtle,
                          width: isSelected ? 2.5 : 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          Text(craft['icon']!, style: const TextStyle(fontSize: 22)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              loc.isHindi ? craft['hi']! : craft['en']!,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: isSelected ? KalaTheme.terracottaDark : KalaTheme.deepIndigo,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 20),

              // Location Field
              Text(
                loc.text('location'),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _locationController,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: KalaTheme.borderSubtle),
                  ),
                  prefixIcon: const Icon(Icons.location_on_rounded, color: KalaTheme.terracotta),
                ),
              ),
              const SizedBox(height: 32),

              // Save Button
              ElevatedButton(
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => const CatalogHomeScreen()),
                  );
                },
                child: Text(loc.text('save_profile')),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
