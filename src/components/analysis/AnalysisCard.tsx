import { type ReactNode } from 'react';

export interface AnalysisCardProps {
  title: string;
  children: ReactNode;
}

export function AnalysisCard({ title, children }: AnalysisCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}