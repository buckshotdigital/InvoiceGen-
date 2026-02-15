'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPatients } from '@/lib/queries';
import Link from 'next/link';
import { PatientForm } from '@/components/patient-form';
import { useState, useMemo } from 'react';
import { Plus, Search, UserPlus, ChevronRight } from 'lucide-react';
import { Avatar } from '@/components/avatar';
import { EmptyState } from '@/components/empty-state';
import { PatientListSkeleton } from '@/components/skeletons';
import { Button, Input } from '@/components/form-field';

export default function PatientsPage() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const { data: patients, isLoading, refetch } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
  });

  const filtered = useMemo(() => {
    if (!patients) return [];
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.phone_number?.toLowerCase().includes(q)
    );
  }, [patients, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Patients</h1>
          {patients && patients.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {patients.length}
            </span>
          )}
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="md">
          <Plus className="w-4 h-4" />
          Add Patient
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl shadow-soft-lg bg-white dark:bg-card p-6 animate-slide-up">
          <h2 className="font-semibold mb-4">New Patient Setup</h2>
          <PatientForm
            onSuccess={() => {
              setShowForm(false);
              refetch();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Search */}
      {patients && patients.length > 0 && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11"
            />
          </div>
          {search && (
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {patients.length} patients
            </p>
          )}
        </div>
      )}

      {isLoading ? (
        <PatientListSkeleton />
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((patient: any, i: number) => (
            <Link
              key={patient.id}
              href={`/dashboard/patients/${patient.id}`}
              className="flex items-center justify-between rounded-2xl shadow-soft bg-white dark:bg-card p-4 hover:shadow-soft-lg transition-all group animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <Avatar name={patient.name} size="md" />
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.phone_number}</p>
                  <div className="flex gap-2 mt-1">
                    {patient.medications
                      ?.filter((m: any) => m.is_active)
                      .map((med: any) => (
                        <span
                          key={med.id}
                          className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium"
                        >
                          {med.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          ))}
        </div>
      ) : patients && patients.length > 0 ? (
        <EmptyState
          icon={Search}
          title="No matches"
          description={`No patients matching "${search}"`}
        />
      ) : (
        <EmptyState
          icon={UserPlus}
          title="No patients yet"
          description="Add your first patient to start tracking their medications"
        />
      )}
    </div>
  );
}
