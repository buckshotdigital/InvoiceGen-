import Header from '@/components/Header';
import InvoiceForm from '@/components/InvoiceForm';

export const metadata = {
  title: 'Create Invoice - InvoiceGen',
  description: 'Create a professional invoice in seconds',
};

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <InvoiceForm />
    </div>
  );
}
