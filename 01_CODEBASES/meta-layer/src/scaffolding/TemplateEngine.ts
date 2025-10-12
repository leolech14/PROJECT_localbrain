/**
 * 🎨 Template Engine
 * ==================
 *
 * Template rendering system for the META layer AutoScaffolder.
 * Supports variable substitution and conditional rendering.
 *
 * Built by Agent A (UI Velocity Specialist) - T016
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { TemplateContext } from '../types/ScaffoldTypes';

export class TemplateEngine {
  private templateCache: Map<string, string> = new Map();

  /**
   * Render a template file with context variables
   */
  async renderTemplate(
    templatePath: string,
    outputPath: string,
    context: TemplateContext
  ): Promise<void> {
    try {
      const template = await this.loadTemplate(templatePath);
      const rendered = this.processTemplate(template, context);

      await fs.writeFile(outputPath, rendered);
    } catch (error) {
      throw new Error(`Failed to render template ${templatePath}: ${error.message}`);
    }
  }

  /**
   * Load template from file with caching
   */
  private async loadTemplate(templatePath: string): Promise<string> {
    if (this.templateCache.has(templatePath)) {
      return this.templateCache.get(templatePath)!;
    }

    try {
      const content = await fs.readFile(templatePath, 'utf-8');
      this.templateCache.set(templatePath, content);
      return content;
    } catch (error) {
      throw new Error(`Failed to load template ${templatePath}: ${error.message}`);
    }
  }

  /**
   * Process template with variable substitution
   */
  private processTemplate(template: string, context: TemplateContext): string {
    let result = template;

    // Process simple variable substitution {{variable}}
    result = this.processVariables(result, context);

    // Process conditional blocks {{#if condition}} ... {{/if}}
    result = this.processConditionals(result, context);

    // Process loops {{#each array}} ... {{/each}}
    result = this.processLoops(result, context);

    // Process includes {{include "template.path"}}
    result = this.processIncludes(result, context);

    // Process date formatting {{date format="YYYY-MM-DD"}}
    result = this.processDates(result, context);

    return result;
  }

  /**
   * Process variable substitution
   */
  private processVariables(template: string, context: TemplateContext): string {
    // Match {{variable}} pattern
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
      const value = this.getNestedValue(context, path);
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Process conditional blocks
   */
  private processConditionals(template: string, context: TemplateContext): string {
    // Match {{#if condition}} ... {{/if}} blocks
    const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;

    return template.replace(ifRegex, (match, condition, content) => {
      const value = this.getNestedValue(context, condition);
      return this.isTruthy(value) ? content : '';
    });
  }

  /**
   * Process loop blocks
   */
  private processLoops(template: string, context: TemplateContext): string {
    // Match {{#each array}} ... {{/each}} blocks
    const eachRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;

    return template.replace(eachRegex, (match, arrayName, content) => {
      const array = this.getNestedValue(context, arrayName);

      if (!Array.isArray(array)) {
        return '';
      }

      return array.map((item, index) => {
        let itemContent = content;

        // Replace {{this}} with current item
        itemContent = itemContent.replace(/\{\{this\}\}/g, String(item));

        // Replace {{@index}} with current index
        itemContent = itemContent.replace(/\{\{@index\}\}/g, String(index));

        // If item is an object, replace {{property}} with item.property
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => {
            const itemRegex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            itemContent = itemContent.replace(itemRegex, String(item[key]));
          });
        }

        return itemContent;
      }).join('');
    });
  }

  /**
   * Process include directives
   */
  private processIncludes(template: string, context: TemplateContext): string {
    // Match {{include "template.path"}} directives
    const includeRegex = /\{\{include\s+"([^"]+)"\}\}/g;

    return template.replace(includeRegex, async (match, templatePath) => {
      try {
        const fullPath = path.join(__dirname, '../../templates', templatePath);
        const includedTemplate = await this.loadTemplate(fullPath);
        return this.processTemplate(includedTemplate, context);
      } catch (error) {
        return `<!-- Include failed: ${templatePath} -->`;
      }
    });
  }

  /**
   * Process date formatting
   */
  private processDates(template: string, context: TemplateContext): string {
    // Match {{date format="YYYY-MM-DD"}} pattern
    const dateRegex = /\{\{date\s+format="([^"]+)"\}\}/g;

    return template.replace(dateRegex, (match, format) => {
      const date = context.timestamp || new Date();
      return this.formatDate(date, format);
    });
  }

  /**
   * Get nested value from context using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Check if value is truthy
   */
  private isTruthy(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
  }

  /**
   * Format date according to format string
   */
  private formatDate(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Clear template cache
   */
  clearCache(): void {
    this.templateCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.templateCache.size,
      keys: Array.from(this.templateCache.keys())
    };
  }
}