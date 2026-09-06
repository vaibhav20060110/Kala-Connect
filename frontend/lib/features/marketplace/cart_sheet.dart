import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../core/localization.dart';
import '../../core/api_service.dart';
import '../../models/product.dart';

class CartItem {
  final Product product;
  int quantity;

  CartItem({required this.product, this.quantity = 1});
}

class CartSheet extends StatefulWidget {
  final List<CartItem> cartItems;
  final VoidCallback onCartUpdated;
  final VoidCallback onOrderPlaced;

  const CartSheet({
    Key? key,
    required this.cartItems,
    required this.onCartUpdated,
    required this.onOrderPlaced,
  }) : super(key: key);

  @override
  State<CartSheet> createState() => _CartSheetState();
}

class _CartSheetState extends State<CartSheet> {
  final _nameController = TextEditingController(text: 'Valued Patron');
  final _phoneController = TextEditingController(text: '9876543210');
  final _addressController = TextEditingController(text: 'Lucknow, Uttar Pradesh');
  String _paymentMethod = 'upi';
  bool _isSubmitting = false;

  double get _subtotal {
    return widget.cartItems.fold(0, (sum, item) => sum + (item.product.price * item.quantity));
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _handleCheckout(BuildContext context) async {
    if (widget.cartItems.isEmpty) return;

    setState(() => _isSubmitting = true);

    final orderPayload = {
      'customer_name': _nameController.text.trim(),
      'customer_phone': _phoneController.text.trim().startsWith('+91')
          ? _phoneController.text.trim()
          : '+91 ${_phoneController.text.trim()}',
      'customer_address': _addressController.text.trim(),
      'payment_method': _paymentMethod,
      'total_amount': _subtotal,
      'items': widget.cartItems.map((item) => {
        'product_id': item.product.id,
        'title_en': item.product.titleEn,
        'title_hi': item.product.titleHi,
        'price': item.product.price,
        'qty': item.quantity,
      }).toList(),
      'notes': 'Placed via kalaSetu Flutter Mobile App',
    };

    final result = await ApiService.createOrder(orderPayload);

    if (mounted) {
      setState(() => _isSubmitting = false);
      Navigator.pop(context);

      final orderId = result['order']?['id'] ?? 'ORD-SUCCESS';
      _showOrderSuccessDialog(context, orderId);
      widget.onOrderPlaced();
    }
  }

  void _showOrderSuccessDialog(BuildContext context, String orderId) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Text('🎉 ', style: TextStyle(fontSize: 24)),
            Text('ऑर्डर दर्ज हुआ!', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Order ID: $orderId', style: const TextStyle(fontWeight: FontWeight.bold, color: KalaTheme.terracotta)),
            const SizedBox(height: 10),
            const Text(
              'शिल्पकार को ऑर्डर का विवरण भेज दिया गया है। आपकी कलाकृति सुरक्षित रूप से तैयार की जाएगी।',
              style: TextStyle(fontSize: 13, height: 1.4),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: KalaTheme.terracotta,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () => Navigator.pop(ctx),
            child: const Text('ठीक है (Done)'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom + 16,
        left: 20,
        right: 20,
        top: 20,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: widget.cartItems.isEmpty
          ? const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 40),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.shopping_bag_outlined, size: 60, color: Colors.grey),
                    SizedBox(height: 12),
                    Text('आपकी टोकरी खाली है (Cart is empty)', style: TextStyle(fontSize: 16, color: Colors.grey)),
                  ],
                ),
              ),
            )
          : SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        '🛒 आपकी झोली (Cart)',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const Divider(),
                  ...widget.cartItems.map((item) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: Container(
                                width: 50,
                                height: 50,
                                color: Colors.amber.shade50,
                                child: const Icon(Icons.palette, color: KalaTheme.terracotta),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.product.titleEn,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  Text('₹${item.product.price.toStringAsFixed(0)}',
                                      style: const TextStyle(color: KalaTheme.terracotta, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.remove_circle_outline, size: 20),
                              onPressed: () {
                                setState(() {
                                  if (item.quantity > 1) {
                                    item.quantity--;
                                  } else {
                                    widget.cartItems.remove(item);
                                  }
                                });
                                widget.onCartUpdated();
                              },
                            ),
                            Text('${item.quantity}', style: const TextStyle(fontWeight: FontWeight.bold)),
                            IconButton(
                              icon: const Icon(Icons.add_circle_outline, size: 20),
                              onPressed: () {
                                setState(() => item.quantity++);
                                widget.onCartUpdated();
                              },
                            ),
                          ],
                        ),
                      )),
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('कुल देय राशि (Subtotal):', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      Text(
                        '₹${_subtotal.toStringAsFixed(0)}',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: KalaTheme.terracotta),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text('📍 डिलीवरी विवरण (Customer Info)', style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'नाम (Name)',
                      isDense: true,
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                      labelText: 'फ़ोन नंबर (Phone / WhatsApp)',
                      isDense: true,
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _addressController,
                    decoration: const InputDecoration(
                      labelText: 'डिलीवरी पता (Delivery Address)',
                      isDense: true,
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: KalaTheme.terracotta,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: _isSubmitting ? null : () => _handleCheckout(context),
                      child: _isSubmitting
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : const Text(
                              'ऑर्डर की पुष्टि करें (Confirm Order) ➔',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
