#!/usr/bin/env python3
"""
🧬 FEATURE DENSITY ANALYSIS
Analyzes which HTML files have the richest feature sets
Identifies feature density and completeness scores
"""

import json
from pathlib import Path

class FeatureDensityAnalyzer:
    def __init__(self):
        # Load the comprehensive registry
        with open('COMPREHENSIVE_COMPONENT_REGISTRY.json', 'r') as f:
            self.registry = json.load(f)

        # Get all HTML files
        self.html_files = list(Path('.').glob('*.html'))

    def analyze_feature_density(self):
        """Analyze feature density per HTML file"""
        print("🧬 FEATURE DENSITY ANALYSIS")
        print("=" * 60)

        density_scores = {}

        for html_file in self.html_files:
            if html_file.stat().st_size < 1000:  # Skip small files
                continue

            file_name = html_file.name
            print(f"\n📄 Analyzing: {file_name}")

            # Count features found in this file
            features_in_file = 0
            categories_in_file = set()
            unique_features = set()

            for feature_name, feature_data in self.registry['feature_registry'].items():
                if file_name in feature_data['sources']:
                    features_in_file += feature_data['occurrences']
                    categories_in_file.update(feature_data['feature_types'])
                    unique_features.add(feature_name)

            # Calculate density score
            file_size_kb = html_file.stat().st_size / 1024
            density_score = features_in_file / file_size_kb  # features per KB

            density_scores[file_name] = {
                'total_features': features_in_file,
                'unique_features': len(unique_features),
                'categories': len(categories_in_file),
                'file_size_kb': file_size_kb,
                'density_score': density_score,
                'categories_list': list(categories_in_file),
                'top_features': self._get_top_features_for_file(file_name)
            }

            print(f"   📊 {features_in_file} total features")
            print(f"   🔢 {len(unique_features)} unique features")
            print(f"   📋 {len(categories_in_file)} categories")
            print(f"   📏 {file_size_kb:.1f} KB")
            print(f"   📈 Density score: {density_score:.2f} features/KB")
            print(f"   🎯 Categories: {', '.join(sorted(categories_in_file))}")

        # Sort by density score
        sorted_by_density = sorted(density_scores.items(), key=lambda x: x[1]['density_score'], reverse=True)

        return density_scores, sorted_by_density

    def _get_top_features_for_file(self, file_name, top_n=10):
        """Get top features for a specific file"""
        file_features = []

        for feature_name, feature_data in self.registry['feature_registry'].items():
            if file_name in feature_data['sources']:
                file_features.append((feature_name, feature_data['occurrences']))

        # Sort by occurrence count
        file_features.sort(key=lambda x: x[1], reverse=True)
        return file_features[:top_n]

    def identify_richest_files(self, sorted_by_density):
        """Identify the richest HTML files"""
        print(f"\n🏆 RICHEST HTML FILES BY FEATURE DENSITY:")
        print("=" * 60)

        print(f"\n🥇 TOP 5 MOST FEATURE-RICH FILES:")
        for i, (file_name, data) in enumerate(sorted_by_density[:5], 1):
            print(f"{i}. {file_name}")
            print(f"   📊 {data['total_features']} features, {data['unique_features']} unique")
            print(f"   📋 {data['categories']} categories, density: {data['density_score']:.2f}/KB")
            print(f"   🎯 Top features: {', '.join([f[0] for f in data['top_features'][:3]])}")
            print()

    def identify_feature_completeness_gaps(self, sorted_by_density):
        """Identify which features are missing from less complete files"""
        print(f"\n🔍 FEATURE COMPLETENESS ANALYSIS:")
        print("=" * 60)

        # Get the richest file as reference
        richest_file = sorted_by_density[0][0]
        richest_features = set(self.registry['feature_registry'].keys())

        # Check what features are missing from each file
        for file_name, data in sorted_by_density[1:]:  # Skip the richest
            file_features = set()

            for feature_name, feature_data in self.registry['feature_registry'].items():
                if file_name in feature_data['sources']:
                    file_features.add(feature_name)

            missing_features = richest_features - file_features

            print(f"\n📄 {file_name}:")
            print(f"   ✅ Has {data['unique_features']} features")
            print(f"   ❌ Missing {len(missing_features)} features from richest file")

            if missing_features:
                missing_list = sorted(list(missing_features))[:10]
                print(f"   📝 Missing: {', '.join(missing_list)}")

    def generate_completeness_matrix(self, sorted_by_density):
        """Generate a completeness matrix showing which files have which features"""
        print(f"\n📊 FEATURE COMPLETENESS MATRIX:")
        print("=" * 60)

        # Get all unique features and files
        all_features = list(self.registry['feature_registry'].keys())[:20]  # Top 20 features
        files = [item[0] for item in sorted_by_density[:8]]  # Top 8 files

        print(f"\n📋 Matrix (✅ = Present, ❌ = Missing)")
        header_row = "Feature".ljust(25) + "  ".join([f[:12].ljust(12) for f in files])
        print(header_row)
        print("-" * (25 + 13 * len(files)))

        for feature in all_features:
            row = feature[:24] + " "
            for file_name in files:
                has_feature = file_name in self.registry['feature_registry'][feature]['sources']
                row += "    ✅     " if has_feature else "    ❌     "
            print(row)

    def run_density_analysis(self):
        """Run the complete feature density analysis"""
        density_scores, sorted_by_density = self.analyze_feature_density()
        self.identify_richest_files(sorted_by_density)
        self.identify_feature_completeness_gaps(sorted_by_density)
        self.generate_completeness_matrix(sorted_by_density)

        return density_scores, sorted_by_density

if __name__ == "__main__":
    analyzer = FeatureDensityAnalyzer()
    scores, sorted_files = analyzer.run_density_analysis()

    print(f"\n🎉 FEATURE DENSITY ANALYSIS COMPLETE!")
    print(f"📄 Use this analysis to identify which HTML files to use as references")

if __name__ == "__main__":
    analyzer = FeatureDensityAnalyzer()
    scores, sorted_files = analyzer.run_density_analysis()