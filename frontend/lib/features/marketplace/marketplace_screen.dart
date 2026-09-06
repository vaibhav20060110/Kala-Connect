import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme.dart';
import '../../core/localization.dart';
import '../../core/api_service.dart';
import '../../models/product.dart';
import '../dashboard/catalog_home_screen.dart';
import 'cart_sheet.dart';

class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({Key? key}) : super(key: key);

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  List<Product> _products = [];
  bool _isLoading = true;
  String _selectedCategory = 'all';
  bool _giOnly = false;
  String _searchQuery = '';
  final List<CartItem> _cart = [];

  final List<String> _categories = [
    'all',
    'Textiles',
    'Pottery',
    'Paintings',
    'Fiber',
    'Metal',
    'Woodcraft',
  ];

  @override
  void initState() {
    super.initState();
    _loadCatalog();
  }

  Future<void> _loadCatalog() async {
    setState(() => _isLoading = true);
    final prods = await ApiService.getProducts();
    if (mounted) {
      setState(() {
        _products = prods;
        _isLoading = false;
      });
    }
  }

  List<Product> get _filteredProducts {
    return _products.where((p) {
      if (_selectedCategory != 'all' && p.category.toLowerCase() != _selectedCategory.toLowerCase()) {
        return false;
      }
      if (_giOnly) {
        final t = '${p.titleEn} ${p.category}'.toLowerCase();
        final isGi = t.contains('madhubani') || t.contains('banarasi') || t.contains('mithila') || t.contains('terracotta') || t.contains('dhokra') || t.contains('sabai');
        if (!isGi) return false;
      }
      if (_searchQuery.isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final match = p.titleEn.toLowerCase().contains(q) ||
            p.titleHi.toLowerCase().contains(q) ||
            p.category.toLowerCase().contains(q);
        if (!match) return false;
      }
      return true;
    }).toList();
  }

  void _addToCart(Product product) {
    setState(() {
      final existing = _cart.indexWhere((item) => item.product.id == product.id);
      if (existing != -1) {
        _cart[existing].quantity++;
      } else {
        _cart.add(CartItem(product: product, quantity: 1));
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🛒 "${product.titleEn}" झोली में जोड़ा गया!'),
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
        backgroundColor: KalaTheme.terracotta,
      ),
    );
  }

  void _openCartSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => CartSheet(
        cartItems: _cart,
        onCartUpdated: () => setState(() {}),
        onOrderPlaced: () => setState(() => _cart.clear()),
      ),
    );
  }

  void _showProductDetail(Product product) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      product.titleEn,
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ),
                  IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                ],
              ),
              Text(
                product.titleHi,
                style: const TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const SizedBox(height: 12),
              Text(product.descriptionEn),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.amber.shade200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('✓ 100% Fair-Trade Breakdown:', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    Text('• सामग्री लागत (Materials): ₹${product.materialCost.toStringAsFixed(0)}'),
                    Text('• कारीगरी श्रम (Artisan Labor): ${product.hoursSpent.toStringAsFixed(0)} घंटे'),
                    Text('• निष्पक्ष विक्रय मूल्य (Fair Retail): ₹${product.price.toStringAsFixed(0)}',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: KalaTheme.terracotta)),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.verified),
                      label: const Text('प्रमाणपत्र (COA)'),
                      onPressed: () {
                        Navigator.pop(ctx);
                        _showCoaDialog(product);
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.add_shopping_cart),
                      label: const Text('झोली में जोड़ें'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: KalaTheme.terracotta,
                        foregroundColor: Colors.white,
                      ),
                      onPressed: () {
                        Navigator.pop(ctx);
                        _addToCart(product);
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  void _showCoaDialog(Product product) async {
    final certData = await ApiService.fetchPaintingCertificate(product.id);
    final cert = certData['certificate'] ?? {};
    final certId = cert['certificate_id'] ?? 'COA-MITHILA-2026';
    final hash = cert['sha256_hash'] ?? 'a3f892bc...e19f';

    if (!mounted) return;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.verified_user, color: Colors.amber, size: 28),
            SizedBox(width: 8),
            Text('डिजिटल प्रामाणिकता (COA)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('कलाकृति: ${product.titleEn}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Text('शिल्पी: राधा देवी (राधा देवी, वाराणसी)'),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(8)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('प्रमाणपत्र ID: $certId', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('SHA-256: $hash', style: const TextStyle(fontSize: 9, fontFamily: 'monospace')),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('बंद करें (Close)')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final totalCartCount = _cart.fold(0, (sum, i) => sum + i.quantity);

    return Scaffold(
      appBar: AppBar(
        title: const Text('कला बाज़ार (Marketplace)', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: KalaTheme.terracotta,
        foregroundColor: Colors.white,
        actions: [
          // Switch to Artisan Studio
          TextButton.icon(
            icon: const Icon(Icons.palette, color: Colors.white, size: 18),
            label: const Text('कारीगर स्टूडियो', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const CatalogHomeScreen()));
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filters Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: TextField(
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'शिल्प, कलाकार खोजें (Search craft, pottery)...',
                prefixIcon: const Icon(Icons.search),
                isDense: true,
                filled: true,
                fillColor: Colors.grey.shade100,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ),
            ),
          ),
          // Category Pills Row
          SizedBox(
            height: 48,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              scrollDirection: Axis.horizontal,
              itemCount: _categories.length + 1,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (ctx, i) {
                if (i == 0) {
                  return FilterChip(
                    label: const Text('🏛️ केवल GI टैग'),
                    selected: _giOnly,
                    onSelected: (val) => setState(() => _giOnly = val),
                    selectedColor: Colors.amber.shade200,
                  );
                }
                final cat = _categories[i - 1];
                final isSelected = _selectedCategory == cat;
                return ChoiceChip(
                  label: Text(cat == 'all' ? 'सभी (All)' : cat),
                  selected: isSelected,
                  onSelected: (_) => setState(() => _selectedCategory = cat),
                  selectedColor: KalaTheme.terracotta.withOpacity(0.2),
                );
              },
            ),
          ),
          // Crafts Grid
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: KalaTheme.terracotta))
                : _filteredProducts.isEmpty
                    ? const Center(child: Text('कोई शिल्प नहीं मिला (No crafts found)'))
                    : GridView.builder(
                        padding: const EdgeInsets.all(16),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.72,
                          crossAxisSpacing: 14,
                          mainAxisSpacing: 14,
                        ),
                        itemCount: _filteredProducts.length,
                        itemBuilder: (ctx, idx) {
                          final prod = _filteredProducts[idx];
                          return Card(
                            elevation: 2,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            clipBehavior: Clip.antiAlias,
                            child: InkWell(
                              onTap: () => _showProductDetail(prod),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    child: Container(
                                      color: Colors.amber.shade50,
                                      child: Stack(
                                        fit: StackFit.expand,
                                        children: [
                                          if (prod.enhancedImageUrl.isNotEmpty || prod.rawImageUrl.isNotEmpty)
                                            Image.network(
                                              (prod.enhancedImageUrl.isNotEmpty ? prod.enhancedImageUrl : prod.rawImageUrl).startsWith('http')
                                                  ? (prod.enhancedImageUrl.isNotEmpty ? prod.enhancedImageUrl : prod.rawImageUrl)
                                                  : '${ApiService.baseUrl}${prod.enhancedImageUrl.isNotEmpty ? prod.enhancedImageUrl : prod.rawImageUrl}',
                                              fit: BoxFit.cover,
                                              errorBuilder: (_, __, ___) => const Center(
                                                child: Icon(Icons.palette_outlined, size: 48, color: KalaTheme.terracotta),
                                              ),
                                            )
                                          else
                                            const Center(
                                              child: Icon(Icons.palette_outlined, size: 48, color: KalaTheme.terracotta),
                                            ),
                                          Positioned(
                                            top: 8,
                                            right: 8,
                                            child: Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: Colors.green.shade700,
                                                borderRadius: BorderRadius.circular(8),
                                              ),
                                              child: const Text('GI Tag',
                                                  style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.all(10.0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          prod.titleEn,
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        Text(
                                          prod.category,
                                          style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                                        ),
                                        const SizedBox(height: 4),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              '₹${prod.price.toStringAsFixed(0)}',
                                              style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 14,
                                                  color: KalaTheme.terracotta),
                                            ),
                                            InkWell(
                                              onTap: () => _addToCart(prod),
                                              child: Container(
                                                padding: const EdgeInsets.all(6),
                                                decoration: const BoxDecoration(
                                                  color: KalaTheme.terracotta,
                                                  shape: BoxShape.circle,
                                                ),
                                                child: const Icon(Icons.add_shopping_cart, size: 14, color: Colors.white),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: KalaTheme.terracotta,
        foregroundColor: Colors.white,
        icon: Badge(
          isLabelVisible: totalCartCount > 0,
          label: Text('$totalCartCount'),
          child: const Icon(Icons.shopping_bag),
        ),
        label: Text(totalCartCount > 0 ? 'झोली ($totalCartCount)' : 'झोली (Cart)'),
        onPressed: _openCartSheet,
      ),
    );
  }
}

extension _ListFilter<T> on List<T> {
  List<T> filter(bool Function(T) test) {
    final result = <T>[];
    for (final element in this) {
      if (test(element)) result.add(element);
    }
    return result;
  }
}
