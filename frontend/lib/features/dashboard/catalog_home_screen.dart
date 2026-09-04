import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/localization.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../../models/product.dart';
import '../camera_enhancer/camera_screen.dart';
import 'gem_sync_modal.dart';

class CatalogHomeScreen extends StatefulWidget {
  const CatalogHomeScreen({Key? key}) : super(key: key);

  @override
  State<CatalogHomeScreen> createState() => _CatalogHomeScreenState();
}

class _CatalogHomeScreenState extends State<CatalogHomeScreen> {
  List<Product> _products = [];
  bool _isLoading = true;
  String _activeFilter = 'all'; // 'all', 'published', 'draft'

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() => _isLoading = true);
    final list = await ApiService.getProducts();
    setState(() {
      _products = list;
      _isLoading = false;
    });
  }

  List<Product> get _filteredProducts {
    if (_activeFilter == 'all') return _products;
    return _products.where((p) => p.status == _activeFilter).toList();
  }

  void _showGeMModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const GeMSyncModal(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = Provider.of<KalaLocalization>(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Text('🎨', style: TextStyle(fontSize: 22)),
            const SizedBox(width: 8),
            Text(loc.text('app_title')),
          ],
        ),
        actions: [
          // GeM Portal Shortcut
          TextButton.icon(
            onPressed: _showGeMModal,
            icon: const Text('🏛️', style: TextStyle(fontSize: 16)),
            label: const Text(
              'GeM',
              style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
            ),
          ),
          // Language Switcher
          IconButton(
            icon: const Icon(Icons.language_rounded, color: KalaTheme.terracotta),
            tooltip: 'Switch Language',
            onPressed: () => loc.toggleLanguage(),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadProducts,
        color: KalaTheme.terracotta,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top Business Analytics Hub Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: KalaTheme.deepIndigo,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: KalaTheme.deepIndigo.withOpacity(0.2),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Text('📊', style: TextStyle(fontSize: 18)),
                            const SizedBox(width: 8),
                            Text(
                              loc.text('dashboard'),
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                        InkWell(
                          onTap: _showGeMModal,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: KalaTheme.turmericGold,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                const Text('🏛️', style: TextStyle(fontSize: 12)),
                                const SizedBox(width: 4),
                                Text(
                                  loc.isHindi ? 'सरकारी पोर्टल' : 'GeM Connected',
                                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: KalaTheme.deepIndigo),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _StatItem(
                          count: '${_products.length}',
                          label: loc.text('products_listed'),
                          icon: Icons.inventory_2_rounded,
                        ),
                        Container(width: 1, height: 40, color: Colors.white24),
                        _StatItem(
                          count: '231',
                          label: loc.text('total_views'),
                          icon: Icons.visibility_rounded,
                        ),
                        Container(width: 1, height: 40, color: Colors.white24),
                        _StatItem(
                          count: '4',
                          label: loc.text('orders'),
                          icon: Icons.chat_bubble_rounded,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Filter Tabs
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _FilterChip(
                      label: loc.text('filter_all'),
                      isSelected: _activeFilter == 'all',
                      onTap: () => setState(() => _activeFilter = 'all'),
                    ),
                    const SizedBox(width: 8),
                    _FilterChip(
                      label: loc.text('filter_published'),
                      isSelected: _activeFilter == 'published',
                      onTap: () => setState(() => _activeFilter = 'published'),
                    ),
                    const SizedBox(width: 8),
                    _FilterChip(
                      label: loc.text('filter_draft'),
                      isSelected: _activeFilter == 'draft',
                      onTap: () => setState(() => _activeFilter = 'draft'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Products Grid
              if (_isLoading) ...[
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(40.0),
                    child: CircularProgressIndicator(color: KalaTheme.terracotta),
                  ),
                ),
              ] else if (_filteredProducts.isEmpty) ...[
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(40.0),
                    child: Column(
                      children: [
                        const Text('🧵', style: TextStyle(fontSize: 56)),
                        const SizedBox(height: 12),
                        Text(
                          loc.isHindi ? 'कोई शिल्प उपलब्ध नहीं है' : 'No crafts listed yet',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
              ] else ...[
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _filteredProducts.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                    childAspectRatio: 0.72,
                  ),
                  itemBuilder: (context, index) {
                    final item = _filteredProducts[index];
                    return _ProductCard(product: item, isHindi: loc.isHindi);
                  },
                ),
              ],
              const SizedBox(height: 90),
            ],
          ),
        ),
      ),
      // Floating Action Button to launch Camera
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: KalaTheme.terracotta,
        foregroundColor: Colors.white,
        elevation: 4,
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CameraScreen()),
          ).then((_) => _loadProducts());
        },
        icon: const Icon(Icons.add_a_photo_rounded, size: 24),
        label: Text(
          loc.text('add_new_craft'),
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String count;
  final String label;
  final IconData icon;

  const _StatItem({required this.count, required this.label, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: KalaTheme.turmericGold, size: 20),
        const SizedBox(height: 4),
        Text(count, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
        Text(label, style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 11)),
      ],
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({required this.label, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? KalaTheme.terracotta : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? KalaTheme.terracotta : KalaTheme.borderSubtle),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : KalaTheme.deepIndigo,
            fontWeight: FontWeight.bold,
            fontSize: 13,
          ),
        ),
      ),
    );
  }
}

class _ProductCard extends StatelessWidget {
  final Product product;
  final bool isHindi;

  const _ProductCard({required this.product, required this.isHindi});

  @override
  Widget build(BuildContext context) {
    final title = isHindi ? (product.titleHi.isNotEmpty ? product.titleHi : product.titleEn) : product.titleEn;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: KalaTheme.borderSubtle),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Craft Thumbnail
          Expanded(
            child: Stack(
              fit: StackFit.expand,
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFF7FAFC),
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  ),
                  child: Center(
                    child: Text(
                      product.category == 'Pottery' ? '🏺' : '🧵',
                      style: const TextStyle(fontSize: 48),
                    ),
                  ),
                ),
                // AI Studio Enhanced Badge
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: KalaTheme.forestGreen,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Text('✨ AI Studio', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                  ),
                ),
                // Status Badge
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: product.status == 'published' ? KalaTheme.terracotta : Colors.grey,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      product.status.toUpperCase(),
                      style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Details Container
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: KalaTheme.deepIndigo),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '₹${product.price.toInt()}',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: KalaTheme.terracotta),
                    ),
                    Row(
                      children: [
                        const Icon(Icons.visibility_rounded, size: 14, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text('${product.views}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
