import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/localization.dart';
import '../../core/theme.dart';

class GeMSyncModal extends StatefulWidget {
  const GeMSyncModal({Key? key}) : super(key: key);

  @override
  State<GeMSyncModal> createState() => _GeMSyncModalState();
}

class _GeMSyncModalState extends State<GeMSyncModal> {
  bool _isSynced = false;
  bool _isSyncing = false;

  void _handleSync() {
    setState(() => _isSyncing = true);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isSyncing = false;
          _isSynced = true;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final loc = Provider.of<KalaLocalization>(context);

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E3A8A).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text('🏛️', style: TextStyle(fontSize: 24)),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    loc.text('gem_title'),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: KalaTheme.deepIndigo),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.close_rounded),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            loc.text('gem_sub'),
            style: TextStyle(fontSize: 14, color: KalaTheme.deepIndigo.withOpacity(0.7), height: 1.4),
          ),
          const SizedBox(height: 20),

          // Government & ODOP Badges
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: KalaTheme.warmCream,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: KalaTheme.borderSubtle),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    const Icon(Icons.verified_rounded, color: KalaTheme.forestGreen, size: 22),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        loc.text('odop_eligible'),
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: KalaTheme.deepIndigo),
                      ),
                    ),
                  ],
                ),
                const Divider(height: 20),
                Row(
                  children: [
                    const Icon(Icons.handshake_rounded, color: KalaTheme.terracotta, size: 22),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        loc.isHindi
                            ? 'B2B थोक खरीददार: 3 नए सरकारी विभागों ने आपकी कला में रुचि दिखाई है'
                            : 'B2B Wholesale: 3 Government PSUs viewed your handicraft catalog',
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: KalaTheme.deepIndigo),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Sync Action Button
          if (_isSynced) ...[
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: KalaTheme.forestGreen.withOpacity(0.12),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: KalaTheme.forestGreen, width: 1.5),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.check_circle_rounded, color: KalaTheme.forestGreen),
                  const SizedBox(width: 8),
                  Text(
                    loc.text('synced_badge'),
                    style: const TextStyle(color: KalaTheme.forestGreen, fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ],
              ),
            ),
          ] else ...[
            ElevatedButton(
              onPressed: _isSyncing ? null : _handleSync,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E3A8A), // GeM Navy Blue
              ),
              child: _isSyncing
                  ? const CircularProgressIndicator(color: Colors.white)
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.sync_rounded),
                        const SizedBox(width: 8),
                        Text(loc.text('sync_to_gem')),
                      ],
                    ),
            ),
          ],
          const SizedBox(height: 12),
        ],
      ),
    );
  }
}
