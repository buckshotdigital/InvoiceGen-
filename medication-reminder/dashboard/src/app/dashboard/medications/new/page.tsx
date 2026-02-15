'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { MedicationForm } from '@/components/medication-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function NewMedicationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get('patient_id');

  if (!patientId) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">No patient selected</p>
        <Link href="/dashboard/patients" className="text-primary hover:underline text-sm">
          Go to Patients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Add Medication</h1>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-card">
        <MedicationForm
          patientId={patientId}
          onSuccess={() => router.push(`/dashboard/patients/${patientId}`)}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}

export default function NewMedicationPage() {
  return (
    <Suspense fallback={<div className="h-64 rounded-lg animate-shimmer" />}>
      <NewMedicationContent />
    </Suspense>
  );
}
