import { use } from 'react';
import { NotebookClient } from './notebook-client';

interface NotebookPageProps {
  params: Promise<{ id: string }>;
}

const NOTEBOOKS = [
  { id: 1, name: 'Projects' },
  { id: 2, name: 'Learnings' },
  { id: 3, name: 'Something else' },
];

export default function NotebookPage({ params }: NotebookPageProps) {
  const { id } = use(params);
  const notebook = NOTEBOOKS.find((n) => n.id === parseInt(id, 10));

  if (!notebook) {
    return <div>Notebook not found</div>;
  }

  return <NotebookClient notebookName={notebook.name} />;
}
