'use client';

import { useState } from 'react';
import { createPatient } from '@/lib/queries';
import { FormField, Input, Select, Button } from '@/components/form-field';
import { useToast } from '@/components/toast';

interface PatientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PatientForm({ onSuccess, onCancel }: PatientFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      await createPatient({
        patient_name: form.get('patient_name') as string,
        patient_phone: form.get('patient_phone') as string,
        medication_name: form.get('medication_name') as string,
        medication_dosage: form.get('medication_dosage') as string || undefined,
        medication_description: form.get('medication_description') as string || undefined,
        reminder_time: form.get('reminder_time') as string,
        timezone: form.get('timezone') as string || 'America/Toronto',
      });
      toast('Patient created successfully', 'success');
      onSuccess();
    } catch (err) {
      toast((err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Patient Name" required>
          <Input
            name="patient_name"
            required
            placeholder="e.g. Margaret Smith"
          />
        </FormField>
        <FormField label="Phone Number" required>
          <Input
            name="patient_phone"
            required
            type="tel"
            placeholder="+1234567890"
          />
        </FormField>
        <FormField label="Medication Name" required>
          <Input
            name="medication_name"
            required
            placeholder="e.g. Lisinopril"
          />
        </FormField>
        <FormField label="Dosage">
          <Input
            name="medication_dosage"
            placeholder="e.g. 10mg"
          />
        </FormField>
        <FormField label="Description">
          <Input
            name="medication_description"
            placeholder="e.g. small white pill for blood pressure"
          />
        </FormField>
        <FormField label="Reminder Time" required>
          <Input
            name="reminder_time"
            required
            type="time"
            defaultValue="09:00"
          />
        </FormField>
        <FormField label="Timezone">
          <Select name="timezone" defaultValue="America/Toronto">
            <option value="America/Toronto">Eastern (Toronto)</option>
            <option value="America/Chicago">Central (Chicago)</option>
            <option value="America/Denver">Mountain (Denver)</option>
            <option value="America/Los_Angeles">Pacific (Los Angeles)</option>
            <option value="America/Vancouver">Pacific (Vancouver)</option>
            <option value="Europe/London">GMT (London)</option>
          </Select>
        </FormField>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          Create Patient
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
