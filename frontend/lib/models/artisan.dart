class Artisan {
  final String id;
  final String userId;
  final String name;
  final String craftType;
  final String location;
  final String languagePref;

  Artisan({
    required this.id,
    required this.userId,
    required this.name,
    required this.craftType,
    required this.location,
    required this.languagePref,
  });

  factory Artisan.fromJson(Map<String, dynamic> json) {
    return Artisan(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      name: json['name'] ?? '',
      craftType: json['craft_type'] ?? '',
      location: json['location'] ?? '',
      languagePref: json['language_pref'] ?? 'hi',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'name': name,
      'craft_type': craftType,
      'location': location,
      'language_pref': languagePref,
    };
  }
}

class PriceSuggestion {
  final double suggestedMin;
  final double suggestedMax;
  final double suggestedPrice;
  final String justification;
  final String? justificationHi;
  final List<dynamic>? comparablesUsed;

  PriceSuggestion({
    required this.suggestedMin,
    required this.suggestedMax,
    required this.suggestedPrice,
    required this.justification,
    this.justificationHi,
    this.comparablesUsed,
  });

  factory PriceSuggestion.fromJson(Map<String, dynamic> json) {
    return PriceSuggestion(
      suggestedMin: (json['suggested_min'] != null) ? double.tryParse(json['suggested_min'].toString()) ?? 0.0 : 0.0,
      suggestedMax: (json['suggested_max'] != null) ? double.tryParse(json['suggested_max'].toString()) ?? 0.0 : 0.0,
      suggestedPrice: (json['suggested_price'] != null) ? double.tryParse(json['suggested_price'].toString()) ?? 0.0 : 0.0,
      justification: json['justification'] ?? '',
      justificationHi: json['justification_hi'],
      comparablesUsed: json['comparables_used'] as List<dynamic>?,
    );
  }
}
