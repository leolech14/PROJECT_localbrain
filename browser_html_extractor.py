#!/usr/bin/env python3
"""
🌐 BROWSER HTML EXTRACTOR - ULTRATHINK EDITION
Extracts HTML content from all open browser tabs
Works with file:// URLs (local HTML files)
"""

import asyncio
from playwright.sync_api import sync_playwright, BrowserContext, Page
from datetime import datetime
import os
import sys
from pathlib import Path

def extract_html_from_open_tabs():
    """🔍 ULTRATHINK: Extract HTML from all open browser tabs"""

    # File patterns to extract (our megalith HTML files)
    target_patterns = [
        "*LocalBrain*",
        "*test-data*",
        "*PRODUCT*",
        "*maximum_extraction*",
        "*calendar*",
        "*/PROJECT_lechworld/*",
        "*/LocalBrain/*"
    ]

    weekday_names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    now = datetime.now()

    with sync_playwright() as p:
        # Launch browser with context
        browser = p.chromium.launch(headless=False)  # Show browser for debugging

        # Create context
        context = browser.new_context()

        # Create page
        page = context.new_page()

        print("🌐 BROWSER HTML EXTRACTOR - ULTRATHINK MODE")
        print("=" * 50)
        print("🎯 TARGETING: Megalith HTML files from open tabs")
        print("📁 SAVE LOCATION: Current directory")
        print("=" * 50)

        # Navigate to a local file to get browser context
        page.goto("file:///Users/lech/PROJECTS_all/LocalBrain")

        # Inject JavaScript to get all open tabs
        js_code = """
        // Get all open tabs and filter for our target files
        async function getBrowserTabs() {
            const tabs = [];

            // Check if we can access browser tabs (limited in file:// context)
            try {
                // For Chromium, we can try to get recent URLs from browser context
                const tabsList = [];

                // Get all file:// URLs from browser history (recent)
                const history = await new Promise((resolve) => {
                    if (chrome && chrome.history) {
                        chrome.history.search({
                            text: 'file:///Users/lech/PROJECTS_all/',
                            maxResults: 100,
                            startTime: Date.now() - 24 * 60 * 60 * 1000 // Last 24 hours
                        }, resolve);
                    } else {
                        resolve([]);
                    }
                });

                tabsList.push(...history);

                // Filter for our target patterns
                const targetPatterns = ["LocalBrain", "test-data", "PRODUCT", "maximum_extraction", "calendar", "PROJECT_lechworld"];

                return tabsList.filter(item => {
                    return targetPatterns.some(pattern =>
                        item.url && item.url.includes(pattern)
                    );
                });

            } catch (error) {
                console.log('Cannot access browser tabs, using fallback method');
                return [];
            }
        }

        return await getBrowserTabs();
        """

        try:
            # Execute script to get tab information
            result = page.evaluate(js_code)

            if result and len(result) > 0:
                print(f"📊 FOUND {len(result)} RELEVANT TABS!")

                for i, tab in enumerate(result, 1):
                    if tab.get('url'):
                        url = tab['url']
                        title = tab.get('title', 'Unknown')

                        print(f"\n📄 TAB {i}: {title}")
                        print(f"   URL: {url}")

                        # Extract filename from URL
                        if url.startswith('file://'):
                            filepath = url.replace('file://', '')

                            # Generate timestamped output filename
                            timestamp = f"{now.hour:02d}{weekday_names[now.weekday()]}{now.day}{month_names[now.month-1]}{now.year}"
                            clean_title = ''.join(c if c.isalnum() or c == '_' else '_' for c in title)
                            output_filename = f"EXTRACTED_{clean_title}_{timestamp}.html"

                            print(f"   🎬 Saving to: {output_filename}")

                            # Navigate to the file and extract HTML
                            page.goto(url)

                            # Wait for content to load
                            page.wait_for_load_state('networkidle')

                            # Extract the HTML content
                            html_content = page.content()

                            # Save to file
                            with open(output_filename, 'w', encoding='utf-8') as f:
                                f.write(html_content)

                            file_size = len(html_content)
                            print(f"   ✅ Saved: {file_size:,} bytes")
                        else:
                            print(f"   ⚠️ Skipping non-file URL: {url}")
            else:
                print("📊 No relevant browser tabs found in history")

        except Exception as e:
            print(f"❌ Error accessing browser tabs: {e}")

        # Fallback method: Try to extract from known file paths
        print("\n🔄 FALLBACK METHOD: Extracting from known file paths...")

        known_paths = [
            "/Users/lech/PROJECTS_all/LocalBrain/LocalBrain_16Fri10Oct2025.html",
            "/Users/lech/PROJECTS_all/LocalBrain/LocalBrain_analysis_report.html",
            "/Users/lech/PROJECTS_all/LocalBrain/maximum_extraction_report.html",
            "/Users/lech/PROJECTS_all/LocalBrain/test-data_16Fri10Oct2025.html",
            "/Users/lech/PROJECTS_all/LocalBrain/PRODUCT_analysis_report.html",
            "/Users/lech/PROJECTS_all/LocalBrain/--help_analysis_report.html",
            "/Users/lech/PROJECTS_all/PROJECT_lechworld/PRODUCT_analysis_report.html",
            "/Users/lech/PROJECTS_all/PROJECT_lechworld/maximum_extraction_report.html",
            "/Users/lech/PROJECTS_all/PROJECT_lechworld/calendar_file_explorer_demo.html"
        ]

        for i, filepath in enumerate(known_paths, 1):
            if os.path.exists(filepath):
                print(f"\n📄 PATH {i}: {filepath}")

                # Generate timestamped output filename
                path_obj = Path(filepath)
                filename = path_obj.name
                timestamp = f"{now.hour:02d}{weekday_names[now.weekday()]}{now.day}{month_names[now.month-1]}{now.year}"
                output_filename = f"EXTRACTED_{filename}_BROWSER_{timestamp}.html"

                print(f"   🎬 Saving to: {output_filename}")

                try:
                    # Navigate to the file
                    page.goto(f"file://{filepath}")

                    # Wait for content to load
                    page.wait_for_load_state('networkidle')

                    # Extract the HTML content
                    html_content = page.content()

                    # Save to file
                    with open(output_filename, 'w', encoding='utf-8') as f:
                        f.write(html_content)

                    file_size = len(html_content)
                    print(f"   ✅ Saved: {file_size:,} bytes")

                except Exception as e:
                    print(f"   ❌ Error extracting {filepath}: {e}")
            else:
                print(f"   ⚠️ File not found: {filepath}")

        # Clean up
        context.close()
        browser.close()

        print("\n" + "=" * 50)
        print("🎉 EXTRACTION COMPLETE!")
        print(f"📂 All files saved to: {os.getcwd()}")
        print("🕐 Timestamp format: HHDayDDMonthYYYY")
        print("=" * 50)

if __name__ == "__main__":
    extract_html_from_open_tabs()