const dsaProblemExplainer = {
  id: 'dsa-problem-explainer',

  name: 'DSA Problem Explainer',

  description:
    'Explains DSA problems with intuition, optimized approaches, dry runs, and complexity analysis.',

  category: 'Education',

  icon: 'Brain',

  provider: 'any',

  defaultProvider: 'openai',

  model: 'gpt-4o',

  inputs: [
    {
      id: 'problem_statement',
      label: 'Problem Statement',
      type: 'textarea',
      placeholder: 'Paste your DSA problem here...',
      required: true,
    },
  ],

  systemPrompt: `
You are an expert DSA tutor.

Explain the given DSA problem clearly.

Include:
- problem understanding
- brute force approach
- optimized approach
- dry run
- time complexity
- space complexity
- edge cases

Use beginner-friendly explanations.
Format output in markdown.
`,

  outputType: 'markdown',
};

export default dsaProblemExplainer;