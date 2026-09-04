import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/localization.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../dashboard/catalog_home_screen.dart';

class PricingScreen extends StatefulWidget {
  final String rawImageUrl;
  final String enhancedImageUrl;
  final String titleEn;
  final String titleHi;
  final String descEn;
  final String descHi;
  final String category;

  const PricingScreen({
    Key? key,
    required this.rawImageUrl,
    required this.enhancedImageUrl,
    required this.titleEn,
    required this.titleHi,
    required this.descEn,
    required this.descHi,
    required this.category,
  }) : super(key: key);

  @override
  State<PricingScreen> createState() => _PricingScreenState();
}

class _PricingScreenState extends State<PricingScreen> {
  double _materialCost = 350.0;
  double _hoursSpent = 6.0;
  String _category = 'Textiles';
  bool _isCalculating = false;
  bool _isSaving = false;

  Map<String, dynamic>? _pricingResult;
  double _finalPrice = 950.0;

  @override
  void initState() {
    super.initState();
    _category = widget.category;
    _runPriceCalculation();
  }

  Future<void> _runPriceCalculation() async {
    setState(() => _isCalculating = true);
    final result = await ApiService.calculatePrice(
      category: _category,
      materialCost: _materialCost,
      hoursSpent: _hoursSpent,
      titleEn: widget.titleEn,
    );
    setState(() {
      _isCalculating = false;
      _pricingResult = result;
      _finalPrice = (result['suggested_price'] ?? 950.0).toDouble();
    });
  }

  Future<void> _publishProduct(String status) async {
    setState(() => _isSaving = true);

    await ApiService.createProduct({
      'title_en': widget.titleEn,
      'title_hi': widget.titleHi,
      'description_en': widget.descEn,
      'description_hi': widget.descHi,
      'raw_image_url': widget.rawImageUrl,
      'enhanced_image_url': widget.enhancedImageUrl,
      'price': _finalPrice,
      'category': _category,
      'material_cost': _materialCost,
      'hours_spent': _hoursSpent,
      'status': status,
    });

    setState(() => _isSaving = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            status == 'published'
                ? 'उत्पाद सफलतापूर्वक कैटलॉग में प्रकाशित हुआ! (Product Published)'
                : 'ड्राफ्ट सहेजा गया (Saved as Draft)',
          ),
          backgroundColor: KalaTheme.forestGreen,
        ),
      );
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const CatalogHomeScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = Provider.of<KalaLocalization>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.text('pricing_title')),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                loc.text('pricing_title'),
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: KalaTheme.deepIndigo),
              ),
              const SizedBox(height: 6),
              Text(
                loc.text('pricing_sub'),
                style: TextStyle(fontSize: 14, color: KalaTheme.deepIndigo.withOpacity(0.7)),
              ),
              const SizedBox(height: 20),

              // Material Cost Input Card
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
                    Text(
                      loc.text('material_cost'),
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _IncrementButton(
                          label: '- ₹50',
                          onTap: () {
                            if (_materialCost >= 100) {
                              setState(() => _materialCost -= 50);
                              _runPriceCalculation();
                            }
                          },
                        ),
                        Text(
                          '₹${_materialCost.toInt()}',
                          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: KalaTheme.terracotta),
                        ),
                        _IncrementButton(
                          label: '+ ₹50',
                          onTap: () {
                            setState(() => _materialCost += 50);
                            _runPriceCalculation();
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Hours Spent Card
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
                    Text(
                      loc.text('hours_spent'),
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _IncrementButton(
                          label: '- 1 hr',
                          onTap: () {
                            if (_hoursSpent > 1) {
                              setState(() => _hoursSpent -= 1);
                              _runPriceCalculation();
                            }
                          },
                        ),
                        Text(
                          '${_hoursSpent.toInt()} घंटे (hrs)',
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: KalaTheme.deepIndigo),
                        ),
                        _IncrementButton(
                          label: '+ 1 hr',
                          onTap: () {
                            setState(() => _hoursSpent += 1);
                            _runPriceCalculation();
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Gemini AI Recommendation Card
              if (_isCalculating) ...[
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: KalaTheme.turmericGold, width: 2),
                  ),
                  child: Center(
                    child: Column(
                      children: [
                        const CircularProgressIndicator(color: KalaTheme.terracotta),
                        const SizedBox(height: 16),
                        Text(
                          loc.text('calculating_price'),
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              ] else if (_pricingResult != null) ...[
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: KalaTheme.forestGreen, width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: KalaTheme.forestGreen.withOpacity(0.08),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.stars_rounded, color: KalaTheme.turmericGold, size: 24),
                              const SizedBox(width: 8),
                              Text(
                                loc.text('gemini_recommendation'),
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: KalaTheme.forestGreen),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: KalaTheme.forestGreen.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Text('Fair Trade Certified', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: KalaTheme.forestGreen)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Text(
                        '₹${_finalPrice.toInt()}',
                        style: const TextStyle(fontSize: 44, fontWeight: FontWeight.w900, color: KalaTheme.deepIndigo),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${loc.text('price_range')}: ₹${_pricingResult!['suggested_min']} - ₹${_pricingResult!['suggested_max']}',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: KalaTheme.deepIndigo.withOpacity(0.65)),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: KalaTheme.warmCream,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          loc.isHindi
                              ? (_pricingResult!['justification_hi'] ?? _pricingResult!['justification'])
                              : _pricingResult!['justification'],
                          style: const TextStyle(fontSize: 13, height: 1.4, color: KalaTheme.deepIndigo, fontWeight: FontWeight.w500),
                        ),
                      ),
                      const SizedBox(height: 14),
                      // Fine-tuning Slider
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(loc.isHindi ? 'मूल्य बदलें:' : 'Adjust Price:', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                          Text('₹${_finalPrice.toInt()}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: KalaTheme.terracotta)),
                        ],
                      ),
                      Slider(
                        value: _finalPrice.clamp(
                          ((_pricingResult!['suggested_min'] ?? 500) * 0.8).toDouble(),
                          ((_pricingResult!['suggested_max'] ?? 2000) * 1.3).toDouble(),
                        ),
                        min: ((_pricingResult!['suggested_min'] ?? 500) * 0.8).toDouble(),
                        max: ((_pricingResult!['suggested_max'] ?? 2000) * 1.3).toDouble(),
                        divisions: 20,
                        activeColor: KalaTheme.terracotta,
                        onChanged: (val) => setState(() => _finalPrice = (val / 10).round() * 10.0),
                      ),
                    ],
                  ),
                ),
              ],
              const SizedBox(height: 32),

              // Publish Button
              ElevatedButton(
                onPressed: _isSaving ? null : () => _publishProduct('published'),
                child: _isSaving
                    ? const CircularProgressIndicator(color: Colors.white)
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.storefront_rounded, size: 24),
                          const SizedBox(width: 8),
                          Text(loc.text('publish_product')),
                        ],
                      ),
              ),
              const SizedBox(height: 12),

              // Save Draft Button
              OutlinedButton(
                onPressed: _isSaving ? null : () => _publishProduct('draft'),
                child: Text(loc.text('save_as_draft')),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}

class _IncrementButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _IncrementButton({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
        decoration: BoxDecoration(
          color: KalaTheme.warmCream,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: KalaTheme.borderSubtle, width: 1.5),
        ),
        child: Text(
          label,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: KalaTheme.deepIndigo),
        ),
      ),
    );
  }
}
