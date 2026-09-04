import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class QueuedUploadItem {
  final String id;
  final String type; // 'image' or 'audio' or 'product'
  final String localFilePath;
  final Map<String, dynamic> metadata;
  final DateTime queuedAt;
  int retryAttempts;

  QueuedUploadItem({
    required this.id,
    required this.type,
    required this.localFilePath,
    required this.metadata,
    required this.queuedAt,
    this.retryAttempts = 0,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'type': type,
    'localFilePath': localFilePath,
    'metadata': metadata,
    'queuedAt': queuedAt.toIso8601String(),
    'retryAttempts': retryAttempts,
  };

  factory QueuedUploadItem.fromJson(Map<String, dynamic> json) => QueuedUploadItem(
    id: json['id'],
    type: json['type'],
    localFilePath: json['localFilePath'],
    metadata: json['metadata'] != null ? Map<String, dynamic>.from(json['metadata']) : {},
    queuedAt: DateTime.parse(json['queuedAt']),
    retryAttempts: json['retryAttempts'] ?? 0,
  );
}

class OfflineUploadQueue extends ChangeNotifier {
  static const String _storageKey = 'kalasetu_offline_queue';
  final List<QueuedUploadItem> _queue = [];

  List<QueuedUploadItem> get queue => List.unmodifiable(_queue);
  int get pendingCount => _queue.length;

  OfflineUploadQueue() {
    _loadQueue();
  }

  Future<void> _loadQueue() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final rawList = prefs.getStringList(_storageKey) ?? [];
      _queue.clear();
      for (final itemStr in rawList) {
        _queue.add(QueuedUploadItem.fromJson(jsonDecode(itemStr)));
      }
      notifyListeners();
    } catch (e) {
      debugPrint('[OfflineQueue] Error loading saved queue: $e');
    }
  }

  Future<void> _persistQueue() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final stringList = _queue.map((item) => jsonEncode(item.toJson())).toList();
      await prefs.setStringList(_storageKey, stringList);
    } catch (e) {
      debugPrint('[OfflineQueue] Error persisting queue: $e');
    }
  }

  Future<void> enqueueItem({
    required String type,
    required String localFilePath,
    required Map<String, dynamic> metadata,
  }) async {
    final item = QueuedUploadItem(
      id: 'queue_${DateTime.now().millisecondsSinceEpoch}',
      type: type,
      localFilePath: localFilePath,
      metadata: metadata,
      queuedAt: DateTime.now(),
    );
    _queue.add(item);
    await _persistQueue();
    notifyListeners();
    debugPrint('[OfflineQueue] Enqueued offline ${type} upload: ${item.id}');
  }

  Future<void> removeItem(String id) async {
    _queue.removeWhere((item) => item.id == id);
    await _persistQueue();
    notifyListeners();
  }

  Future<void> clearQueue() async {
    _queue.clear();
    await _persistQueue();
    notifyListeners();
  }
}
