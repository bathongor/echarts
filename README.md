# Next.js + TypeScript + shadcn/ui + Apache ECharts

A modern web application stack featuring Next.js 15 with TypeScript, shadcn/ui components, and Apache ECharts for data visualization.

## 🚀 Features

- **Next.js 15** - React framework with App Router and TypeScript support
- **shadcn/ui** - Beautiful, accessible components built with Radix UI and Tailwind CSS
- **Apache ECharts** - Powerful charting library with rich interactive features
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

## 📦 What's Included

- ✅ Next.js project initialized with TypeScript
- ✅ shadcn/ui configured with basic components (Button, Card, Input)
- ✅ Apache ECharts installed with TypeScript types
- ✅ Reusable `EChartsWrapper` component
- ✅ Interactive demo page with multiple chart types
- ✅ Responsive design with modern UI components

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

The project is already set up! Just run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Using ECharts

The project includes a reusable `EChartsWrapper` component located at `src/components/EChartsWrapper.tsx`. Here's how to use it:

```tsx
import EChartsWrapper from '@/components/EChartsWrapper';
import * as echarts from 'echarts';

const chartOption: echarts.EChartsOption = {
  title: {
    text: 'My Chart'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [150, 230, 224, 218, 135, 147, 260],
    type: 'line'
  }]
};

export default function MyComponent() {
  return (
    <EChartsWrapper 
      option={chartOption}
      style={{ height: '400px', width: '100%' }}
    />
  );
}
```

## 🎨 Adding More shadcn/ui Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add form
```

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and shadcn/ui CSS variables
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main demo page
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── EChartsWrapper.tsx   # Reusable ECharts component
└── lib/
    └── utils.ts             # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Apache ECharts Documentation](https://echarts.apache.org/en/option.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🎯 Next Steps

1. Explore the interactive demo on the homepage
2. Customize the `EChartsWrapper` component for your needs
3. Add more shadcn/ui components as required
4. Check out the ECharts gallery for more chart types
5. Customize the theme with Tailwind CSS

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using Next.js, TypeScript, shadcn/ui, and Apache ECharts