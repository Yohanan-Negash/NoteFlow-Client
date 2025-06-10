import NotebookList from '../components/notebook-list';

export default function HomePage() {
  return (
    <>
      <h2 className='text-2xl font-semibold text-secondary mb-4'>
        Welcome to NoteFlow
      </h2>
      <p className='text-foreground mb-8'>
        Select Quick Notes or Notebooks from the navigation above to get
        started.
      </p>
      <NotebookList />
    </>
  );
}
