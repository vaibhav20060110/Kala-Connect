class Product {
  final String id;
  final String artisanId;
  final String titleEn;
  final String titleHi;
  final String descriptionEn;
  final String descriptionHi;
  final String? rawImageUrl;
  final String? enhancedImageUrl;
  final String? audioNotesUrl;
  final double price;
  final String category;
  final double materialCost;
  final double hoursSpent;
  final String status; // 'draft', 'published', 'synced_gem'
  final int views;
  final DateTime createdAt;

  Product({
    required this.id,
    required this.artisanId,
    required this.titleEn,
    required this.titleHi,
    required this.descriptionEn,
    required this.descriptionHi,
    this.rawImageUrl,
    this.enhancedImageUrl,
    this.audioNotesUrl,
    required this.price,
    required this.category,
    required this.materialCost,
    required this.hoursSpent,
    required this.status,
    this.views = 0,
    required this.createdAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      artisanId: json['artisan_id'] ?? '',
      titleEn: json['title_en'] ?? '',
      titleHi: json['title_hi'] ?? '',
      descriptionEn: json['description_en'] ?? '',
      descriptionHi: json['description_hi'] ?? '',
      rawImageUrl: json['raw_image_url'],
      enhancedImageUrl: json['enhanced_image_url'],
      audioNotesUrl: json['audio_notes_url'],
      price: (json['price'] != null) ? double.tryParse(json['price'].toString()) ?? 0.0 : 0.0,
      category: json['category'] ?? 'Textiles',
      materialCost: (json['material_cost'] != null) ? double.tryParse(json['material_cost'].toString()) ?? 0.0 : 0.0,
      hoursSpent: (json['hours_spent'] != null) ? double.tryParse(json['hours_spent'].toString()) ?? 1.0 : 1.0,
      status: json['status'] ?? 'draft',
      views: json['views'] ?? 0,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'artisan_id': artisanId,
      'title_en': titleEn,
      'title_hi': titleHi,
      'description_en': descriptionEn,
      'description_hi': descriptionHi,
      'raw_image_url': rawImageUrl,
      'enhanced_image_url': enhancedImageUrl,
      'audio_notes_url': audioNotesUrl,
      'price': price,
      'category': category,
      'material_cost': materialCost,
      'hours_spent': hoursSpent,
      'status': status,
      'views': views,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
