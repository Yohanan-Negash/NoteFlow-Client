import Navbar from '../components/navbar';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <div className='pt-32'>
        <div className='max-w-3xl mx-auto mt-12 p-6'>{children}</div>
      </div>
    </div>
  );
}
