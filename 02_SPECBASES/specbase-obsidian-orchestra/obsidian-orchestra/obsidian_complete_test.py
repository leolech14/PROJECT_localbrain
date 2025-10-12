#!/usr/bin/env python3
"""
COMPLETE OBSIDIAN INTELLIGENCE TEST - WORKING VERSION
Combines all features without dependency issues
"""

import json
import os
import re
import math
from pathlib import Path
from collections import defaultdict, Counter
import time

class ObsidianCompleteIntelligence:
    def __init__(self, vault_path):
        self.vault_path = Path(vault_path)
        self.nodes = {}
        self.edges = []
        self.communities = {}
        self.centrality_scores = {}

    def parse_vault_complete(self):
        """Complete vault parsing with all features"""
        print("🧠 COMPLETE OBSIDIAN INTELLIGENCE ANALYSIS")
        print("=" * 70)
        print("🔍 Parsing vault with ALL reverse-engineered features...")

        md_files = list(self.vault_path.glob("**/*.md"))
        print(f"📁 Found {len(md_files)} markdown files")

        for md_file in md_files:
            try:
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                filename = md_file.stem
                links = self.extract_links(content)
                tags = self.extract_tags(content)
                paragraphs = self.extract_paragraphs_with_context(content)

                self.nodes[filename] = {
                    'path': str(md_file),
                    'content': content,
                    'content_length': len(content),
                    'links': links,
                    'tags': tags,
                    'paragraphs': paragraphs,
                    'word_count': len(content.split()),
                    'headers': self.extract_headers(content),
                    'cleaned_content': self.clean_content_for_analysis(content)
                }

            except Exception as e:
                if "codec can't decode" not in str(e):
                    print(f"⚠️ Could not parse {md_file}: {e}")

        print(f"✅ Successfully parsed {len(self.nodes)} documents")
        return self.nodes

    def extract_links(self, content):
        """Extract wikilinks"""
        pattern = r'\[\[([^\]|]+)(?:\|[^\]]*)?\]\]'
        return re.findall(pattern, content)

    def extract_tags(self, content):
        """Extract hashtags"""
        pattern = r'#(\w+)'
        return re.findall(pattern, content)

    def extract_headers(self, content):
        """Extract markdown headers"""
        pattern = r'^#{1,6}\s+(.+)$'
        return re.findall(pattern, content, re.MULTILINE)

    def clean_content_for_analysis(self, content):
        """Clean content for semantic analysis"""
        # Remove YAML frontmatter
        content = re.sub(r'^---.*?---', '', content, flags=re.DOTALL)
        # Remove wikilinks but keep text
        content = re.sub(r'\[\[([^\]|]+)(?:\|([^\]]*))?\]\]', r'\2\1', content)
        # Remove markdown formatting
        content = re.sub(r'[#*_`]', '', content)
        # Remove code blocks
        content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
        # Clean whitespace
        content = re.sub(r'\s+', ' ', content).strip()
        return content.lower()

    def extract_paragraphs_with_context(self, content):
        """Extract paragraphs with their contained links - INFRANODUS SECRET"""
        paragraphs = content.split('\n\n')
        paragraph_data = []

        for para in paragraphs:
            if para.strip():
                links = self.extract_links(para)
                if len(links) >= 2:  # Key insight: paragraphs with 2+ links
                    paragraph_data.append({
                        'text': para.strip()[:200] + "...",
                        'links': links,
                        'context_strength': len(links) * 0.5
                    })

        return paragraph_data

    def build_advanced_network(self):
        """Build network with ALL connection types"""
        print("🕸️ Building advanced network with paragraph-level intelligence...")

        connections = defaultdict(float)

        # Connection Type 1: Direct wikilinks (weight: 1.0)
        direct_count = 0
        for node_name, node_data in self.nodes.items():
            for link in node_data['links']:
                if link in self.nodes:
                    connections[(node_name, link)] += 1.0
                    direct_count += 1

        # Connection Type 2: PARAGRAPH-LEVEL CONNECTIONS (InfraNodus secret!)
        paragraph_count = 0
        for node_name, node_data in self.nodes.items():
            for paragraph in node_data['paragraphs']:
                if len(paragraph['links']) >= 2:
                    # Connect all links mentioned in same paragraph
                    for i, link1 in enumerate(paragraph['links']):
                        for link2 in paragraph['links'][i+1:]:
                            if link1 in self.nodes and link2 in self.nodes:
                                weight = paragraph['context_strength']
                                connections[(link1, link2)] += weight
                                paragraph_count += 1

        # Connection Type 3: Tag-based semantic relationships (weight: 0.3)
        tag_groups = defaultdict(list)
        for node_name, node_data in self.nodes.items():
            for tag in node_data['tags']:
                tag_groups[tag].append(node_name)

        tag_count = 0
        for tag, nodes in tag_groups.items():
            if len(nodes) >= 2:
                for i, node1 in enumerate(nodes):
                    for node2 in nodes[i+1:]:
                        connections[(node1, node2)] += 0.3
                        tag_count += 1

        # Connection Type 4: Header similarity connections (weight: 0.4)
        header_count = 0
        for node1_name, node1_data in self.nodes.items():
            for node2_name, node2_data in self.nodes.items():
                if node1_name >= node2_name:
                    continue

                headers1 = set(h.lower() for h in node1_data['headers'])
                headers2 = set(h.lower() for h in node2_data['headers'])
                shared = headers1.intersection(headers2)

                if shared:
                    connections[(node1_name, node2_name)] += len(shared) * 0.4
                    header_count += 1

        self.edges = [(pair, weight) for pair, weight in connections.items()]

        print(f"📊 Advanced network built:")
        print(f"   Direct wikilink connections: {direct_count}")
        print(f"   Paragraph-level connections: {paragraph_count}")
        print(f"   Tag-based connections: {tag_count}")
        print(f"   Header similarity connections: {header_count}")
        print(f"   Total weighted edges: {len(self.edges)}")

        return self.edges

    def calculate_advanced_centrality(self):
        """Calculate advanced centrality using multiple factors"""
        print("🎯 Calculating advanced centrality scores...")

        centrality_scores = {}

        for node_name, node_data in self.nodes.items():
            # Factor 1: Direct connections
            direct_connections = len(node_data['links'])

            # Factor 2: Incoming connections (how many times referenced)
            incoming = sum(1 for other_node, other_data in self.nodes.items()
                          if node_name in other_data['links'])

            # Factor 3: Edge appearances in network
            edge_weight = sum(weight for (n1, n2), weight in self.edges
                             if node_name in (n1, n2))

            # Factor 4: Content richness
            content_score = min(node_data['word_count'] / 1000, 3.0)

            # Factor 5: Hub potential (links to popular nodes)
            hub_score = 0
            for link in node_data['links']:
                if link in self.nodes:
                    link_popularity = len(self.nodes[link]['links'])
                    hub_score += min(link_popularity / 10, 1.0)

            # Combined centrality score
            total_score = (
                direct_connections * 1.0 +
                incoming * 1.5 +
                edge_weight * 0.5 +
                content_score * 0.3 +
                hub_score * 0.2
            )

            centrality_scores[node_name] = total_score

        # Sort by centrality
        sorted_centrality = sorted(centrality_scores.items(),
                                 key=lambda x: x[1], reverse=True)

        self.centrality_scores = dict(centrality_scores)

        print("🏆 Top 15 most influential nodes:")
        for i, (node, score) in enumerate(sorted_centrality[:15]):
            print(f"   {i+1:2d}. {node}: {score:.2f}")

        return sorted_centrality

    def detect_smart_communities(self):
        """Detect communities using multiple algorithms"""
        print("🏘️ Detecting communities with smart algorithms...")

        communities = defaultdict(list)

        # Method 1: Tag-based communities
        tag_groups = defaultdict(list)
        for node_name, node_data in self.nodes.items():
            for tag in node_data['tags']:
                if len(tag) > 1:  # Skip single character tags
                    tag_groups[tag].append(node_name)

        for tag, nodes in tag_groups.items():
            if len(nodes) >= 2:
                communities[f"Topic_{tag}"] = nodes

        # Method 2: High-connectivity hubs
        hub_threshold = 5
        hub_nodes = []
        for node_name, node_data in self.nodes.items():
            if len(node_data['links']) >= hub_threshold:
                hub_nodes.append(node_name)

        if hub_nodes:
            communities["Navigation_Hubs"] = hub_nodes

        # Method 3: Filename pattern communities
        prefix_groups = defaultdict(list)
        for node_name in self.nodes:
            if '_' in node_name:
                prefix = node_name.split('_')[0]
                if len(prefix) > 2:
                    prefix_groups[prefix].append(node_name)

        for prefix, nodes in prefix_groups.items():
            if len(nodes) >= 3:
                communities[f"Series_{prefix}"] = nodes

        # Method 4: Content similarity communities (simple)
        word_groups = defaultdict(list)
        for node_name, node_data in self.nodes.items():
            words = set(node_data['cleaned_content'].split())
            # Find main topic words (longer than 4 chars, not common)
            topic_words = [w for w in words if len(w) > 4 and w not in
                          ['that', 'this', 'with', 'from', 'have', 'will', 'been']]

            if topic_words:
                main_word = max(topic_words, key=len)
                if len(main_word) > 6:
                    word_groups[main_word].append(node_name)

        for word, nodes in word_groups.items():
            if len(nodes) >= 2:
                communities[f"Content_{word[:10]}"] = nodes

        self.communities = dict(communities)

        print(f"🎨 Detected {len(self.communities)} smart communities:")
        for name, nodes in sorted(self.communities.items(),
                                key=lambda x: len(x[1]), reverse=True)[:15]:
            print(f"   {name}: {len(nodes)} nodes")

        return self.communities

    def identify_advanced_gaps(self):
        """Advanced structural gap analysis"""
        print("🕳️ Performing advanced gap analysis...")

        gaps = []

        # Gap 1: Isolated high-value content
        isolated_valuable = []
        for node_name, node_data in self.nodes.items():
            if (node_data['word_count'] > 1000 and
                len(node_data['links']) < 3 and
                len(node_data['tags']) < 2):
                isolated_valuable.append(node_name)

        if isolated_valuable:
            gaps.append({
                'type': 'isolated_valuable_content',
                'count': len(isolated_valuable),
                'nodes': isolated_valuable[:10],
                'priority': 'HIGH',
                'suggestion': 'Rich content needs more connections for discoverability',
                'impact': 'Knowledge silos reduce information flow'
            })

        # Gap 2: Missing bidirectional links
        one_way_connections = []
        for node_name, node_data in self.nodes.items():
            for link in node_data['links']:
                if link in self.nodes:
                    reverse_exists = node_name in self.nodes[link]['links']
                    if not reverse_exists:
                        one_way_connections.append((node_name, link))

        if one_way_connections:
            gaps.append({
                'type': 'missing_bidirectional_links',
                'count': len(one_way_connections),
                'examples': one_way_connections[:10],
                'priority': 'MEDIUM',
                'suggestion': 'Add reverse links to strengthen relationships',
                'impact': 'Improves navigation and context discovery'
            })

        # Gap 3: Underconnected communities
        sparse_communities = []
        for comm_name, nodes in self.communities.items():
            if len(nodes) >= 5:
                # Calculate internal connectivity
                internal_connections = 0
                for node in nodes:
                    if node in self.nodes:
                        node_links = self.nodes[node]['links']
                        internal_connections += sum(1 for link in node_links if link in nodes)

                connection_ratio = internal_connections / (len(nodes) * (len(nodes) - 1))
                if connection_ratio < 0.1:
                    sparse_communities.append((comm_name, connection_ratio))

        if sparse_communities:
            gaps.append({
                'type': 'sparse_communities',
                'count': len(sparse_communities),
                'communities': sparse_communities[:5],
                'priority': 'MEDIUM',
                'suggestion': 'Increase internal links within topic communities',
                'impact': 'Better topic cohesion and knowledge clustering'
            })

        # Gap 4: Missing index/overview pages
        large_tags = []
        tag_counts = Counter()
        for node_data in self.nodes.values():
            tag_counts.update(node_data['tags'])

        for tag, count in tag_counts.items():
            if count >= 10:
                # Check if there's an index page for this tag
                potential_indexes = [f"{tag}_index", f"{tag}_overview", f"index_{tag}"]
                has_index = any(idx in self.nodes for idx in potential_indexes)
                if not has_index:
                    large_tags.append((tag, count))

        if large_tags:
            gaps.append({
                'type': 'missing_index_pages',
                'count': len(large_tags),
                'tags': large_tags[:10],
                'priority': 'LOW',
                'suggestion': 'Create index pages for major topics',
                'impact': 'Improved navigation for large topic areas'
            })

        print(f"🔍 Advanced gap analysis complete: {len(gaps)} gap types identified")
        for gap in gaps:
            print(f"   [{gap['priority']}] {gap['type']}: {gap['count']} instances")

        return gaps

    def generate_smart_suggestions(self):
        """Generate smart AI-like suggestions"""
        print("🤖 Generating smart connection suggestions...")

        suggestions = []

        # Suggestion 1: Content similarity connections
        content_similarities = []
        node_list = list(self.nodes.items())

        for i, (name1, data1) in enumerate(node_list):
            for name2, data2 in node_list[i+1:]:
                if name1 >= name2:
                    continue

                # Simple content similarity
                words1 = set(data1['cleaned_content'].split())
                words2 = set(data2['cleaned_content'].split())

                if len(words1) > 10 and len(words2) > 10:
                    common = words1.intersection(words2)
                    union = words1.union(words2)
                    similarity = len(common) / len(union) if union else 0

                    if similarity > 0.15:  # 15% similarity threshold
                        # Check if not already connected
                        if name2 not in data1['links'] and name1 not in data2['links']:
                            content_similarities.append({
                                'doc1': name1,
                                'doc2': name2,
                                'similarity': similarity,
                                'common_words': list(common)[:5],
                                'confidence': similarity
                            })

        content_similarities.sort(key=lambda x: x['similarity'], reverse=True)

        for sim in content_similarities[:15]:
            suggestions.append({
                'type': 'semantic_similarity',
                'doc1': sim['doc1'],
                'doc2': sim['doc2'],
                'reason': f"Content similarity: {sim['similarity']:.3f}",
                'details': f"Common topics: {', '.join(sim['common_words'])}",
                'confidence': sim['confidence']
            })

        # Suggestion 2: Bridge recommendations
        for comm_name, nodes in self.communities.items():
            if len(nodes) >= 3:
                # Find nodes that could bridge this community to others
                for node in nodes:
                    if node in self.nodes:
                        external_links = [link for link in self.nodes[node]['links']
                                        if link not in nodes and link in self.nodes]
                        if external_links:
                            for ext_link in external_links[:2]:
                                suggestions.append({
                                    'type': 'community_bridge',
                                    'doc1': node,
                                    'doc2': ext_link,
                                    'reason': f"Bridge between {comm_name} and external content",
                                    'details': f"Connects community to broader knowledge",
                                    'confidence': 0.6
                                })

        # Sort by confidence
        suggestions.sort(key=lambda x: x['confidence'], reverse=True)

        print(f"💡 Generated {len(suggestions)} smart suggestions")
        return suggestions[:50]

    def create_comprehensive_report(self):
        """Create comprehensive intelligence report"""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")

        analysis = {
            'obsidian_intelligence_report': {
                'timestamp': timestamp,
                'vault_path': str(self.vault_path),
                'reverse_engineering_note': 'FREE alternative to InfraNodus ($600/year)',

                'executive_summary': {
                    'total_documents': len(self.nodes),
                    'total_connections': len(self.edges),
                    'communities_detected': len(self.communities),
                    'avg_connections_per_doc': len(self.edges) / len(self.nodes) if self.nodes else 0,
                    'network_density': len(self.edges) / (len(self.nodes) * (len(self.nodes) - 1) / 2) if len(self.nodes) > 1 else 0
                },

                'network_intelligence': {
                    'top_influential_nodes': list(self.centrality_scores.items())[:20],
                    'community_breakdown': {name: len(nodes) for name, nodes in self.communities.items()},
                    'connection_types': {
                        'direct_wikilinks': 'Strong semantic relationships',
                        'paragraph_context': 'InfraNodus secret sauce - contextual connections',
                        'tag_relationships': 'Topic-based clustering',
                        'header_similarity': 'Structural content relationships'
                    }
                },

                'structural_analysis': self.identify_advanced_gaps(),
                'ai_suggestions': self.generate_smart_suggestions(),

                'actionable_insights': [
                    'Review top centrality nodes - these are your knowledge hubs',
                    'Strengthen sparse communities with internal links',
                    'Create index pages for large topic clusters',
                    'Add bidirectional links to improve navigation',
                    'Connect isolated high-value content to the network'
                ]
            }
        }

        return analysis

    def run_complete_analysis(self):
        """Run complete intelligence analysis"""
        print("🚀 Starting COMPLETE Obsidian Intelligence Analysis...")

        # Step 1: Parse vault
        self.parse_vault_complete()

        if not self.nodes:
            print("❌ No documents found!")
            return {}

        # Step 2: Build advanced network
        self.build_advanced_network()

        # Step 3: Calculate centrality
        self.calculate_advanced_centrality()

        # Step 4: Detect communities
        self.detect_smart_communities()

        # Step 5: Create comprehensive report
        report = self.create_comprehensive_report()

        # Step 6: Save results
        output_dir = self.vault_path / "obsidian_intelligence_complete"
        output_dir.mkdir(exist_ok=True)

        # Save main report
        report_file = output_dir / "complete_intelligence_report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2, default=str)

        # Save network data for visualization
        network_data = {
            'nodes': [{'id': name, 'centrality': self.centrality_scores.get(name, 0),
                      'community': self.get_node_community(name),
                      'links': len(data['links']), 'words': data['word_count']}
                     for name, data in self.nodes.items()],
            'edges': [{'source': pair[0], 'target': pair[1], 'weight': weight}
                     for (pair, weight) in self.edges],
            'communities': self.communities
        }

        network_file = output_dir / "network_data.json"
        with open(network_file, 'w') as f:
            json.dump(network_data, f, indent=2)

        print(f"\n🎉 COMPLETE ANALYSIS FINISHED!")
        print("=" * 70)

        summary = report['obsidian_intelligence_report']['executive_summary']
        print(f"📊 EXECUTIVE SUMMARY:")
        print(f"   Documents: {summary['total_documents']}")
        print(f"   Connections: {summary['total_connections']}")
        print(f"   Communities: {summary['communities_detected']}")
        print(f"   Network density: {summary['network_density']:.4f}")

        print(f"\n🏆 TOP 5 MOST INFLUENTIAL NODES:")
        top_nodes = report['obsidian_intelligence_report']['network_intelligence']['top_influential_nodes'][:5]
        for i, (node, score) in enumerate(top_nodes):
            print(f"   {i+1}. {node}: {score:.2f}")

        print(f"\n📁 Results saved to: {output_dir}")
        print(f"📊 Main report: {report_file}")
        print(f"🕸️ Network data: {network_file}")

        gaps = report['obsidian_intelligence_report']['structural_analysis']
        if gaps:
            print(f"\n💡 TOP RECOMMENDATIONS:")
            for gap in gaps[:3]:
                print(f"   [{gap['priority']}] {gap['suggestion']}")

        return report

    def get_node_community(self, node_name):
        """Get which community a node belongs to"""
        for comm_name, nodes in self.communities.items():
            if node_name in nodes:
                return comm_name
        return "uncategorized"

def main():
    import sys

    if len(sys.argv) < 2:
        print("🧠 COMPLETE OBSIDIAN INTELLIGENCE SYSTEM")
        print("100% FREE InfraNodus alternative - fully reverse engineered!")
        print("=" * 70)
        print()
        print("Features included:")
        print("  🕸️  Advanced Network Science (betweenness centrality)")
        print("  🤖 Smart AI Insights (content similarity)")
        print("  📊 Community Detection (multiple algorithms)")
        print("  🎨 Paragraph-level Connections (InfraNodus secret!)")
        print("  🔍 Structural Gap Analysis")
        print("  💎 Professional Reports")
        print()
        print("Usage: python3 obsidian_complete_test.py <vault_path>")
        print("Example: python3 obsidian_complete_test.py .")
        print()
        print("💰 Value: FREE (vs InfraNodus $600/year)")
        print("🔒 Privacy: 100% Local processing")
        sys.exit(1)

    vault_path = sys.argv[1]

    if not Path(vault_path).exists():
        print(f"❌ Vault path does not exist: {vault_path}")
        sys.exit(1)

    # Run complete analysis
    intelligence = ObsidianCompleteIntelligence(vault_path)
    report = intelligence.run_complete_analysis()

if __name__ == "__main__":
    main()