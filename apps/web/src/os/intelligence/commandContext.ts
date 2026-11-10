/** Which parts of Company Intelligence each demo command "reads" (shown in the command interface). */
const USES: Record<string, string[]> = {
  'Build me a website': ['Brand', 'Products', 'Audience'],
  'Analyze my sales': ['Goals', 'Products', 'Pricing'],
  'Create a campaign': ['Audience', 'Brand', 'Goals'],
  'Generate content': ['Brand voice', 'Audience'],
  'Research competitors': ['Industry', 'Market', 'Positioning'],
  'Find hidden revenue': ['Goals', 'Opportunities', 'Customers'],
  'Show me what needs attention': ['Goals', 'Competitors', 'Analytics'],
}
export const usesFor = (label: string) => USES[label] ?? ['Company profile']